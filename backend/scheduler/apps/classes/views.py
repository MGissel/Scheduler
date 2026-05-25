from rest_framework import generics
from .models import ClassGroup
from .serializers import ClassGroupSerializer
from scheduler.apps.users.permissions import IsAdmin, IsTeacherOrAdmin


class ClassGroupListCreateView(generics.ListCreateAPIView):
    queryset           = ClassGroup.objects.all()
    serializer_class   = ClassGroupSerializer
    permission_classes = [IsTeacherOrAdmin]


class ClassGroupDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = ClassGroup.objects.all()
    serializer_class   = ClassGroupSerializer
    permission_classes = [IsAdmin]