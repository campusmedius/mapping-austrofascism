from django.db import models
from tinymce.models import HTMLField

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation

MEDIA_ENTITY_MODELS = models.Q(
    app_label='information', model='image') | models.Q(
        app_label='information', model='audio') | models.Q(
            app_label='information', model='video')


class MediaEntity(models.Model):
    gallery = models.ForeignKey(
        'Gallery', null=True, blank=True, related_name='entities', on_delete=models.CASCADE)

    limit = models.Q(app_label='information', model='image')

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to=MEDIA_ENTITY_MODELS)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')


class Image(models.Model):
    url = models.URLField()
    caption_de = models.TextField(null=True, blank=True)
    caption_en = models.TextField(null=True, blank=True)

    media_entity = GenericRelation(MediaEntity)

    def __str__(self):
        return str(self.id)


class Audio(models.Model):
    url = models.URLField()
    caption_de = models.TextField(null=True, blank=True)
    caption_en = models.TextField(null=True, blank=True)

    media_entity = GenericRelation(MediaEntity)

    def __str__(self):
        return str(self.id)


class Video(models.Model):
    url = models.URLField()
    caption_de = models.TextField(null=True, blank=True)
    caption_en = models.TextField(null=True, blank=True)

    media_entity = GenericRelation(MediaEntity)

    def __str__(self):
        return str(self.id)


class Gallery(models.Model):
    title_de = models.TextField(null=True, blank=True)
    title_en = models.TextField(null=True, blank=True)

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)


class Information(models.Model):
    title_de = models.TextField(null=True, blank=True)
    title_en = models.TextField(null=True, blank=True)
    content_de = HTMLField(null=True, blank=True)
    content_en = HTMLField(null=True, blank=True)

    media_images = models.ManyToManyField(Image, blank=True)
    media_audios = models.ManyToManyField(Audio, blank=True)
    media_videos = models.ManyToManyField(Video, blank=True)
    media_galleries = models.ManyToManyField(Gallery, blank=True)

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)
