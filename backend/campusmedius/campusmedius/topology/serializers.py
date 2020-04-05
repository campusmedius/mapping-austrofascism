from rest_framework import serializers
from taggit_serializer.serializers import TaggitSerializer

from .models import Mediator, Medium, Relation
from .models import Mediation, Experience
from .models import Space, Time, Value


class TimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = ('id', 'name_de', 'name_en')


class SpaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Space
        fields = ('id', 'name_de', 'name_en')


class ValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Time
        fields = ('id', 'name_de', 'name_en')


class MediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medium
        fields = ('id', 'name_de', 'name_en')


class MediationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mediation
        fields = ('id', 'name_de', 'name_en')


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = ('id', 'name_de', 'name_en')


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


class TagListSerializerField(serializers.Field):
    def to_representation(self, value):
       if type(value) is not list:
           return [tag.name for tag in value.all()]
       return value

class MediatorSerializer(TaggitSerializer, serializers.ModelSerializer):
    medium = MediumSerializer()
    keywords = TagListSerializerField()
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')
    relationsTo = RelationSerializer(many=True, source='sources')
    relationsFrom = RelationSerializer(many=True, source='targets')

    class Meta:
        model = Mediator
        fields = ('id', 'created', 'updated', 'name_de', 'name_en', 'abstract_de', 'abstract_en',
                  'medium', 'information_id', 'information', 'relationsTo', 'relationsFrom', 'keywords')

    def get_information_id(self, obj):
        return obj.information_id



