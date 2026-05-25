import uuid
from django.db import models


class Grade(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student    = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="grades",
        limit_choices_to={"role": "student"},
    )
    course     = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="grades",
    )
    assignment = models.CharField(max_length=255)
    score      = models.FloatField()
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "grades"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.student.name} — {self.course}: {self.score}"