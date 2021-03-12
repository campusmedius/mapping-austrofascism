import datetime

from rest_framework import serializers
from taggit_serializer.serializers import TaggitSerializer
from geopy.distance import geodesic

from .models import Mediator, Medium, Relation
from .models import Mediation, Experience
from .models import Space, Time, Value

class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = ('id', 'title_de', 'title_en')


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'title_de', 'title_en')


class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = ('id', 'title_de', 'title_en')


class MediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medium
        fields = ('id', 'title_de', 'title_en')


class RelationSerializer(serializers.ModelSerializer):
    value = ValueSerializer()
    space = SpaceSerializer()
    time = TimeSerializer()
    source_id = serializers.SerializerMethodField()
    source = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='topology_api:mediator-detail')
    target_id = serializers.SerializerMethodField()
    target = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='topology_api:mediator-detail')
    space_difference = serializers.SerializerMethodField()
    time_difference = serializers.SerializerMethodField()

    class Meta:
        model = Relation
        fields = ('id', 'source', 'source_id', 'target', 'target_id', 'value', 'space', 'time', 'space_difference', 'time_difference')

    def get_source_id(self, obj):
        return obj.source_id

    def get_target_id(self, obj):
        return obj.target_id

    def get_space_difference(self, obj):
        return geodesic(obj.source.location.split(','),
                        obj.target.location.split(',')).meters

    def get_time_difference(self, obj):
        diff = obj.target.time - obj.source.time
        hours = diff.total_seconds() / 3600

        if obj.source.id == 0:
            diff = obj.target.time.replace(tzinfo=None) - datetime.datetime(1933, 1, 1)
            hours = (1933 * 365 * 24) + diff.total_seconds() / 3600 + 1
			
        if obj.target.id == 0:
            diff = obj.source.time.replace(tzinfo=None) - datetime.datetime(1933, 1, 1)
            hours = -((1933 * 365 * 24) + diff.total_seconds() / 3600) + 1
	
        return hours


class MediatorSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()
    coordinates = serializers.SerializerMethodField()
    medium = MediumSerializer()
    keywords_de = serializers.SerializerMethodField()
    keywords_en = serializers.SerializerMethodField()
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')
    relationsTo = RelationSerializer(many=True, source='sources')
    relationsFrom = RelationSerializer(many=True, source='targets')

    class Meta:
        model = Mediator
        fields = ('id', 'created', 'updated', 'title_de', 'title_en', 'place_de', 'place_en', 'moment_de', 'moment_en', 'abstract_de', 'abstract_en',
                  'medium', 'coordinates', 'time', 'information_id', 'information', 'relationsTo', 'relationsFrom', 'keywords_de', 'keywords_en', 'bearing', 'pitch', 'zoom')

    def get_information_id(self, obj):
        return obj.information_id

    def get_coordinates(self, obj):
        return {
            'lng': obj.location.split(',')[1],
            'lat': obj.location.split(',')[0]
        }

    def get_keywords_de(self, value):
        return [tag.title_de for tag in value.keywords.all()]

    def get_keywords_en(self, value):
        return [tag.title_en for tag in value.keywords.all()]

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)
        internal[
            'location'] = data['coordinates']['lat'] + ',' + data['coordinates']['lng']
        return internal

    def get_updated(self, obj):
        if obj.information and obj.information.updated and obj.information.updated > obj.updated:
            return obj.information.updated
        return obj.updated

    def get_created(self, obj):
        return obj.created


class MediationSerializer(serializers.ModelSerializer):
    relations = RelationSerializer(many=True)
    class Meta:
        model = Mediation
        fields = ('id', 'demand_de', 'demand_en', 'response_de', 'response_en', 'relations')


class ExperienceSerializer(serializers.ModelSerializer):
    relations = RelationSerializer(many=True)
    class Meta:
        model = Experience
        fields = ('id', 'title_de', 'title_en', 'relations')
