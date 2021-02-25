"""campusmedius URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin
from django.conf.urls.static import static
from django.contrib.sitemaps.views import sitemap
from django.contrib.sitemaps import GenericSitemap

from main.models import Page
from topography.models import Event
from topology.models import Mediator

# Sitemap
sitemaps = {
    'pages': GenericSitemap({
        'queryset': Page.objects.all(),
        'date_field': 'updated',
    }, priority=1),
    'events': GenericSitemap({
        'queryset': Event.objects.all(),
        'date_field': 'updated',
    }, priority=0.5),
    'mediators': GenericSitemap({
        'queryset': Mediator.objects.all(),
        'date_field': 'updated',
    }, priority=0.5),
}

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^tinymce/', include('tinymce.urls')),
    url(r'^taggit_autosuggest/', include('taggit_autosuggest.urls')),
    url(r'^main/', include('main.urls')),
    url(r'^topology/', include('topology.urls')),
    url(r'^topography/', include('topography.urls')),
    url(r'^information/', include('information.urls')),
    url(r'^sitemap\.xml$', sitemap, {'sitemaps': sitemaps, 'template_name': 'cm_sitemap.html'},
    name='django.contrib.sitemaps.views.sitemap'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
