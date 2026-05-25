from django.contrib import admin
from .models import ClassGroup


@admin.register(ClassGroup)
class ClassGroupAdmin(admin.ModelAdmin):
    list_display  = ["name", "year", "homeroom_teacher"]
    list_filter   = ["year"]
    search_fields = ["name"]
    ordering      = ["year", "name"]