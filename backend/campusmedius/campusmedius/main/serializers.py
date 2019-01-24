from rest_framework import serializers

from .models import Page
from information.serializers import serialize_content


class PageSerializer(serializers.ModelSerializer):
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')
    abstract_de = serializers.SerializerMethodField()
    abstract_en = serializers.SerializerMethodField()
    content_de = serializers.SerializerMethodField()
    content_en = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = (
            'id',
            'title_de',
            'title_en',
            'abstract_de',
            'abstract_en',
            'content_de',
            'content_en',
            'information_id',
            'information'
        )

    def get_information_id(self, obj):
        return obj.information_id

    def get_abstract_de(self, obj):
        return serialize_content(obj.abstract_de, self.context)

    def get_abstract_en(self, obj):
        return serialize_content(obj.abstract_en, self.context)

    def get_content_de(self, obj):
        return serialize_content(obj.content_de, self.context)

    def get_content_en(self, obj):
        return serialize_content(obj.content_en, self.context)
