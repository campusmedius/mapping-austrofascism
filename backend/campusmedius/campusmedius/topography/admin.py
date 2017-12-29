from django.apps import apps
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from .models import Event

app_models = apps.get_app_config('topography').get_models()


class EventAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title_de',
        'title_en',
        'start',
        'end',
        'timeline_row',
        'lng',
        'lat',
        'information',
        'next_event'
    )
    list_editable = (
        'title_de',
        'title_en',
        'start',
        'end',
        'timeline_row',
        'lng',
        'lat',
        'information',
        'next_event'
    )


admin.site.register(Event, EventAdmin)

for model in app_models:
    try:
        admin.site.register(model)
    except AlreadyRegistered:
        pass
