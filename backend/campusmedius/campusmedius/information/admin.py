from django.contrib import admin
from django import forms
from django.core.exceptions import ObjectDoesNotExist
import re

from softhyphen.html import hyphenate

from .models import Image, Audio, Video, Gallery
from .models import MediaEntity
from .models import Information

IMAGE_PATTERN = re.compile(r'<cm-image id=\"([0-9]+)\">')
VIDEO_PATTERN = re.compile(r'<cm-video id=\"([0-9]+)\">')
AUDIO_PATTERN = re.compile(r'<cm-audio id=\"([0-9]+)\">')
GALLERY_PATTERN = re.compile(r'<cm-gallery id=\"([0-9]+)\">')


class ImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'phaidra_id',
        'short_caption_de',
        'short_caption_en',
    )

    class Media:
        css = {'all': ('admin/css/information.css', )}


admin.site.register(Image, ImageAdmin)


class AudioAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'phaidra_id',
        'short_caption_de',
        'short_caption_en',
    )

    class Media:
        css = {'all': ('admin/css/information.css', )}


admin.site.register(Audio, AudioAdmin)


class VideoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'phaidra_id',
        'short_caption_de',
        'short_caption_en',
    )

    class Media:
        css = {'all': ('admin/css/information.css', )}


admin.site.register(Video, VideoAdmin)


class MediaEntityInline(admin.TabularInline):
    model = MediaEntity
    extra = 1


class GalleryAdmin(admin.ModelAdmin):
    inlines = [MediaEntityInline]
    list_display = ('id', )

    class Media:
        css = {'all': ('admin/css/information.css', )}


admin.site.register(Gallery, GalleryAdmin)


def find_all_ids(pattern, cleaned_data):
    ids = []
    for id in re.findall(pattern, cleaned_data['content_en']):
        ids.append(id)
    for id in re.findall(pattern, cleaned_data['content_de']):
        if id not in ids:
            ids.append(id)
    return ids


class InformationForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(InformationForm, self).clean()

        cleaned_data['content_en'] = hyphenate(
            cleaned_data['content_en'], language="en-en")
        cleaned_data['content_de'] = hyphenate(
            cleaned_data['content_de'], language="de-de")

        try:
            cleaned_data['media_images'] = [
                Image.objects.get(pk=id)
                for id in find_all_ids(IMAGE_PATTERN, cleaned_data)
            ]
            cleaned_data['media_audios'] = [
                Audio.objects.get(pk=id)
                for id in find_all_ids(AUDIO_PATTERN, cleaned_data)
            ]
            cleaned_data['media_videos'] = [
                Video.objects.get(pk=id)
                for id in find_all_ids(VIDEO_PATTERN, cleaned_data)
            ]
            cleaned_data['media_galleries'] = [
                Gallery.objects.get(pk=id)
                for id in find_all_ids(GALLERY_PATTERN, cleaned_data)
            ]
        except ObjectDoesNotExist as e:
            raise forms.ValidationError(str(e) + ' Media entity doesnt exist.')


class InformationAdmin(admin.ModelAdmin):
    form = InformationForm
    fields = ('title_de', 'title_en', 'content_de', 'content_en',
              'media_images', 'media_videos', 'media_audios',
              'media_galleries')
    list_display = ('id', 'title_de', 'title_en', 'short_content_de',
                    'short_content_en')

    class Media:
        css = {'all': ('admin/css/information.css', )}


admin.site.register(Information, InformationAdmin)
