from rest_framework import serializers

from .models import Image, Audio, Video, Gallery
from .models import Information

IMAGE_URL = 'https://services.phaidra.univie.ac.at/api/imageserver?IIIF={}.tif/full/{}/0/default.jpg'
VIDEO_URL = 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'
AUDIO_URL = 'https://hpr.dogphilosophy.net/test/ogg.ogg'

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
    data = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = (
            'id',
            'type',
            'data',
            'caption_de',
            'caption_en', )

    def get_data(self, obj):
        return {
            'thumbnail': IMAGE_URL.format(obj.phaidra_id, '500,'),
            'full': IMAGE_URL.format(obj.phaidra_id, '1920,')
        }


class AudioSerializer(serializers.ModelSerializer):
    type = ConstantField(value='audio')
    data = serializers.SerializerMethodField()

    class Meta:
        model = Audio
        fields = (
            'id',
            'type',
            'data',
            'caption_de',
            'caption_en', )

    def get_data(self, obj):
        return {
            'full': AUDIO_URL,
            'thumbnail': 'http://gettravel.com/wp-content/uploads/2018/04/Video-Placeholder.jpg'
        }


class VideoSerializer(serializers.ModelSerializer):
    type = ConstantField(value='video')
    data = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = (
            'id',
            'type',
            'data',
            'caption_de',
            'caption_en', )

    def get_data(self, obj):
        return {
            'full': VIDEO_URL,
            'thumbnail': 'http://gettravel.com/wp-content/uploads/2018/04/Video-Placeholder.jpg'
        }


class GallerySerializer(serializers.ModelSerializer):
    type = ConstantField(value='gallery')
    entities = EntityField(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = (
            'id',
            'type',
            'entities', )


class InformationSerializer(serializers.ModelSerializer):
    media = serializers.SerializerMethodField()

    class Meta:
        model = Information
        fields = (
            'id',
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
