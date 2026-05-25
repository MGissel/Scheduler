from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Attendance
        fields = ["id", "student", "schedule_entry", "status", "note"]
        read_only_fields = ["id"]


class AttendanceReadSerializer(serializers.ModelSerializer):
    student_name   = serializers.CharField(source="student.name", read_only=True)
    schedule_info  = serializers.StringRelatedField(source="schedule_entry", read_only=True)

    class Meta:
        model  = Attendance
        fields = ["id", "student_name", "schedule_info", "status", "note"]