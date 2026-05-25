from django.urls import path
from .views import SubjectListCreateView, SubjectDetailView, CourseListCreateView, CourseDetailView

urlpatterns = [
    path("subjects/",           SubjectListCreateView.as_view(), name="subject-list"),
    path("subjects/<uuid:pk>/", SubjectDetailView.as_view(),     name="subject-detail"),
    path("",                    CourseListCreateView.as_view(),   name="course-list"),
    path("<uuid:pk>/",          CourseDetailView.as_view(),       name="course-detail"),
]