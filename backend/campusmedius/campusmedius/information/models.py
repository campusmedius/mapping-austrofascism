from django.db import models
from django.template.defaultfilters import truncatechars
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
        'Gallery',
        null=True,
        blank=True,
        related_name='entities',
        on_delete=models.CASCADE)

    limit = models.Q(app_label='information', model='image')

    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to=MEDIA_ENTITY_MODELS)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')


class MediaBaseModel(models.Model):
    phaidra_id = models.CharField(
        max_length=32, help_text="For example: 'o:906180'")
    caption_de = models.TextField(null=True, blank=True)
    caption_en = models.TextField(null=True, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return str(self.id)

    @property
    def short_caption_de(self):
        return truncatechars(self.caption_de, 100)

    @property
    def short_caption_en(self):
        return truncatechars(self.caption_en, 100)


class Image(MediaBaseModel):
    media_entity = GenericRelation(MediaEntity)


class Audio(MediaBaseModel):
    media_entity = GenericRelation(MediaEntity)


class Video(MediaBaseModel):
    stream_id = models.CharField(
        max_length=32, help_text="For example: 'c47c9323f8628c10527cdd9748173e5acc4d8c9c'")
    media_entity = GenericRelation(MediaEntity)


class Gallery(models.Model):

    def __str__(self):
        return str(self.id)


class Information(models.Model):
    title_de = models.TextField(null=True, blank=True)
    title_en = models.TextField(null=True, blank=True)
    content_de = models.TextField(null=True, blank=True)
    content_en = models.TextField(null=True, blank=True)

    media_images = models.ManyToManyField(Image, blank=True)
    media_audios = models.ManyToManyField(Audio, blank=True)
    media_videos = models.ManyToManyField(Video, blank=True)
    media_galleries = models.ManyToManyField(Gallery, blank=True)

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)

    @property
    def short_content_de(self):
        return truncatechars(self.content_de, 100)

    @property
    def short_content_en(self):
        return truncatechars(self.content_en, 100)
