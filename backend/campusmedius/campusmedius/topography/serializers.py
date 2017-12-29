from rest_framework import serializers

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    coordinates = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')

    class Meta:
        model = Event
        fields = (
            'title_de',
            'title_en',
            'id',
            'start',
            'end',
            'timeline_row',
            'coordinates',
            'information',
            'next_event',
            'previous_event'
        )

    def get_coordinates(self, obj):
        return {'lng': obj.lng, 'lat': obj.lat}

    def to_internal_value(self, data):
        internal = super().to_internal_value(data)
        internal['lng'] = data['coordinates']['lng']
        internal['lat'] = data['coordinates']['lat']
        return internal
