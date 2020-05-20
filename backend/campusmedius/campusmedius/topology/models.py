from django.utils import timezone
from django.db import models
from django.template.defaultfilters import truncatechars
from location_field.models.plain import PlainLocationField
from tinymce.models import HTMLField
from taggit_autosuggest.managers import TaggableManager

from information.models import Information
from main.models import CampusmediusTaggedItemBase


class Time(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)


class Space(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)


class Value(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)


class Medium(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)


class Mediator(models.Model):
    created = models.DateTimeField(null=True, blank=True)
    updated = models.DateTimeField(null=True, blank=True)
    title_de = models.TextField()
    title_en = models.TextField()
    abstract_de = HTMLField(null=True, blank=True)
    abstract_en = HTMLField(null=True, blank=True)
    medium = models.ForeignKey(Medium, on_delete=models.CASCADE)
    information = models.ForeignKey(
        Information, null=True, blank=True, on_delete=models.CASCADE)
    location = PlainLocationField(
        default='48.21071849058017,16.371345520019528')
    keywords = TaggableManager(blank=True, through=CampusmediusTaggedItemBase, verbose_name="keywords")

    bearing = models.FloatField(null=True, blank=True, default=0)
    pitch = models.FloatField(null=True, blank=True, default=0)
    zoom = models.FloatField(null=True, blank=True, default=18)

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
        return super(Mediator, self).save(*args, **kwargs)


class Relation(models.Model):
    source = models.ForeignKey(Mediator, related_name='sources', on_delete=models.CASCADE)
    target = models.ForeignKey(Mediator, related_name='targets', on_delete=models.CASCADE)
    value = models.ForeignKey(Value, on_delete=models.CASCADE)
    time = models.ForeignKey(Time, on_delete=models.CASCADE)
    space = models.ForeignKey(Space, on_delete=models.CASCADE)

    def __str__(self):
        return ('{} - {}').format(self.source, self.target)


class Mediation(models.Model):
    demand_de = models.TextField()
    demand_en = models.TextField()
    response_de = models.TextField()
    response_en = models.TextField()
    relations = models.ManyToManyField(Relation, blank=True, related_name='mediations')

    def __str__(self):
        return ('{} - {}: {}').format(self.id, self.demand_de, self.response_de)


class Experience(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()
    relations = models.ManyToManyField(Relation, blank=True, related_name='experiences')

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)
