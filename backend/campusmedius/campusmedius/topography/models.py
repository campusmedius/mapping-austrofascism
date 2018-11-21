from django.db import models
from location_field.models.plain import PlainLocationField

from information.models import Information


class Event(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()
    start = models.DateTimeField()
    end = models.DateTimeField()
    timeline_row = models.IntegerField()
    location = PlainLocationField(
        default='48.21071849058017,16.371345520019528')
    next_event = models.OneToOneField(
        'Event',
        related_name='previous_event',
        null=True,
        blank=True,
        on_delete=models.CASCADE)

    information = models.ForeignKey(
        Information, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)
