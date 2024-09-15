from django.contrib import admin
from .models import Channel, Message

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'timestamp', 'is_group')
    search_fields = ('name',)
    filter_horizontal = ('profiles',)  # To display ManyToMany relationships in the admin panel
    readonly_fields = ('timestamp',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related('profiles')

    def active_profiles(self, obj):
        return ', '.join([profile.user.username for profile in obj.active_profiles])
    active_profiles.short_description = 'Active Profiles'


 

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('text', 'profile', 'channel', 'status', 'timestamp')
    list_filter = ('status', 'channel', 'profile')
    search_fields = ('text', 'profile__user__username', 'channel__name')
    date_hierarchy = 'timestamp'
    ordering = ('-timestamp',)

    # Optionally add more configuration for detail view
 
