from django.contrib import admin
from .models import Subject, Course


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display  = ["name"]
    search_fields = ["name"]


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display  = ["subject", "teacher", "class_group", "semester"]
    list_filter   = ["semester", "class_group"]
    search_fields = ["subject__name", "teacher__name"]