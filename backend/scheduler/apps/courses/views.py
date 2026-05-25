from rest_framework import generics
from .models import Subject, Course
from .serializers import SubjectSerializer, CourseSerializer
from scheduler.apps.users.permissions import IsAdmin, IsTeacherOrAdmin


class SubjectListCreateView(generics.ListCreateAPIView):
    queryset           = Subject.objects.all()
    serializer_class   = SubjectSerializer
    permission_classes = [IsTeacherOrAdmin]


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Subject.objects.all()
    serializer_class   = SubjectSerializer
    permission_classes = [IsAdmin]


class CourseListCreateView(generics.ListCreateAPIView):
    queryset           = Course.objects.all()
    serializer_class   = CourseSerializer
    permission_classes = [IsTeacherOrAdmin]


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Course.objects.all()
    serializer_class   = CourseSerializer
    permission_classes = [IsAdmin]