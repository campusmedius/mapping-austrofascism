from django.contrib import admin

from .models import Image, Audio, Video, Gallery
from .models import MediaEntity
from .models import Information


class ImageAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'url',
        'caption_de',
        'caption_en', )


admin.site.register(Image, ImageAdmin)


class AudioAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'url',
        'caption_de',
        'caption_en', )


admin.site.register(Audio, AudioAdmin)


class VideoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'url',
        'caption_de',
        'caption_en', )


admin.site.register(Video, VideoAdmin)


class MediaEntityInline(admin.TabularInline):
    model = MediaEntity
    extra = 1


class GalleryAdmin(admin.ModelAdmin):
    inlines = [MediaEntityInline]
    list_display = (
        'id',
        'title_de',
        'title_en', )


admin.site.register(Gallery, GalleryAdmin)


class InformationAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'content_de',
        'content_en',
        'title_de',
        'title_en',
        'description' )


admin.site.register(Information, InformationAdmin)
