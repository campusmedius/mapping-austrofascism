from rest_framework import serializers

from .models import Image, Audio, Video, Gallery
from .models import MediaEntity
from .models import Information


# Helper field
class ConstantField(serializers.Field):
    def __init__(self, value, *args, **kwargs):
        self._value = value
        kwargs['read_only'] = True

        super(ConstantField, self).__init__(*args, **kwargs)

    def get_attribute(self, obj):
        return self._value

    def to_representation(self, value):
        return self._value


class EntityField(serializers.RelatedField):
    def to_representation(self, value):
        if isinstance(value.content_object, Image):
            serializer = ImageSerializer(value.content_object)
        elif isinstance(value.content_object, Audio):
            serializer = AudioSerializer(value.content_object)
        elif isinstance(value.content_object, Video):
            serializer = VideoSerializer(value.content_object)
        elif isinstance(value.content_object, Gallery):
            serializer = GallerySerializer(value.content_object)
        elif value.content_object is None:
            return None
        else:
            raise Exception('Unexpected type of Enity object')

        return serializer.data


class ImageSerializer(serializers.ModelSerializer):
    type = ConstantField(value='image')

    class Meta:
        model = Image
        fields = (
            'id',
            'type',
            'url',
            'caption_de',
            'caption_en', )


class AudioSerializer(serializers.ModelSerializer):
    type = ConstantField(value='audio')

    class Meta:
        model = Audio
        fields = (
            'id',
            'type',
            'url',
            'caption_de',
            'caption_en', )


class VideoSerializer(serializers.ModelSerializer):
    type = ConstantField(value='video')

    class Meta:
        model = Video
        fields = (
            'id',
            'type',
            'url',
            'caption_de',
            'caption_en', )


class GallerySerializer(serializers.ModelSerializer):
    type = ConstantField(value='gallery')

    entities = EntityField(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = (
            'id',
            'type',
            'title_de',
            'title_en',
            'entities', )


class InformationSerializer(serializers.ModelSerializer):
    type = ConstantField(value='information')
    media = serializers.SerializerMethodField()

    class Meta:
        model = Information
        fields = (
            'id',
            'type',
            'title_de',
            'title_en',
            'content_de',
            'content_en',
            'media',)

    def get_media(self, obj):
        media = {
            'galleries': {},
            'images': {},
            'videos': {},
            'audios': {}
        }

        for gallery in obj.media_galleries.all():
            data = GallerySerializer(gallery).data
            media['galleries'][str(data['id'])] = data

        for image in obj.media_images.all():
            data = ImageSerializer(image).data
            media['images'][str(data['id'])] = data

        for audio in obj.media_audios.all():
            data = AudioSerializer(audio).data
            media['audios'][str(data['id'])] = data

        for video in obj.media_videos.all():
            data = VideoSerializer(video).data
            media['videos'][str(data['id'])] = data

        return media
