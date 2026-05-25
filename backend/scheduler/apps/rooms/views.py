from rest_framework import generics
from .models import Room, RoomBooking
from .serializers import RoomSerializer, RoomBookingSerializer
from scheduler.apps.users.permissions import IsAdmin, IsTeacherOrAdmin


class RoomListCreateView(generics.ListCreateAPIView):
    queryset           = Room.objects.all()
    serializer_class   = RoomSerializer
    permission_classes = [IsTeacherOrAdmin]


class RoomDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Room.objects.all()
    serializer_class   = RoomSerializer
    permission_classes = [IsAdmin]


class RoomBookingListCreateView(generics.ListCreateAPIView):
    serializer_class   = RoomBookingSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        return RoomBooking.objects.filter(user=self.request.user)


class RoomBookingDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = RoomBookingSerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        return RoomBooking.objects.filter(user=self.request.user)