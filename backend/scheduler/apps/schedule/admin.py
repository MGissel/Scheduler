from django.contrib import admin
from .models import TimeSlot, ScheduleEntry


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display  = ["day_of_week", "start_time", "end_time"]
    ordering      = ["day_of_week", "start_time"]


@admin.register(ScheduleEntry)
class ScheduleEntryAdmin(admin.ModelAdmin):
    list_display  = ["course", "room", "time_slot", "week"]
    list_filter   = ["week", "room"]
    search_fields = ["course__subject__name"]