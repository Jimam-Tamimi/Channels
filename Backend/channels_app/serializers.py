from rest_framework import serializers

from account.serializers import ProfileSerializer
from .models import Conversation, Message
from .models import Profile  # Import Profile model
 
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'text', 'sender', 'conversation',  'timestamp', "seen_by", "delivered_to" ]
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
        """Returns the conversation name based on whether it is a group or one-on-one."""
        if obj.is_group:
            return obj.name or "Group Conversation"
        else:
            # Exclude the current user's profile to get the other profile's name
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                current_user = request.user
                other_profiles = obj.profiles.exclude(user=current_user)  # Adjusted line
                if other_profiles.exists():
                    other_profile = other_profiles.first()
                    print(other_profile)
                    return f"{other_profile.first_name} {other_profile.last_name}"
            return "Unknown"

 
