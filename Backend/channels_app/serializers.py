from rest_framework import serializers

from account.serializers import ProfileSerializer
from .models import Channel, Message
from .models import Profile  # Import Profile model
 

class ChannelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Channel
        fields = ['id', 'name', 'profiles', 'timestamp', 'is_group', 'image', 'active_profiles']
        read_only_fields = [ 'timestamp', ]

        
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'text', 'profile', 'channel', 'status', 'timestamp',  ]
        extra_kwargs = {
            'timestamp': {'read_only': True},
            'status': {'required': True}
        }