from django.utils import timezone
from django.db import models
from django.template.defaultfilters import truncatechars
from location_field.models.plain import PlainLocationField
from tinymce.models import HTMLField
from taggit_autosuggest.managers import TaggableManager

from information.models import Information
from main.models import CampusmediusTaggedItemBase

class Event(models.Model):
    created = models.DateTimeField(null=True, blank=True)
    updated = models.DateTimeField(null=True, blank=True)
    title_de = models.TextField()
    title_en = models.TextField()
    abstract_de = HTMLField(null=True, blank=True)
    abstract_en = HTMLField(null=True, blank=True)
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
    keywords = TaggableManager(blank=True, through=CampusmediusTaggedItemBase, verbose_name="keywords")

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)

    @property
    def short_abstract_de(self):
        return truncatechars(self.abstract_de, 100)

    @property
    def short_abstract_en(self):
        return truncatechars(self.abstract_en, 100)

    def save(self, *args, **kwargs):
        ''' On save, update timestamps '''
        if not self.id:
            self.created = timezone.now()
        self.updated = timezone.now()
        return super(Event, self).save(*args, **kwargs)
