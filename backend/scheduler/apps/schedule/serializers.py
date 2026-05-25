from rest_framework import serializers
from .models import TimeSlot, ScheduleEntry


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TimeSlot
        fields = ["id", "day_of_week", "start_time", "end_time"]


class ScheduleEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model  = ScheduleEntry
        fields = ["id", "course", "room", "time_slot", "week"]

    def validate(self, data):
        overlapping = ScheduleEntry.objects.filter(
            room=data["room"],
            time_slot=data["time_slot"],
            week=data["week"],
        )
        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)
        if overlapping.exists():
            raise serializers.ValidationError("This room is already scheduled at that time in that week.")
        return data