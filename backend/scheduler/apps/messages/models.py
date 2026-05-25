import uuid
from django.db import models


class Message(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender     = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="sent_messages",
    )
    recipient  = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="received_messages",
    )
    subject    = models.CharField(max_length=255)
    body       = models.TextField()
    read_at    = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "school_messages"
        db_table  = "messages"
        ordering  = ["-created_at"]

    def __str__(self):
        return f"{self.sender} → {self.recipient}: {self.subject}"