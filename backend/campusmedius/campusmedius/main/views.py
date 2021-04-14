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
            "location": f"{path}?lang={lang}&info=full#a:{audio_object.id}",
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
        elif page.title_en == "Project Team":
            path = '/team'
        elif page.title_en == "Book Edition":
            path = '/book'
        elif page.title_en == "Disclosure":
            path = '/disclosure'

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

def insert_nbsp_in_text(text):
    text = text.replace(' <cm-note', '&nbsp;<cm-note')
    text = text.replace(' <cm-image', '&nbsp;<cm-image')
    text = text.replace(' <cm-audio', '&nbsp;<cm-audio')
    text = text.replace(' <cm-video', '&nbsp;<cm-video')

    text = text.replace(' 1.0', '&nbsp;1.0')
    text = text.replace(' 2.0', '&nbsp;2.0')

    text = text.replace('Mapbox GL JS', 'Mapbox&nbsp;GL&nbsp;JS')
    text = text.replace('Howell 2709', 'Howell&nbsp;2709')

    text = text.replace(' GmbH', '&nbsp;GmbH')
    text = text.replace(' AG', '&nbsp;AG')
    text = text.replace('Dr. ', 'Dr.&nbsp;')
    text = text.replace('Mr. ', 'Mr.&nbsp;')

    text = re.sub(r"(straße)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(strasse)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(Straße)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(Strasse)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(gasse)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(Wienzeile)\s([0-9])", r"\1&nbsp;\2", text)

    text = re.sub(r"([0-9])\s(cm)", r"\1&nbsp;\2", text)

    text = re.sub(r"(box)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(Box)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(box)\s(I)", r"\1&nbsp;\2", text)
    text = re.sub(r"(Box)\s(I)", r"\1&nbsp;\2", text)

    text = re.sub(r"(Mappe)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(folder)\s([0-9])", r"\1&nbsp;\2", text)

    text = re.sub(r"([0-9]\.)\s(Jänner)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Februar)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(März)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(April)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Mai)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Juni)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Juli)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(August)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(September)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Oktober)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(November)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Dezember)", r"\1&nbsp;\2", text)

    text = re.sub(r"([0-9]\.)\s(Jahrhundert)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9]\.)\s(Jahrhunderts)", r"\1&nbsp;\2", text)

    text = re.sub(r"([0-9])\s(Uhr)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9])\s(Stunden)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9])\s(Jahre)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9])\s(Bilder)", r"\1&nbsp;\2", text)

    text = text.replace('S. ', 'S.&nbsp;')
    text = text.replace('Bd. ', 'Bd.&nbsp;')
    text = text.replace('Bde. ', 'Bde.&nbsp;')
    text = text.replace('Abb. ', 'Abb.&nbsp;')
    text = text.replace('Taf. ', 'Taf.&nbsp;')
    text = text.replace('Nr. ', 'Nr.&nbsp;')
    
    text = re.sub(r"([0-9]\.)\s(Teilband)", r"\1&nbsp;\2", text)

    text = re.sub(r"(frz\.)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(engl\.)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(russ\.)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(ital\.)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(dt\.)\s([0-9])", r"\1&nbsp;\2", text)

    text = text.replace(' I.', '&nbsp;I.')
    text = text.replace(' II.', '&nbsp;II.')
    text = text.replace(' III.', '&nbsp;III.')
    text = text.replace(' XIV.', '&nbsp;XIV.')
    text = text.replace(' XVIII.', '&nbsp;XVIII.')

    text = re.sub(r"(u\.)\s([0-9])", r"\1&nbsp;\2", text)

    text = text.replace('Modell 2709', 'Modell&nbsp;2709')
    text = text.replace('Modells 2709', 'Modells&nbsp;2709')

    text = text.replace('Magistratsabteilung 5', 'Magistratsabteilung&nbsp;5')

    text = re.sub(r"(January)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(February)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(March)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(April)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(May)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(June)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(July)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(August)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(September)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(October)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(November)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(December)\s([0-9])", r"\1&nbsp;\2", text)

    text = re.sub(r"([0-9])\s(a\.m\.)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9])\s(p\.m\.)", r"\1&nbsp;\2", text)

    text = re.sub(r"(p\.)\s([0-9])", r"\1&nbsp;\2", text)
    text = re.sub(r"(pp\.)\s([0-9])", r"\1&nbsp;\2", text)

    text = re.sub(r"([0-9])\s(years)", r"\1&nbsp;\2", text)
    text = re.sub(r"([0-9])\s(frames)", r"\1&nbsp;\2", text)

    text = re.sub(r"(vol\.)\s([0-9I])", r"\1&nbsp;\2", text)
    text = re.sub(r"(vols\.)\s([0-9I])", r"\1&nbsp;\2", text)
    text = re.sub(r"(Vol\.)\s([0-9I])", r"\1&nbsp;\2", text)
    text = re.sub(r"(Vols\.)\s([0-9I])", r"\1&nbsp;\2", text)
    text = re.sub(r"(fig\.)\s([0-9I])", r"\1&nbsp;\2", text)
    text = re.sub(r"(tab\.)\s([0-9I])", r"\1&nbsp;\2", text)

    text = text.replace('War I', 'War&nbsp;I')
    text = text.replace('War II', 'War&nbsp;II')

    text = text.replace('35 mm', '35&nbsp;mm')
    text = text.replace('Leopold I', 'Leopold&nbsp;I')
    text = text.replace('Francis I', 'Francis&nbsp;I')
    text = text.replace('Gundacker I', 'Gundacker&nbsp;I')
    text = text.replace('Joseph I', 'Joseph&nbsp;I')
    text = text.replace('Erasmus I', 'Erasmus&nbsp;I')
    text = text.replace('Ferdinand I', 'Ferdinand&nbsp;I')
    text = text.replace('Maximilian I', 'Maximilian&nbsp;I')
    text = text.replace('Charles I', 'Charles&nbsp;I')
    text = text.replace('Frederick III', 'Frederick&nbsp;III')
    text = text.replace('Louis XIV', 'Louis&nbsp;XIV')
    text = text.replace('Louis XVIII', 'Louis&nbsp;XVIII')

    text = text.replace(' ed.', '&nbsp;ed.')

    text = text.replace('2709 model', '2709&nbsp;model')

    text = re.sub(r"(No\.)\s([0-9I])", r"\1&nbsp;\2", text)
    text = re.sub(r"(no\.)\s([0-9I])", r"\1&nbsp;\2", text)

    text = re.sub(r"(department)\s([0-9])", r"\1&nbsp;\2", text)

    # print(text)
    for m in re.finditer('&nbsp;', text):
        start = m.start() - 30
        if start < 0:
            start = 0
        end = m.start() + 35
        if end > len(text):
            end = len(text)
        print(text.replace('&nbsp;', '~').replace('\n', '')[start:end])

    return text


