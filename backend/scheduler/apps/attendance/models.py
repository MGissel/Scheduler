import uuid
from django.db import models


class AttendanceStatus(models.TextChoices):
    PRESENT = "present", "Present"
    ABSENT  = "absent",  "Absent"
    LATE    = "late",    "Late"
    EXCUSED = "excused", "Excused"


class Attendance(models.Model):
    id             = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student        = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="attendance_records",
        limit_choices_to={"role": "student"},
    )
    schedule_entry = models.ForeignKey(
        "schedule.ScheduleEntry",
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )
    status         = models.CharField(
        max_length=10,
        choices=AttendanceStatus.choices,
        default=AttendanceStatus.PRESENT,
    )
    note           = models.TextField(blank=True)

    class Meta:
        db_table        = "attendance"
        unique_together = [("student", "schedule_entry")]
        ordering        = ["schedule_entry"]

    def __str__(self):
        return f"{self.student.name} — {self.schedule_entry}: {self.status}"