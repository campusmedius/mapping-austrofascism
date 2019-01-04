from django.db import models
from tinymce.models import HTMLField
from django.template.defaultfilters import truncatechars

from information.models import Information


class Page(models.Model):
    title_de = models.TextField()
    title_en = models.TextField()
    abstract_de = HTMLField(null=True, blank=True)
    abstract_en = HTMLField(null=True, blank=True)
    content_de = HTMLField(null=True, blank=True)
    content_en = HTMLField(null=True, blank=True)
    information = models.ForeignKey(
        Information, null=True, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        return ('{} - {}').format(self.id, self.title_de)

    @property
    def short_abstract_de(self):
        return truncatechars(self.abstract_de, 100)

    @property
    def short_abstract_en(self):
        return truncatechars(self.abstract_en, 100)

    @property
    def short_content_de(self):
        return truncatechars(self.content_de, 100)

    @property
    def short_content_en(self):
        return truncatechars(self.content_en, 100)
