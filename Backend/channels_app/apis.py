from rest_framework.viewsets import ModelViewSet

from channels_app.pagination import ConversationPagination, MessagePagination
from channels_app.filters import ConversationFilter
from channels_app.permissions import IsConversationParticipant
from .models import Conversation, Message
from .serializers import  ConversationSerializer, MessageSerializer
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination


 
    
class ConversationViewSet(ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ConversationFilter
    pagination_class = ConversationPagination

    def get_queryset(self):
        user_profile = self.request.user.profile
        return Conversation.objects.filter(profiles=user_profile).prefetch_related('profiles', 'messages').order_by("-id")

    def perform_create(self, serializer):
        # Perform any additional logic when creating a Channel, if needed
        serializer.save()
        
    

 


# class MessageViewSet(ModelViewSet):
#     """
#     A viewset that provides the standard actions
#     for the Message model, ensuring only users
#     who are part of the conversation can access messages.
#     """
#     queryset = Message.objects.all() 
#     serializer_class = MessageSerializer
#     permission_classes = [IsConversationParticipant]  # Ensure only conversation participants have access

#     def get_queryset(self):
#         # Get the logged-in user profile (assuming it's linked to the request user)
#         user_profile = self.request.user.profile

#         # Filter messages where the user is part of the conversation
#         return Message.objects.filter(conversation__profiles=user_profile).order_by('-id')

#     def retrieve(self, request, *args, **kwargs):
#         # Get the specific message being accessed
#         message = self.get_object()

#         # Ensure the user is part of the conversation
#         if request.user.profile not in message.conversation.profiles.all():
#             raise PermissionDenied("You are not part of this conversation and cannot access this message.")
        
#         return super().retrieve(request, *args, **kwargs)

#     @action(detail=False, methods=['get'], url_path='messages-for-conversation/(?P<conversation_id>[^/.]+)', permission_classes=[IsAuthenticated])
#     def messages_for_conversation(self, request, conversation_id=None):
#         """
#         Custom action to get all messages for a specific conversation.
#         The conversation ID will be passed as a parameter.
#         """
#         # Get the logged-in user profile
#         user_profile = request.user.profile

#         # Get the conversation by ID and ensure the user is part of it
#         try:
#             conversation = Conversation.objects.get(id=conversation_id)
#         except Conversation.DoesNotExist:
#             return Response({"detail": "Conversation not found."}, status=404)

#         # Check if the user is a participant in the conversation
#         if user_profile not in conversation.profiles.all():
#             raise PermissionDenied("You are not part of this conversation.")

#         # Get all messages for the conversation
#         messages = Message.objects.filter(conversation=conversation).order_by('-timestamp')

#         # Serialize the messages
#         serializer = self.get_serializer(messages, many=True)
#         return Response(serializer.data)\
        
        

class MessageViewSet(ModelViewSet):
    """
    A viewset that provides the standard actions
    for the Message model, ensuring only users
    who are part of the conversation can access messages.
    """
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsConversationParticipant]
    pagination_class = MessagePagination

    def get_queryset(self):
        user_profile = self.request.user.profile
        return Message.objects.filter(conversation__profiles=user_profile)

    def retrieve(self, request, *args, **kwargs):
        message = self.get_object()

        if request.user.profile not in message.conversation.profiles.all():
            raise PermissionDenied("You are not part of this conversation and cannot access this message.")
        
        return super().retrieve(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='messages-for-conversation/(?P<conversation_id>[^/.]+)', permission_classes=[IsAuthenticated])
    def messages_for_conversation(self, request, conversation_id=None):
        """
        Custom action to get all messages for a specific conversation.
        The conversation ID will be passed as a parameter.
        """
        user_profile = request.user.profile

        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({"detail": "Conversation not found."}, status=404)

        if user_profile not in conversation.profiles.all():
            raise PermissionDenied("You are not part of this conversation.")

        # Get all messages for the conversation and apply pagination
        messages = Message.objects.filter(conversation=conversation).order_by('-timestamp')
        paginator = self.pagination_class()
        paginated_messages = paginator.paginate_queryset(messages, request)
        serializer = self.get_serializer(paginated_messages, many=True)
        return paginator.get_paginated_response(serializer.data)