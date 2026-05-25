from django.utils import timezone
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message
from .serializers import MessageSerializer, MessageReadSerializer


class InboxView(generics.ListAPIView):
    serializer_class   = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(recipient=self.request.user)


class SentView(generics.ListAPIView):
    serializer_class   = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(sender=self.request.user)


class MessageCreateView(generics.CreateAPIView):
    serializer_class   = MessageSerializer
    permission_classes = [IsAuthenticated]


class MessageDetailView(generics.RetrieveAPIView):
    serializer_class   = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(recipient=self.request.user)


class MessageMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            message = Message.objects.get(pk=pk, recipient=request.user)
        except Message.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if not message.read_at:
            message.read_at = timezone.now()
            message.save()
        return Response(MessageSerializer(message).data)