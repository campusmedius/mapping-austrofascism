from rest_framework import serializers
from .models import Experience, Mediator, MediatorType
from .models import ExperienceRelation, MediatorRelation
from .models import Mediation, Representation
from .models import Time, TimeInterval
from .models import Space, Location
from .models import Weight
from .models import Information, Text, Image, Video, Audio

import math

TWOPI = 6.2831853071795865
RAD2DEG = 57.2957795130823209


class TimeIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeInterval
        fields = ('id', 'end', 'start')


class TimeSerializer(serializers.ModelSerializer):
    timeIntervals = TimeIntervalSerializer(many=True, source='time_intervals')

    class Meta:
        model = Time
        fields = ('id', 'name', 'timeIntervals')


class LocationSerializer(serializers.ModelSerializer):
    # lat = serializers.SerializerMethodField()
    # lng = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ('id', 'lat', 'lng')

    # def get_lat(self, obj):
    #    return random.uniform(48.14, 48.27)

    # def get_lng(self, obj):
    #    return random.uniform(16.37, 16.44)


class SpaceSerializer(serializers.ModelSerializer):
    locations = LocationSerializer(many=True)

    class Meta:
        model = Space
        fields = ('id', 'name', 'locations')


class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        fields = ('id', 'cost')


class ValueSerializer(serializers.ModelSerializer):
    weights = WeightSerializer(many=True)

    class Meta:
        model = Time
        fields = ('id', 'name', 'weights')


class RepresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Representation
        fields = ('id', 'name')


class MediationSerializer(serializers.ModelSerializer):
    representations = RepresentationSerializer(many=True)

    class Meta:
        model = Mediation
        fields = ('id', 'name', 'representations')


class ExperienceRelationSerializer(serializers.ModelSerializer):
    value = ValueSerializer()
    bearing = serializers.SerializerMethodField()

    class Meta:
        model = ExperienceRelation
        fields = ('id', 'source', 'target', 'mediation', 'value', 'bearing')

    def get_bearing(self, obj):
        deltax = obj.target.space.locations.first().lng - obj.source.space.locations.first().lng
        deltay = obj.target.space.locations.first().lat - obj.source.space.locations.first().lat

        theta = math.atan2(deltay, deltax)
        if theta < 0.0:
            theta += TWOPI

        return RAD2DEG * theta


class ExperienceSerializer(serializers.ModelSerializer):
    space = SpaceSerializer()
    time = TimeSerializer()
    relationsTo = ExperienceRelationSerializer(many=True, source='sources')
    relationsFrom = ExperienceRelationSerializer(many=True, source='targets')

    mediators = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Experience
        fields = ('id', 'name', 'time', 'space', 'relationsTo',
                  'relationsFrom', 'mediators')


class MediatorTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediatorType
        fields = ('id', 'name')


class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ('id', 'title', 'text')


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ('id', 'title', 'description', 'file')


class AudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audio
        fields = ('id', 'title', 'description', 'file')


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('id', 'title', 'description', 'file')


class InformationSerializer(serializers.ModelSerializer):
    texts = TextSerializer(many=True)
    images = ImageSerializer(many=True)
    audios = AudioSerializer(many=True)
    videos = VideoSerializer(many=True)

    class Meta:
        model = Information
        fields = ('id', 'name', 'texts', 'images', 'audios', 'videos')


class MediatorRelationSerializer(serializers.ModelSerializer):
    value = ValueSerializer()

    class Meta:
        model = MediatorRelation
        fields = ('id', 'source', 'target', 'mediation', 'value')


class MediatorSerializer(serializers.ModelSerializer):
    type = MediatorTypeSerializer()
    space = SpaceSerializer()
    time = TimeSerializer()
    informations = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    relationsTo = MediatorRelationSerializer(many=True, source='sources')
    relationsFrom = MediatorRelationSerializer(many=True, source='targets')

    class Meta:
        model = Mediator
        fields = ('id', 'name', 'time', 'space', 'type', 'experience',
                  'informations', 'relationsTo', 'relationsFrom')
