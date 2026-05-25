from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/",      include("scheduler.apps.users.urls")),
    path("api/classes/",   include("scheduler.apps.classes.urls")),
    path("api/courses/",   include("scheduler.apps.courses.urls")),
    path("api/schedule/",  include("scheduler.apps.schedule.urls")),
    path("api/rooms/",     include("scheduler.apps.rooms.urls")),
    path("api/messages/",  include("scheduler.apps.messages.urls")),
    path("api/grades/",    include("scheduler.apps.grades.urls")),
    path("api/attendance/",include("scheduler.apps.attendance.urls")),
]