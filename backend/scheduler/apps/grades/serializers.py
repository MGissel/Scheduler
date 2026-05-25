from rest_framework import serializers
from .models import Grade


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Grade
        fields = ["id", "student", "course", "assignment", "score", "comment", "created_at"]
        read_only_fields = ["id", "created_at"]


class GradeReadSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    course_name  = serializers.CharField(source="course.subject.name", read_only=True)

    class Meta:
        model  = Grade
        fields = ["id", "student_name", "course_name", "assignment", "score", "comment", "created_at"]