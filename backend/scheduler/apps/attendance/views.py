from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Attendance
from .serializers import AttendanceSerializer, AttendanceReadSerializer
from scheduler.apps.users.permissions import IsTeacherOrAdmin


class AttendanceListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsTeacherOrAdmin]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AttendanceSerializer
        return AttendanceReadSerializer

    def get_queryset(self):
        qs = Attendance.objects.all()
        student        = self.request.query_params.get("student")
        schedule_entry = self.request.query_params.get("schedule_entry")
        status         = self.request.query_params.get("status")
        if student:
            qs = qs.filter(student=student)
        if schedule_entry:
            qs = qs.filter(schedule_entry=schedule_entry)
        if status:
            qs = qs.filter(status=status)
        return qs


class MyAttendanceView(generics.ListAPIView):
    serializer_class   = AttendanceReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Attendance.objects.filter(student=self.request.user)


class AttendanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Attendance.objects.all()
    serializer_class   = AttendanceSerializer
    permission_classes = [IsTeacherOrAdmin]