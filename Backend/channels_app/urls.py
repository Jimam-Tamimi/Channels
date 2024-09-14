from django.urls import path, include
from rest_framework.routers import SimpleRouter
from .apis import ChannelViewSet

router = SimpleRouter()
router.register(r'', ChannelViewSet)

urlpatterns = [

] + router.urls
