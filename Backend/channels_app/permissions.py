from rest_framework.permissions import BasePermission

class IsConversationParticipant(BasePermission):
    """
    Custom permission to check if a user is part of a conversation.
    """
    def has_object_permission(self, request, view, obj):
        # obj will be a Message instance here
        return request.user.profile in obj.conversation.profiles.all()