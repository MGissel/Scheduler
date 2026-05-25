from django.urls import path
from .views import TimeSlotListCreateView, TimeSlotDetailView, ScheduleEntryListCreateView, ScheduleEntryDetailView

urlpatterns = [
    path("timeslots/",             TimeSlotListCreateView.as_view(),   name="timeslot-list"),
    path("timeslots/<uuid:pk>/",   TimeSlotDetailView.as_view(),       name="timeslot-detail"),
    path("",                       ScheduleEntryListCreateView.as_view(), name="schedule-list"),
    path("<uuid:pk>/",             ScheduleEntryDetailView.as_view(),  name="schedule-detail"),
]