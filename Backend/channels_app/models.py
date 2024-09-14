from django.db import models
from django.utils import timezone
from account.models import Profile  # Import your Profile model

class Channel(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    channel_profiles = models.ManyToManyField(Profile, related_name='channels')  # Reference Profile model
    timestamp = models.DateTimeField(default=timezone.now)
    is_group = models.BooleanField(default=False)
    image = models.ImageField(upload_to='channel_images/', blank=True, null=True)
    
    @property
    def active_profiles(self):
        """Returns a list of active profiles (where active_status is True)."""
        return [profile.id for profile in self.channel_profiles.all() if profile.active_status]

    def __str__(self):
        return self.name if self.is_group else ', '.join(profile.user.username for profile in self.channel_profiles.all())

    class Meta:
        verbose_name = 'Channel'
        verbose_name_plural = 'Channels'
