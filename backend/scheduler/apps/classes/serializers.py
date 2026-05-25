from rest_framework import serializers
from .models import ClassGroup


class ClassGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ClassGroup
        fields = ["id", "name", "year", "homeroom_teacher"]