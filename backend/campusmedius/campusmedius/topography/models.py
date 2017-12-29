from django.db import models

from information.models import Information


class Event(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()
    start = models.DateTimeField()
    end = models.DateTimeField()
    timeline_row = models.IntegerField()
    lng = models.FloatField()
    lat = models.FloatField()
    next_event = models.OneToOneField('Event',
                                      related_name='previous_event',
                                      null=True, blank=True, on_delete=models.CASCADE)

    information = models.ForeignKey(Information, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)
