from rest_framework import serializers
from taggit_serializer.serializers import TaggitSerializer

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    coordinates = serializers.SerializerMethodField()
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')
    keywords_de = serializers.SerializerMethodField()
    keywords_en = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ( 'created', 'updated','title_de', 'title_en',
                   'abstract_de', 'abstract_en', 'id',
                  'start', 'end', 'timeline_row', 'coordinates',
                  'information_id', 'information', 'next_event',
                   'previous_event', 'keywords_de', 'keywords_en')

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