@api_view(['GET'])
def insert_nbsp(request):

    pages_all = Page.objects.all()
    for page in pages_all:
        page.abstract_de = insert_nbsp_in_text(page.abstract_de)
        page.abstract_en = insert_nbsp_in_text(page.abstract_en)
        page.mobile_abstract_de = insert_nbsp_in_text(page.mobile_abstract_de)
        page.mobile_abstract_en = insert_nbsp_in_text(page.mobile_abstract_en)
        page.save()

        if page.information:
            page.information.content_de = insert_nbsp_in_text(page.information.content_de)
            page.information.content_en = insert_nbsp_in_text(page.information.content_en)
            page.information.save()

    events_all = Event.objects.all()
    for event in events_all:
        event.abstract_de = insert_nbsp_in_text(event.abstract_de)
        event.abstract_en = insert_nbsp_in_text(event.abstract_en)
        event.save()

        if event.information:
            event.information.content_de = insert_nbsp_in_text(event.information.content_de)
            event.information.content_en = insert_nbsp_in_text(event.information.content_en)
            event.information.save()

    mediators_all = Mediator.objects.all()
    for mediator in mediators_all:
        mediator.abstract_de = insert_nbsp_in_text(mediator.abstract_de)
        mediator.abstract_en = insert_nbsp_in_text(mediator.abstract_en)
        mediator.save()

        if mediator.information:
            mediator.information.content_de = insert_nbsp_in_text(mediator.information.content_de)
            mediator.information.content_en = insert_nbsp_in_text(mediator.information.content_en)
            mediator.information.save()

    images_all = Image.objects.all()
    for image in images_all:
        image.caption_de = insert_nbsp_in_text(image.caption_de)
        image.caption_en = insert_nbsp_in_text(image.caption_en)
        image.save()

    videos_all = Video.objects.all()
    for video in videos_all:
        video.caption_de = insert_nbsp_in_text(video.caption_de)
        video.caption_en = insert_nbsp_in_text(video.caption_en)
        video.save()

    audios_all = Audio.objects.all()
    for audio in audios_all:
        audio.caption_de = insert_nbsp_in_text(audio.caption_de)
        audio.caption_en = insert_nbsp_in_text(audio.caption_en)
        audio.save()
            
    return Response({"success": True})