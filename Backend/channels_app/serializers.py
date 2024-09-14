from rest_framework import serializers

from account.serializers import ProfileSerializer
from .models import Channel
from .models import Profile  # Import Profile model
 

class ChannelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Channel
        fields = ['id', 'name', 'channel_profiles', 'timestamp', 'is_group', 'image', 'active_profiles']
        read_only_fields = [ 'timestamp', ]
