import uuid
from django.db import models


class Subject(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    class Meta:
        db_table = "subjects"

    def __str__(self):
        return self.name


class Course(models.Model):
    id          = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subject     = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="courses")
    teacher     = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        related_name="courses_teaching",
        limit_choices_to={"role": "teacher"},
    )
    class_group = models.ForeignKey(
        "classes.ClassGroup",
        on_delete=models.CASCADE,
        related_name="courses",
    )
    semester    = models.CharField(max_length=20)

    class Meta:
        db_table = "courses"

    def __str__(self):
        return f"{self.subject.name} — {self.class_group.name} ({self.semester})"