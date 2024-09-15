from django.db import models
from django.utils import timezone
from account.models import Profile  # Import your Profile model
from django.contrib.auth import get_user_model

User = get_user_model()



class Conversation(models.Model):
    name = models.CharField(max_length=255, blank=True, null=True)
    profiles = models.ManyToManyField(Profile, related_name='channels')  # Reference Profile model
    timestamp = models.DateTimeField(default=timezone.now)
    is_group = models.BooleanField(default=False)
    image = models.ImageField(upload_to='channel_images/', blank=True, null=True)
    
    @property
    def active_profiles(self):
        """Returns a list of active profile IDs (where active_status is True)."""
        return list(self.profiles.filter(active_channel_name__isnull=False).values_list('id', flat=True))

    @property
    def last_message(self):
        """Returns the latest message in the conversation."""
        return self.messages.order_by('-timestamp').first()

 

    def __str__(self):
        if self.is_group:
            return self.name or "Group Conversation"
        else:
            return ', '.join(profile.user.username for profile in self.profiles.all())

    class Meta:
        verbose_name = 'Conversation'
        verbose_name_plural = 'Conversations'
        ordering = ['-timestamp']  # Example ordering by timestamp

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    text = models.TextField()
    sender = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True)
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')  # Add related_name
    seen_by = models.ManyToManyField(Profile, related_name='seen_messages')  # Reference Profile model
    delivered_to = models.ManyToManyField(Profile, related_name='delivered_messages')  # Reference Profile model

    @property
    def status(self):
        # Exclude the sender profile from the check
        other_profiles_delivered = self.delivered_to.exclude(id=self.profile.id)
        other_profiles_seen = self.seen_by.exclude(id=self.profile.id)

        if other_profiles_seen.exists():
            return 'SEEN'
        elif other_profiles_delivered.exists():
            return 'DELIVERED'
        else:
            return 'SENT'

    
    timestamp = models.DateTimeField(auto_now_add=True)
    

    # Optionally add fields for media, if needed
    # image = models.URLField(blank=True, null=True)
    # video = models.URLField(blank=True, null=True)
    # audio = models.URLField(blank=True, null=True)
    # system = models.BooleanField(default=False)