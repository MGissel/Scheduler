from django.contrib import admin
from .models import Room, RoomBooking


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display  = ["name", "capacity", "facilities"]
    search_fields = ["name"]


@admin.register(RoomBooking)
class RoomBookingAdmin(admin.ModelAdmin):
    list_display  = ["room", "user", "start_time", "end_time", "purpose"]
    list_filter   = ["room"]
    search_fields = ["user__name", "room__name"]