from rest_framework import serializers

from information.serializers import serialize_content
from .models import Event


class EventSerializer(serializers.ModelSerializer):
    abstract_de = serializers.SerializerMethodField()
    abstract_en = serializers.SerializerMethodField()
    coordinates = serializers.SerializerMethodField()
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')

    class Meta:
        model = Event
        fields = ('title_de', 'title_en', 'abstract_de', 'abstract_en', 'id',
                  'start', 'end', 'timeline_row', 'coordinates',
                  'information_id', 'information', 'next_event',
                  'previous_event')

    def get_information_id(self, obj):
        return obj.information_id

    def get_coordinates(self, obj):
        return {
            'lng': obj.location.split(',')[1],
            'lat': obj.location.split(',')[0]
        }

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)
        internal[
            'location'] = data['coordinates']['lat'] + ',' + data['coordinates']['lng']
        return internal

    def get_abstract_de(self, obj):
        return serialize_content(obj.abstract_de, self.context)

    def get_abstract_en(self, obj):
        return serialize_content(obj.abstract_en, self.context)
