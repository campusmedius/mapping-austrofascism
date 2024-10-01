from rest_framework import viewsets

from .models import Experience, Mediation
from .models import Time, Space, Value
from .models import Mediator, Medium

from .serializers import ExperienceSerializer, MediationSerializer
from .serializers import TimeSerializer, SpaceSerializer, ValueSerializer
from .serializers import MediatorSerializer, MediumSerializer



class TimeViewSet(viewsets.ModelViewSet):
    queryset = Time.objects.all()
    serializer_class = TimeSerializer


class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer


class ValueViewSet(viewsets.ModelViewSet):
    queryset = Value.objects.all()
    serializer_class = ValueSerializer


class MediumViewSet(viewsets.ModelViewSet):
    queryset = Medium.objects.all()
    serializer_class = MediumSerializer


class MediationViewSet(viewsets.ModelViewSet):
    queryset = Mediation.objects.all()
    serializer_class = MediationSerializer


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class MediatorViewSet(viewsets.ModelViewSet):
    queryset = Mediator.objects.all()
    serializer_class = MediatorSerializer
