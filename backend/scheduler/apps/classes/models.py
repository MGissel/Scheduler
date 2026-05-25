import uuid
from django.db import models


class ClassGroup(models.Model):
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name             = models.CharField(max_length=100)
    year             = models.PositiveSmallIntegerField()
    homeroom_teacher = models.ForeignKey(
        "users.User",
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name="homeroom_classes",
    )

    class Meta:
        db_table = "classes"
        ordering = ["year", "name"]

    def __str__(self):
        return f"{self.name} ({self.year})"