from django.urls import path
from .views import AttendanceListCreateView, AttendanceDetailView, MyAttendanceView

urlpatterns = [
    path("",           AttendanceListCreateView.as_view(), name="attendance-list"),
    path("mine/",      MyAttendanceView.as_view(),         name="attendance-mine"),
    path("<uuid:pk>/", AttendanceDetailView.as_view(),     name="attendance-detail"),
]