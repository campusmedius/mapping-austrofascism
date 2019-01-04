from django.apps import apps
from django import forms
from django.contrib import admin
from django.contrib.admin.sites import AlreadyRegistered

from softhyphen.html import hyphenate

from .models import Page

app_models = apps.get_app_config('main').get_models()


class PageForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super(PageForm, self).clean()

        cleaned_data['abstract_en'] = hyphenate(
            cleaned_data['abstract_en'], language="en-en")
        cleaned_data['abstract_de'] = hyphenate(
            cleaned_data['abstract_de'], language="de-de")
        cleaned_data['content_en'] = hyphenate(
            cleaned_data['content_en'], language="en-en")
        cleaned_data['content_de'] = hyphenate(
            cleaned_data['content_de'], language="de-de")


class PageAdmin(admin.ModelAdmin):
    form = PageForm
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
