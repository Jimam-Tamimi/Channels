# your_app/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Profile, User

class UserAdminConfig(UserAdmin):
    model = User
    list_display = ('username', 'email', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)
    filter_horizontal = ('user_permissions',)

admin.site.register(User, UserAdminConfig)

# Customize the Profile admin view
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'active_channel_name', 'last_active', 'timestamp')  # Fields to display in list view
    search_fields = ('user__username', 'first_name', 'last_name')  # Enable search by these fields
    list_filter = ('active_channel_name', 'timestamp')  # Add filters for easy filtering
    readonly_fields = ('timestamp', 'last_active')  # Make these fields read-only

# Register the Profile model in the admin site
admin.site.register(Profile, ProfileAdmin)