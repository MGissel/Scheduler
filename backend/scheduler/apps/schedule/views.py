from rest_framework import generics
from .models import TimeSlot, ScheduleEntry
from .serializers import TimeSlotSerializer, ScheduleEntrySerializer
from scheduler.apps.users.permissions import IsAdmin, IsTeacherOrAdmin


class TimeSlotListCreateView(generics.ListCreateAPIView):
    queryset           = TimeSlot.objects.all()
    serializer_class   = TimeSlotSerializer
    permission_classes = [IsAdmin]


class TimeSlotDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = TimeSlot.objects.all()
    serializer_class   = TimeSlotSerializer
    permission_classes = [IsAdmin]


class ScheduleEntryListCreateView(generics.ListCreateAPIView):
    serializer_class   = ScheduleEntrySerializer
    permission_classes = [IsTeacherOrAdmin]

    def get_queryset(self):
        qs = ScheduleEntry.objects.all()
        week = self.request.query_params.get("week")
        course = self.request.query_params.get("course")
        if week:
            qs = qs.filter(week=week)
        if course:
            qs = qs.filter(course=course)
        return qs


class ScheduleEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = ScheduleEntry.objects.all()
    serializer_class   = ScheduleEntrySerializer
    permission_classes = [IsAdmin]