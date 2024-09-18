import django_filters
from django.db.models import Q
from .models import Conversation

class ConversationFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_by_all_fields')

    class Meta:
        model = Conversation
        fields = ['search']

    def filter_by_all_fields(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) |
            Q(profiles__first_name__icontains=value) |
            Q(profiles__last_name__icontains=value) |
            Q(profiles__user__username__icontains=value) |
            Q(profiles__user__email__icontains=value)
        ).distinct()
