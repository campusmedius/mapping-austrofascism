from django.conf.urls import url, include

from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'images', views.ImageViewSet)
router.register(r'audios', views.AudioViewSet)
router.register(r'videos', views.VideoViewSet)
router.register(r'galleries', views.GalleryViewSet)
router.register(r'informations', views.InformationViewSet)

urlpatterns = [
    url(r'^', include(router.urls, namespace='information_api')),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='information_rest_framework'))
]
