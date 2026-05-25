import uuid
from django.db import models


class DayOfWeek(models.TextChoices):
    MONDAY    = "monday",    "Monday"
    TUESDAY   = "tuesday",   "Tuesday"
    WEDNESDAY = "wednesday", "Wednesday"
    THURSDAY  = "thursday",  "Thursday"
    FRIDAY    = "friday",    "Friday"


class TimeSlot(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    day_of_week = models.CharField(max_length=10, choices=DayOfWeek.choices)
    start_time  = models.TimeField()
    end_time    = models.TimeField()

    class Meta:
        db_table = "time_slots"
        ordering = ["day_of_week", "start_time"]

    def __str__(self):
        return f"{self.day_of_week} {self.start_time}–{self.end_time}"


class ScheduleEntry(models.Model):
    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course    = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="schedule_entries",
    )
    room      = models.ForeignKey(
        "rooms.Room",
        on_delete=models.SET_NULL,
        null=True,
        related_name="schedule_entries",
    )
    time_slot = models.ForeignKey(
        TimeSlot,
        on_delete=models.CASCADE,
        related_name="schedule_entries",
    )
    week      = models.PositiveSmallIntegerField()

    class Meta:
        db_table      = "schedule_entries"
        unique_together = [("room", "time_slot", "week")]

    def __str__(self):
        return f"{self.course} — week {self.week}"