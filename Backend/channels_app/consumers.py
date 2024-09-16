import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Profile, Message, Conversation
from .serializers import MessageSerializer
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer

class ProfileConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
 
        self.profile_id = self.scope['url_route']['kwargs'].get('profile_id')

        try: 
            self.profile = await database_sync_to_async(Profile.objects.get)(id=self.profile_id)
 
            await self.accept()
            self.profile.active_channel_name = self.channel_name
            await database_sync_to_async(self.profile.save)()


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
        message_id = content.get('id', None)
        message_text = content.get('text', None)
        conversation_id = content.get('conversation_id', None)
        print(content)
        print(not message_text or not conversation_id)
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
        conversation_profiles = await self.get_channel_profiles(conversation_id)
        message_data = await self.serialize_message(message)
        message_data['uuid'] = content.get('uuid', None)
        for profile in conversation_profiles:
            if profile.active_channel_name:
                print(profile.active_channel_name)
                await self.channel_layer.send(
                    profile.active_channel_name,
                    {
                        'type': 'send_message',
                        'message': message_data
                    }
                ) 
 

    @database_sync_to_async
    def get_channel_profiles(self, conversation_id):
        conversation = Conversation.objects.get(id=conversation_id)
        return list(conversation.profiles.all())
    @database_sync_to_async
    def serialize_message(self, message):
        return MessageSerializer(message).data

 
    async def send_message(self, event):
        # Send the message to WebSocket
        print(event)
        await self.send_json(event)
