from django.urls import path
from .views import ClassGroupListCreateView, ClassGroupDetailView

urlpatterns = [
    path("",          ClassGroupListCreateView.as_view(), name="class-list"),
    path("<uuid:pk>/", ClassGroupDetailView.as_view(),   name="class-detail"),
]