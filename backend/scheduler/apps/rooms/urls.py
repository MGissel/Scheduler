from django.urls import path
from .views import RoomListCreateView, RoomDetailView, RoomBookingListCreateView, RoomBookingDetailView

urlpatterns = [
    path("",                    RoomListCreateView.as_view(),       name="room-list"),
    path("<uuid:pk>/",          RoomDetailView.as_view(),           name="room-detail"),
    path("bookings/",           RoomBookingListCreateView.as_view(), name="booking-list"),
    path("bookings/<uuid:pk>/", RoomBookingDetailView.as_view(),    name="booking-detail"),
]