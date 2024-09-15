from rest_framework.viewsets import ModelViewSet

from channels_app.permissions import IsConversationParticipant
from .models import Conversation, Message
from .serializers import  ConversationSerializer, MessageSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated

class ConversationViewSet(ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.prefetch_related('profiles')  # Optimize performance with prefetching

    def perform_create(self, serializer):
        # Perform any additional logic when creating a Channel, if needed
        serializer.save()

 

class MessageViewSet(ModelViewSet):
    """
    A viewset that provides the standard actions
    for the Message model, ensuring only users
    who are part of the conversation can access messages.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsConversationParticipant]

    def get_queryset(self):
        # Get the logged-in user profile (assuming it's linked to the request user)
        user_profile = self.request.user.profile

        # Filter messages where the user is part of the conversation
        return Message.objects.filter(conversation__profiles=user_profile)

    def retrieve(self, request, *args, **kwargs):
        # Get the specific message being accessed
        message = self.get_object()

        # Ensure the user is part of the conversation
        if request.user.profile not in message.conversation.profiles.all():
            raise PermissionDenied("You are not part of this conversation and cannot access this message.")
        
        return super().retrieve(request, *args, **kwargs)
