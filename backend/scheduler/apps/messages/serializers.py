from rest_framework import serializers
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model  = Message
        fields = ["id", "sender", "recipient", "subject", "body", "read_at", "created_at"]
        read_only_fields = ["id", "read_at", "created_at"]


class MessageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Message
        fields = ["read_at"]