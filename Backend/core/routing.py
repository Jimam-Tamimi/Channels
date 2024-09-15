from django.urls import re_path
from channels_app.consumers import ProfileConsumer  # Ensure the path is correct

websocket_urlpatterns = [
    re_path(r'ws/(?P<profile_id>\d+)/$', ProfileConsumer.as_asgi()),
]
