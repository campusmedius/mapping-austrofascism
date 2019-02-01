from rest_framework import serializers

from .models import Image, Audio, Video, Gallery
from .models import Information

IMAGE_URL = 'https://services.phaidra.univie.ac.at/api/imageserver?IIIF={}.tif/full/{}/0/default.jpg'
VIDEO_URL = 'https://stream-cd.univie.ac.at/media/phaidra/{}_hi.mp4/playlist.m3u8'
AUDIO_URL = 'https://phaidra.univie.ac.at/open/{}'


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
            serializer = ImageSerializer(
                value.content_object, context=self.context)
        elif isinstance(value.content_object, Audio):
            serializer = AudioSerializer(
                value.content_object, context=self.context)
        elif isinstance(value.content_object, Video):
            serializer = VideoSerializer(
                value.content_object, context=self.context)
        elif isinstance(value.content_object, Gallery):
            serializer = GallerySerializer(
                value.content_object, context=self.context)
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
            'caption_en',
        )

    def get_data(self, obj):
        return {
            'thumbnail': IMAGE_URL.format(obj.phaidra_id, '500,'),
            'mobileThumbnail': IMAGE_URL.format(obj.phaidra_id, '500,'),
            'full': IMAGE_URL.format(obj.phaidra_id, 'full'),
            'mobileFull': IMAGE_URL.format(obj.phaidra_id, '1920,')
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
            'caption_en',
        )

    def get_data(self, obj):
        request = self.context.get('request')
        return {
            'full': AUDIO_URL.format(obj.phaidra_id),
            'thumbnail': request.build_absolute_uri(obj.thumbnail.url),
            'mobileFull': AUDIO_URL.format(obj.phaidra_id),
            'mobileThumbnail': request.build_absolute_uri(obj.thumbnail.url)
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
            'caption_en',
        )

    def get_data(self, obj):
        request = self.context.get('request')
        return {
            'full': VIDEO_URL.format(obj.stream_id),
            'thumbnail': request.build_absolute_uri(obj.thumbnail.url),
            'mobileFull': VIDEO_URL.format(obj.stream_id),
            'mobileThumbnail': request.build_absolute_uri(obj.thumbnail.url)
        }


class GallerySerializer(serializers.ModelSerializer):
    type = ConstantField(value='gallery')
    entities = EntityField(many=True, read_only=True)

    class Meta:
        model = Gallery
        fields = (
            'id',
            'type',
            'entities',
        )


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
            'media',
        )

    def get_media(self, obj):
        media = {'galleries': {}, 'images': {}, 'videos': {}, 'audios': {}}

        for gallery in obj.media_galleries.all():
            data = GallerySerializer(gallery, context=self.context).data
            media['galleries'][str(data['id'])] = data

        for image in obj.media_images.all():
            data = ImageSerializer(image, context=self.context).data
            media['images'][str(data['id'])] = data

        for audio in obj.media_audios.all():
            data = AudioSerializer(audio, context=self.context).data
            media['audios'][str(data['id'])] = data

        for video in obj.media_videos.all():
            data = VideoSerializer(video, context=self.context).data
            media['videos'][str(data['id'])] = data

        return media
