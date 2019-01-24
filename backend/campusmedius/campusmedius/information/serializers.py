import re
from rest_framework import serializers

from .models import Image, Audio, Video, Gallery
from .models import Information

IMAGE_URL = 'https://services.phaidra.univie.ac.at/api/imageserver?IIIF={}.tif/full/{}/0/default.jpg'
VIDEO_URL = 'https://stream-cd.univie.ac.at/media/phaidra/{}_hi.mp4/playlist.m3u8'
AUDIO_URL = 'https://phaidra.univie.ac.at/open/{}'

IMAGE_BLOCK_PATTERN = '<cm-(image).*?id=\\\"([0-9]+?)\\\".*?>.*?<\/cm-image>'
VIDEO_BLOCK_PATTERN = '<cm-(video).*?id=\\\"([0-9]+?)\\\".*?>.*?<\/cm-video>'
AUDIO_BLOCK_PATTERN = '<cm-(audio).*?id=\\\"([0-9]+?)\\\".*?>.*?<\/cm-audio>'
GALLERY_BLOCK_PATTERN = '<cm-(gallery).*?id=\\\"([0-9]+?)\\\".*?>.*?<\/cm-gallery>'

NOTE_BLOCK_PATTERN = '<cm-(note)>(.*?)<\/cm-note>'
QUOTE_BLOCK_PATTERN = '<cm-(quote)>(.*?)<\/cm-quote>'

LINK_INTERN_PATTERN = '<cm-(link-intern).*?href=\\\"(.*?)\\\".*?>(.*?)<\/cm-link-intern>'
LINK_INPAGE_PATTERN = '<cm-(link-inpage).*?href=\\\"(.*?)\\\".*?>(.*?)<\/cm-link-inpage>'
LINK_EXTERN_PATTERN = '<cm-(link-extern).*?href=\\\"(.*?)\\\".*?>(.*?)<\/cm-link-extern>'

BLOCK_PATTERN = [
    IMAGE_BLOCK_PATTERN,
    VIDEO_BLOCK_PATTERN,
    AUDIO_BLOCK_PATTERN,
    GALLERY_BLOCK_PATTERN,
    NOTE_BLOCK_PATTERN,
    QUOTE_BLOCK_PATTERN,
    LINK_INTERN_PATTERN,
    LINK_INPAGE_PATTERN,
    LINK_EXTERN_PATTERN
]

BLOCK_TYPES = ['image', 'video', 'audio', 'gallery', 'note', 'quote',
               'link-intern', 'link-inpage', 'link-extern', 'html']


def serialize_content(content, context):
    # strip p tags
    content = content.replace('<p>', '<div class="ptag"></div>')
    content = content.replace('</p>', '<div class="ptag"></div>')

    split_content = re.split(r'|'.join(BLOCK_PATTERN), content)
    result = []
    i = 0
    while i < len(split_content):
        entry = split_content[i]
        if entry is not None:
            if entry == 'image':
                image = Image.objects.get(pk=int(split_content[i+1]))
                result.append({
                    'data': ImageSerializer(image, context=context).data,
                    'type': 'image'
                })
                i += 1
            elif entry == 'video':
                video = Video.objects.get(pk=int(split_content[i+1]))
                result.append({
                    'data': VideoSerializer(video, context=context).data,
                    'type': 'video'
                })
                i += 1
            elif entry == 'gallery':
                gallery = Gallery.objects.get(pk=int(split_content[i+1]))
                result.append({
                    'data': GallerySerializer(gallery, context=context).data,
                    'type': 'gallery'
                })
                i += 1
            elif entry == 'audio':
                audio = Audio.objects.get(pk=int(split_content[i+1]))
                result.append({
                    'data': AudioSerializer(audio, context=context).data,
                    'type': 'audio'
                })
                i += 1
            elif entry in ['note', 'quote']:
                result.append({
                    'data': {
                        'content': serialize_content(split_content[i+1], context)
                    },
                    'type': entry
                })
                i += 1
            elif entry in ['link-intern', 'link-inpage', 'link-extern']:
                result.append({
                    'data': {
                        'href': split_content[i+1],
                        'text': split_content[i+2]
                    },
                    'type': entry
                })
                i += 2
            else:
                result.append({
                    'data': {
                        'html': entry
                    },
                    'type': 'html'
                })
        i += 1

    return result


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


class MediaBaseSerializer(serializers.ModelSerializer):
    caption_de = serializers.SerializerMethodField()
    caption_en = serializers.SerializerMethodField()

    def get_caption_de(self, obj):
        return serialize_content(obj.caption_de, self.context)

    def get_caption_en(self, obj):
        return serialize_content(obj.caption_en, self.context)


class ImageSerializer(MediaBaseSerializer):
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
            'mobileThumbnail': IMAGE_URL.format(obj.phaidra_id, '300,'),
            'full': IMAGE_URL.format(obj.phaidra_id, 'full'),
            'mobileFull': IMAGE_URL.format(obj.phaidra_id, '800,')
        }


class AudioSerializer(MediaBaseSerializer):
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


class VideoSerializer(MediaBaseSerializer):
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
    content_de = serializers.SerializerMethodField()
    content_en = serializers.SerializerMethodField()

    class Meta:
        model = Information
        fields = ('id', 'title_de', 'title_en', 'content_de', 'content_en')

    def get_content_de(self, obj):
        return serialize_content(obj.content_de, self.context)

    def get_content_en(self, obj):
        return serialize_content(obj.content_en, self.context)
