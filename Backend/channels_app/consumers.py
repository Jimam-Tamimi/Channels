import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .models import Profile, Message, Channel
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
        message_text = content.get('text')
        channel_id = content.get('channel_id')
        print(content)
        if not message_text or not channel_id:
            await self.send_json({'error': 'Invalid message format'})
            return

 
        channel = await database_sync_to_async(Channel.objects.get)(id=channel_id)
        message =  await database_sync_to_async(Message.objects.create)(
            text=message_text,
            profile=self.profile,
            channel=channel,
            status='PENDING'
        )
 

        # Send message to each connected profile
        channel_profiles = await self.get_channel_profiles(channel_id)
        for profile in channel_profiles:
            if profile.active_channel_name:
                print(profile.active_channel_name)
                await self.channel_layer.send(
                    profile.active_channel_name,
                    {
                        'type': 'chat.message',
                        'message': MessageSerializer(message).data
                    }
                ) 

    @database_sync_to_async
    def get_profile(self, profile_id):
        return Profile.objects.get(id=profile_id)

    @database_sync_to_async
    def save_profile(self, profile):
        profile.save()

    @database_sync_to_async
    def get_channel(self, channel_id):
        return Channel.objects.get(id=channel_id)

    @database_sync_to_async
    def get_channel_name(self, profile):
        return f"{profile.user.username}_channel_name_{profile.user.id}"

    @database_sync_to_async
    def get_channel_profiles(self, channel_id):
        channel = Channel.objects.get(id=channel_id)
        return list(channel.profiles.all())

    @database_sync_to_async
    def create_message(self, text, profile_id, channel_id):
        profile = Profile.objects.get(id=profile_id)
        channel = Channel.objects.get(id=channel_id)
        return Message.objects.create(
            text=text,
            profile=profile,
            channel=channel,
            status='PENDING'
        )

    async def chat_message(self, event):
        # Send the message to WebSocket
        print(event)
        await self.send_json(event['message'])
