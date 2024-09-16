from rest_framework import serializers

from account.serializers import ProfileSerializer
from .models import Conversation, Message
from .models import Profile  # Import Profile model
 
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'text', 'sender', 'conversation',  'timestamp', "seen_by", "delivered_to", "status" ]
        extra_kwargs = {
            'timestamp': {'read_only': True}, 
        }



class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.IntegerField(source='last_message.id', read_only=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'name', 'profiles', 'timestamp', 'is_group', 'image', 'active_profiles', "last_message"]
        read_only_fields = [ 'timestamp', ]

            
    def get_name(self, obj):
        """Returns the conversation name or randomly fetches up to three first names for group conversations."""
        if obj.name:
            return obj.name

        if obj.is_group:
            # Fetch up to 3 random profiles from the database without loading all profiles
            random_profiles = obj.profiles.order_by('?').values_list('first_name', flat=True)[:3]
            return ', '.join(random_profiles) or "Group Conversation"

        # For one-on-one chats, exclude the current user's profile
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            other_profile_name = obj.profiles.exclude(user=request.user).values_list('first_name', flat=True).first()
            if other_profile_name:
                return other_profile_name

        return "Unknown"
        
