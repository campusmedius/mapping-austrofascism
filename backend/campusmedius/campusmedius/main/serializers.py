from rest_framework import serializers

from .models import Page


class PageSerializer(serializers.ModelSerializer):
    created = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()
    keywords_de = serializers.SerializerMethodField()
    keywords_en = serializers.SerializerMethodField()
    information_id = serializers.SerializerMethodField()
    information = serializers.HyperlinkedRelatedField(
        read_only=True, view_name='information_api:information-detail')

    class Meta:
        model = Page
        fields = (
            'id',
            'created',
            'updated',
            'title_de',
            'title_en',
            'abstract_de',
            'abstract_en',
            'mobile_abstract_de',
            'mobile_abstract_en',
            'information_id',
            'information', 
            'keywords_de', 
            'keywords_en'
        )

    def get_information_id(self, obj):
        return obj.information_id

    def get_keywords_de(self, value):
        return [tag.title_de for tag in value.keywords.all()]

    def get_keywords_en(self, value):
        return [tag.title_en for tag in value.keywords.all()]

    def get_updated(self, obj):
        if obj.information and obj.information.updated and obj.information.updated > obj.updated:
            return obj.information.updated
        return obj.updated

    def get_created(self, obj):
        return obj.created