from django.conf.urls import url, include

from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'events', views.EventViewSet)

urlpatterns = [
    url(r'^', include(router.urls, namespace='topography_api')),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='topography_rest_framework'))
]
