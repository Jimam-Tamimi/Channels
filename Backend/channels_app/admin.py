from django.contrib import admin
from .models import Conversation, Message

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
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
    list_display = ("status", 'text', 'sender', 'conversation',  'timestamp')
    list_filter = ( 'conversation', 'sender')
    search_fields = ('text', 'sender__user__username', 'conversation__name')
    date_hierarchy = 'timestamp'
    ordering = ('-timestamp',)
    
    fieldsets = (
        (None, {
            'fields': ('text', 'sender', 'conversation', 'seen_by', 'delivered_to')
        }),
    )