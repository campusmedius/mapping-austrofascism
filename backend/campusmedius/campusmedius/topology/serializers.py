from rest_framework import serializers
from taggit_serializer.serializers import TaggitSerializer

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

    class Meta:
        model = Relation
        fields = ('id', 'source', 'source_id', 'target', 'target_id', 'value', 'space', 'time')

    def get_source_id(self, obj):
        return obj.source_id

    def get_target_id(self, obj):
        return obj.target_id


class MediatorSerializer(serializers.ModelSerializer):
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
        fields = ('id', 'created', 'updated', 'title_de', 'title_en', 'abstract_de', 'abstract_en',
                  'medium', 'coordinates', 'information_id', 'information', 'relationsTo', 'relationsFrom', 'keywords_de', 'keywords_en', 'bearing', 'pitch', 'zoom')

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
