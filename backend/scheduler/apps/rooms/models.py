import uuid
from django.db import models


class Room(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name       = models.CharField(max_length=100)
    capacity   = models.PositiveSmallIntegerField()
    facilities = models.TextField(blank=True)

    class Meta:
        db_table = "rooms"

    def __str__(self):
        return self.name


class RoomBooking(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room       = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="bookings")
    user       = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name="room_bookings")
    start_time = models.DateTimeField()
    end_time   = models.DateTimeField()
    purpose    = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "room_bookings"

    def __str__(self):
        return f"{self.room.name}: {self.start_time} — {self.end_time}"