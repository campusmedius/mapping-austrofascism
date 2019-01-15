from django.apps import apps
from django import forms
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from .models import Event

app_models = apps.get_app_config('topography').get_models()


class EventAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title_de',
        'title_en',
        'short_abstract_de',
        'short_abstract_en',
        'start',
        'end',
        'information',
        'next_event'
    )

    class Media:
        css = {
             'all': ('admin/css/topography.css',)
        }


admin.site.register(Event, EventAdmin)

for model in app_models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass
