from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .apis import ConversationViewSet, MessageViewSet  

router = SimpleRouter()
router.register(r'conversations', ConversationViewSet)
router.register(r'messages', MessageViewSet, basename='message')

urlpatterns = [

] + router.urls
