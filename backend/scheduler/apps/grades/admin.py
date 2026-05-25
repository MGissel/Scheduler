from django.contrib import admin
from .models import Grade


@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display  = ["student", "course", "assignment", "score", "created_at"]
    list_filter   = ["course"]
    search_fields = ["student__name", "course__subject__name", "assignment"]
    ordering      = ["-created_at"]