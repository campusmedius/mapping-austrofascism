from django.utils import timezone
from django.db import models
from django.template.defaultfilters import truncatechars
from tinymce.models import HTMLField
from taggit_autosuggest.managers import TaggableManager

from information.models import Information


class Time(models.Model):
    name_de = models.TextField()
    name_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)


class Space(models.Model):
    name_de = models.TextField()
    name_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)


class Value(models.Model):
    name_de = models.TextField()
    name_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)


class Medium(models.Model):
    name_de = models.TextField()
    name_en = models.TextField()

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)


class Mediator(models.Model):
    created = models.DateTimeField()
    updated = models.DateTimeField()
    name_de = models.TextField()
    name_en = models.TextField()
    abstract_de = HTMLField(null=True, blank=True)
    abstract_en = HTMLField(null=True, blank=True)
    medium = models.ForeignKey(Medium, on_delete=models.CASCADE)
    information = models.ForeignKey(
        Information, null=True, blank=True, on_delete=models.CASCADE)
    keywords = TaggableManager()

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)

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
    name_de = models.TextField()
    name_en = models.TextField()
    relations = models.ManyToManyField(Relation, blank=True, related_name='mediations')

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)


class Experience(models.Model):
    name_de = models.TextField()
    name_en = models.TextField()
    relations = models.ManyToManyField(Relation, blank=True, related_name='experiences')

    def __str__(self):
        return ('{} - {}').format(self.id, self.name_de)
