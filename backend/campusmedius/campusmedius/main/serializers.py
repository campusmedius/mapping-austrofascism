from rest_framework import serializers

from .models import Page


class PageSerializer(serializers.ModelSerializer):
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')

    class Meta:
        model = Page
        fields = (
            'id',
            'title_de',
            'title_en',
            'abstract_de',
            'abstract_en',
            'mobile_abstract_de',
            'mobile_abstract_en',
            'information_id',
            'information'
        )

    def get_information_id(self, obj):
        return obj.information_id
