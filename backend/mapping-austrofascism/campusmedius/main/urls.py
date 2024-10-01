from django.conf.urls import url, include

from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pages', views.PageViewSet)

urlpatterns = [
    url(r'^insert-nbsp', views.insert_nbsp),
    url(r'^search-documents/de', views.search_documents_de),
    url(r'^search-documents/en', views.search_documents_en),
    url(r'^', include(router.urls, namespace='main_api')),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='main_rest_framework'))
]