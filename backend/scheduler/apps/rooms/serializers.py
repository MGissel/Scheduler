from rest_framework import serializers
from .models import Room, RoomBooking


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Room
        fields = ["id", "name", "capacity", "facilities"]


class RoomBookingSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model  = RoomBooking
        fields = ["id", "room", "user", "start_time", "end_time", "purpose"]

    def validate(self, data):
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError("end_time must be after start_time")
        overlapping = RoomBooking.objects.filter(
            room=data["room"],
            start_time__lt=data["end_time"],
            end_time__gt=data["start_time"],
        )
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        if overlapping.exists():
            raise serializers.ValidationError("This room is already booked for that time.")
        return data