from django.apps import apps
from django import forms
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from softhyphen.html import hyphenate

from .models import Page

app_models = apps.get_app_config('main').get_models()


class PageAdmin(admin.ModelAdmin):
    list_display = ('id', 'title_de', 'title_en', 'short_abstract_de',
                    'short_abstract_en', 'short_content_de',
                    'short_content_en', 'information')

    class Media:
        css = {'all': ('admin/css/main.css', )}


admin.site.register(Page, PageAdmin)

for model in app_models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass
