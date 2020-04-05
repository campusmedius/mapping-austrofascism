from django.conf.urls import url, include

from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'mediators', views.MediatorViewSet)
router.register(r'mediums', views.MediumViewSet)
router.register(r'times', views.TimeViewSet)
router.register(r'spaces', views.SpaceViewSet)
router.register(r'values', views.ValueViewSet)
router.register(r'mediations', views.MediationViewSet)
router.register(r'experiences', views.ExperienceViewSet)

urlpatterns = [
    url(r'^', include(router.urls, namespace='topology_api')),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='topology_rest_framework'))
]
