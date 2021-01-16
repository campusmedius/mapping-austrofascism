from django.apps import apps
from django import forms
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered
from taggit.models import Tag

from softhyphen.html import hyphenate

from .models import Page, CampusmediusTag

app_models = apps.get_app_config('main').get_models()


class PageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_de', 'title_en', 'short_abstract_de',
                    'short_abstract_en', 'short_mobile_abstract_de',
                    'short_mobile_abstract_en', 'information')

    class Media:
        css = {'all': ('admin/css/admin.css', )}


admin.site.register(Page, PageAdmin)


class CampusmediusTagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'title_de', 'title_en', 'slug')


admin.site.register(CampusmediusTag, CampusmediusTagAdmin)
admin.site.unregister(Tag)

#for model in app_models:
#    try:
#        admin.site.register(model)
#    except AlreadyRegistered:
#        pass
