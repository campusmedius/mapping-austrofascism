from rest_framework import viewsets

from .models import Experience, Mediator
from .models import Time, Space, Value
from .models import Information, Mediation
from .models import Representation

from .serializers import ExperienceSerializer, MediatorSerializer
from .serializers import TimeSerializer, SpaceSerializer, ValueSerializer
from .serializers import InformationSerializer, MediationSerializer
from .serializers import RepresentationSerializer


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer


class MediatorViewSet(viewsets.ModelViewSet):
    queryset = Mediator.objects.all()
    serializer_class = MediatorSerializer


class TimeViewSet(viewsets.ModelViewSet):
    queryset = Time.objects.all()
    serializer_class = TimeSerializer


class SpaceViewSet(viewsets.ModelViewSet):
    queryset = Space.objects.all()
    serializer_class = SpaceSerializer


class ValueViewSet(viewsets.ModelViewSet):
    queryset = Value.objects.all()
    serializer_class = ValueSerializer


class InformationViewSet(viewsets.ModelViewSet):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer


class MediationViewSet(viewsets.ModelViewSet):
    queryset = Mediation.objects.all()
    serializer_class = MediationSerializer


class RepresentationViewSet(viewsets.ModelViewSet):
    queryset = Representation.objects.all()
    serializer_class = RepresentationSerializer
