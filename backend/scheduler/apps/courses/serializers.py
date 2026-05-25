from rest_framework import serializers
from .models import Subject, Course


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Subject
        fields = ["id", "name", "description"]


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Course
        fields = ["id", "subject", "teacher", "class_group", "semester"]