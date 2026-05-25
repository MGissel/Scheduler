from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display  = ["student", "schedule_entry", "status", "note"]
    list_filter   = ["status"]
    search_fields = ["student__name"]
    ordering      = ["schedule_entry"]