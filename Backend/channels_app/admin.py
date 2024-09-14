from django.contrib import admin
from .models import Channel

@admin.register(Channel)
class ChannelAdmin(admin.ModelAdmin):
    list_display = ('name', 'timestamp', 'is_group')
    search_fields = ('name',)
    filter_horizontal = ('channel_profiles',)  # To display ManyToMany relationships in the admin panel
    readonly_fields = ('timestamp',)

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        return queryset.prefetch_related('channel_profiles')

    def active_profiles(self, obj):
        return ', '.join([profile.user.username for profile in obj.active_profiles])
    active_profiles.short_description = 'Active Profiles'
