from rest_framework.viewsets import ModelViewSet
from .models import Channel
from .serializers import ChannelSerializer

class ChannelViewSet(ModelViewSet):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer

    def get_queryset(self):
        return Channel.objects.prefetch_related('profiles')  # Optimize performance with prefetching

    def perform_create(self, serializer):
        # Perform any additional logic when creating a Channel, if needed
        serializer.save()
