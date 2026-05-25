from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Grade
from .serializers import GradeSerializer, GradeReadSerializer
from scheduler.apps.users.permissions import IsTeacherOrAdmin


class GradeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsTeacherOrAdmin]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return GradeSerializer
        return GradeReadSerializer

    def get_queryset(self):
        qs = Grade.objects.all()
        student = self.request.query_params.get("student")
        course  = self.request.query_params.get("course")
        if student:
            qs = qs.filter(student=student)
        if course:
            qs = qs.filter(course=course)
        return qs


class MyGradesView(generics.ListAPIView):
    serializer_class   = GradeReadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Grade.objects.filter(student=self.request.user)


class GradeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset           = Grade.objects.all()
    serializer_class   = GradeSerializer
    permission_classes = [IsTeacherOrAdmin]