import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Profile, Message, Conversation
from .serializers import MessageSerializer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from asgiref.sync import sync_to_async
from django.db import transaction
from django.db.models import F
from uuid import uuid4
class ProfileConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
 
        self.profile_id = self.scope['url_route']['kwargs'].get('profile_id')

        try: 
            self.profile = await database_sync_to_async(Profile.objects.get)(id=self.profile_id)
 
            await self.accept()
            self.profile.active_channel_name = self.channel_name
            await database_sync_to_async(self.profile.save)()
            await self.all_messages_delivered_for_user()

        except Profile.DoesNotExist:
            await self.close()
            return

    async def disconnect(self, close_code):
        # Set the active_status to False (indicating the user is no longer active)
        try:
            self.profile.active_channel_name = None
            await database_sync_to_async(self.profile.save)()

        except Profile.DoesNotExist:
            pass

    async def receive_json(self, content):

        if(content.get('type', None) == "send_message"):
            data = content.get('message_data', None)
            if(data):
                message_id = data.get('id', None)
                message_text = data.get('text', None)
                conversation_id = data.get('conversation_id', None) 
                if not message_text or not conversation_id:
                    await self.send_json({'error': 'Invalid message format'})
                    return 
                conversation = await database_sync_to_async(Conversation.objects.get)(id=conversation_id)
                message =  await database_sync_to_async(Message.objects.create)(
                    id=message_id,
                    text=message_text,
                    sender=self.profile,
                    conversation=conversation,
                )  
                # Send message to each connected profile
                message_data = await self.serialize_message(message)
                message_data['uuid'] = data.get('uuid', None)
                await self.send_data_to_all_profiles_in_conversation(
                    message=message,
                    event={
                        'type': 'deliver_message',
                        'message': message_data
                    }
                )
 
        elif(content.get('type', None) == "message_delivered"):
            message_id = content.get('message_id', None)
            print(message_id)
            if(message_id):
                message =  await database_sync_to_async(Message.objects.get)(id=message_id)
                await database_sync_to_async(message.delivered_to.add)(self.profile)
                await database_sync_to_async(message.save)()
                message_data = await self.serialize_message(message)
                await self.send_data_to_all_profiles_in_conversation(
                    message=message,
                    event={
                        'type': 'message_delivered',
                        'message': message_data
                    }
                ) 
        elif(content.get('type', None) == "message_seen"):
            message_id = content.get('message_id', None)
            print(message_id)
            if(message_id):
                message =  await database_sync_to_async(Message.objects.get)(id=message_id)
                await database_sync_to_async(message.seen_by.add)(self.profile)
                await database_sync_to_async(message.save)()
                message_data = await self.serialize_message(message)
                await self.send_data_to_all_profiles_in_conversation(
                    message=message, 
                    event={
                        'type': 'message_seen',
                        'message': message_data
                    }
                ) 
        
        elif content.get('type', None) == "all_messages_seen":
            conversation_id = content.get('conversation_id', None)
            print(conversation_id)
            
            if conversation_id:
                # Retrieve all messages in the specified channel
                messages = await self.get_unseen_messages_in_conversation(conversation_id)
                bulk_messages_data = []
                for message in messages: 
                    await database_sync_to_async(message.seen_by.add)(self.profile)
                    await database_sync_to_async(message.save)()
                    message_data = await self.serialize_message(message)
                    bulk_messages_data.append(message_data)
                    print('jimam')
                if(len(bulk_messages_data)!=0):
                    await self.send_data_to_all_profiles_in_conversation(
                        message=messages[0],
                        event={
                            'type': 'bulk_messages_seen',
                            'messages': bulk_messages_data
                        }
                    )  

                
    async def all_messages_delivered_for_user(self,):
        # Send the message to WebSocket
        messages = await self.get_not_delivered_messages_to_user()
        for message in messages: 
            await database_sync_to_async(message.delivered_to.add)(self.profile)
            await database_sync_to_async(message.save)()
            message_data = await self.serialize_message(message)
            print('jimam')
            await self.send_data_to_all_profiles_in_conversation(
                message=message,
                event={
                    'type': 'message_delivered',
                    'message': message_data
                }
            )  

    async def send_data_to_all_profiles_in_conversation(self, conversation=None, message=None, event=None):
        # Send the message to WebSocket
        if(conversation):
            conversation_profiles = await self.get_conversation_profiles(conversation)
        elif(message):
            conversation_profiles = await self.get_conversation_profiles_from_message(message)
        groupName = f"conversation{str(uuid4())[0:10]}" 
        for profile in conversation_profiles:
            if profile.active_channel_name:
                await self.channel_layer.group_add(groupName, profile.active_channel_name)
        await self.channel_layer.group_send(
            groupName,
            event
        )
        
        
    #data base query functions
    
    @database_sync_to_async
    def get_conversation_profiles(self, conversation):
        return list(conversation.profiles.all())
    @database_sync_to_async
    def get_conversation_profiles_from_message(self, message):
        return list(message.conversation.profiles.all())
    @database_sync_to_async
    def serialize_message(self, message):
        return MessageSerializer(message).data 
    
    
    @database_sync_to_async
    def get_unseen_messages_in_conversation(self, conversation_id):
        unseen_message_ids = Message.objects.filter(
            conversation=conversation_id
        ).exclude(seen_by=self.profile).values_list('id', flat=True)

        if not unseen_message_ids:
            return [] 
        messages = Message.objects.filter(id__in=unseen_message_ids)
        return list(messages)
 
    
    @database_sync_to_async
    def get_not_delivered_messages_to_user(self, profile=None):
        if(profile):
            not_delivered_messages_ids = Message.objects.all().exclude(delivered_to=profile).values_list('id', flat=True)
        else:
            not_delivered_messages_ids = Message.objects.all().exclude(delivered_to=self.profile).values_list('id', flat=True)

        if not not_delivered_messages_ids:
            return [] 
        messages = Message.objects.filter(id__in=not_delivered_messages_ids)
        return list(messages)
 
    
    
    # action functions
    async def deliver_message(self, event): 
        await self.send_json(event)

    async def message_delivered(self, event): 
        print(event)
        await self.send_json(event)

    async def message_seen(self, event): 
        print(event)
        await self.send_json(event) 
    async def bulk_messages_seen(self, event): 
        print(event)
        await self.send_json(event) 