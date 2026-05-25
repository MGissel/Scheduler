from django.urls import path
from .views import GradeListCreateView, GradeDetailView, MyGradesView

urlpatterns = [
    path("",           GradeListCreateView.as_view(), name="grade-list"),
    path("mine/",      MyGradesView.as_view(),        name="grade-mine"),
    path("<uuid:pk>/", GradeDetailView.as_view(),     name="grade-detail"),
]