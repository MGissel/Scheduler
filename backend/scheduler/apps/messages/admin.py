from django.contrib import admin
from .models import Message


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display  = ["subject", "sender", "recipient", "created_at", "read_at"]
    list_filter   = ["created_at"]
    search_fields = ["subject", "sender__name", "recipient__name"]