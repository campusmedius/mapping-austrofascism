import re

from bs4 import BeautifulSoup

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Page
from topography.models import Event
from topology.models import Mediator
from information.models import Image, Video, Audio

from .serializers import PageSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer



@api_view(['GET'])
def search_documents_de(request):
    documents = []
    documents += get_pages_search_documents('de') 
    documents += get_events_search_documents('de') 
    documents += get_mediators_search_documents('de')
    return Response(documents)


@api_view(['GET'])
def search_documents_en(request):
    documents = []
    documents += get_pages_search_documents('en') 
    documents += get_events_search_documents('en') 
    documents += get_mediators_search_documents('en')
    return Response(documents)


def get_media_and_note_search_documents(soup, title, path, lang):
    documents = []

    # images
    for image in soup.find_all('cm-image'):
        image_object = Image.objects.get(id=image.get('id'))
        documents.append({
            "type": "image",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#i:{image_object.id}",
            "text": re.sub('<[^<]+?>', '', getattr(image_object, "caption_" + lang)),
        })

    # videos
    for video in soup.find_all('cm-video'):
        video_object = Video.objects.get(id=video.get('id'))
        documents.append({
            "type": "video",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#v:{video_object.id}",
            "text": re.sub('<[^<]+?>', '', getattr(video_object, "caption_" + lang)),
        })

    # audios
    for audio in soup.find_all('cm-audio'):
        audio_object = Audio.objects.get(id=audio.get('id'))
        documents.append({
            "type": "audio",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#i:{audio_object.id}",
            "text": re.sub('<[^<]+?>', '', getattr(audio_object, "caption_" + lang)),
        })

    # notes
    index = 1
    for note in soup.find_all('cm-note'):
        documents.append({
            "type": "note",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#n:{index}",
            "text": note.get_text(),
        })
        index += 1

    return documents


def get_pages_search_documents(lang):
    documents = []

    pages_all = Page.objects.all()
    for page in pages_all:
        if page.title_en == "Overview":
            path = '/overview'
        elif page.title_en == "Team":
            path = '/team'
        elif page.title_en == "Book Edition":
            path = '/book'

        title = re.sub('<[^<]+?>', '', getattr(page, "title_" + lang))

        documents.append({
            "type": "title",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#p:0",
            "text": title
        })

        if page.information:
            soup = BeautifulSoup(getattr(page.information, "content_" + lang), 'html.parser')

            # generate media and notes documents
            documents += get_media_and_note_search_documents(
                soup, 
                title,
                path,
                lang
            )

            # remove notes from soup
            for note in soup.select('cm-note'):
                note.extract()

            # get paragraph documents
            index = 1
            for paragraph in soup.find_all('p'):
                text = paragraph.get_text()
                if text and text != "":
                    documents.append({
                        "type": "page",
                        "title": title,
                        "location": f"{path}?lang={lang}#p:{index}",
                        "text": text
                    })
                index += 1
    
    return documents


def get_events_search_documents(lang):
    documents = []

    events_all = Event.objects.all()
    for event in events_all:
        path = f"/topography/events/{event.id}"
        title = re.sub('<[^<]+?>', '', getattr(event, "title_" + lang))

        documents.append({
            "type": "title",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#p:0",
            "text": title
        })

        keywords = [getattr(tag, "title_" + lang) for tag in event.keywords.all()]
        documents.append({
            "type": "keywords",
            "title": title,
            "location": f"{path}?lang={lang}&info=full",
            "text": ' '.join(keywords)
        })

        if event.information:
            soup = BeautifulSoup(getattr(event.information, "content_" + lang), 'html.parser')

            # generate media and notes documents
            documents += get_media_and_note_search_documents(
                soup, 
                title,
                path,
                lang
            )

            # remove notes from soup
            for note in soup.select('cm-note'):
                note.extract()

            # get paragraph documents
            index = 1
            for paragraph in soup.find_all('p'):
                text = paragraph.get_text()
                if text and text != "":
                    documents.append({
                        "type": "event",
                        "title": title,
                        "location": f"{path}?lang={lang}&info=full#p:{index}",
                        "text": text
                    })
                index += 1

    return documents


def get_mediators_search_documents(lang):
    documents = []

    mediators_all = Mediator.objects.all()
    for mediator in mediators_all:
        if mediator.id in [0, 1, 2, 3, 4, 5]:
            mediationId = "1"
        elif mediator.id in [6, 7, 8, 9, 10]:
            mediationId = "2"
        elif mediator.id in [11, 12, 13, 14, 15]:
            mediationId = "3"

        path = f"/topology/mediations/{mediationId}/mediators/{mediator.id}"
        title = re.sub('<[^<]+?>', '', getattr(mediator, "title_" + lang))

        documents.append({
            "type": "title",
            "title": title,
            "location": f"{path}?lang={lang}&info=full#p:0",
            "text": title
        })

        keywords = [getattr(tag, "title_" + lang) for tag in mediator.keywords.all()]
        documents.append({
            "type": "keywords",
            "title": title,
            "location": f"{path}?lang={lang}&info=full",
            "text": ' '.join(keywords)
        })

        if mediator.information:
            soup = BeautifulSoup(getattr(mediator.information, "content_" + lang), 'html.parser')
            
            # generate media and notes documents
            documents += get_media_and_note_search_documents(
                soup, 
                title,
                path,
                lang
            )

            # remove notes from soup
            for note in soup.select('cm-note'):
                note.extract()

            # get paragraph documents
            index = 1
            for paragraph in soup.find_all('p'):
                text = paragraph.get_text()
                if text and text != "":
                    documents.append({
                        "type": "mediator",
                        "title": title,
                        "location": f"{path}?lang={lang}&info=full#p:{index}",
                        "text": text
                    })
                index += 1

    return documents