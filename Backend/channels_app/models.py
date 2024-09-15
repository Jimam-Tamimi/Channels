from django.db import models
from django.utils import timezone
from account.models import Profile  # Import your Profile model
from django.contrib.auth import get_user_model

User = get_user_model()
class Channel(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    profiles = models.ManyToManyField(Profile, related_name='channels')  # Reference Profile model
    timestamp = models.DateTimeField(default=timezone.now)
    is_group = models.BooleanField(default=False)
    image = models.ImageField(upload_to='channel_images/', blank=True, null=True)
    
    @property
    def active_profiles(self):
        """Returns a list of active profiles (where active_status is True)."""
        return [profile.id for profile in self.profiles.all() if profile.active_status]

    def __str__(self):
        return self.name if self.is_group else ', '.join(profile.user.username for profile in self.profiles.all())

    class Meta:
        verbose_name = 'Channel'
        verbose_name_plural = 'Channels'



class Message(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    profile = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'PENDING'),
            ('SENT', 'SENT'),
            ('DELIVERED', 'DELIVERED'),
            ('SEEN', 'SEEN'),
            ('FAILED', 'FAILED'),
        ]
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    

    # Optionally add fields for media, if needed
    # image = models.URLField(blank=True, null=True)
    # video = models.URLField(blank=True, null=True)
    # audio = models.URLField(blank=True, null=True)
    # system = models.BooleanField(default=False)