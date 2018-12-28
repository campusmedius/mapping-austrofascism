from django.apps import apps
from django import forms
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from softhyphen.html import hyphenate

from .models import Event

app_models = apps.get_app_config('topography').get_models()


class EventForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(EventForm, self).clean()

        cleaned_data['abstract_en'] = hyphenate(
            cleaned_data['abstract_en'], language="en-en")
        cleaned_data['abstract_de'] = hyphenate(
            cleaned_data['abstract_de'], language="de-de")


class EventAdmin(admin.ModelAdmin):
    form = EventForm
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
