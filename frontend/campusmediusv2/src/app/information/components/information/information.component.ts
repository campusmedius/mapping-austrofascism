import {
    Component, OnInit, OnDestroy, OnChanges, Input, ElementRef, ComponentFactory,
    ComponentFactoryResolver, ViewChild, ViewContainerRef, ComponentRef, Injector, ApplicationRef,
    Output, EventEmitter, HostListener
} from '@angular/core';

import { Subscription } from 'rxjs';

import { InformationMedia } from '../../models/information';

import { NoteComponent } from '../note/note.component';
import { QuoteComponent } from '../quote/quote.component';
import { LinkExternComponent } from '../link-extern/link-extern.component';
import { LinkInternComponent } from '../link-intern/link-intern.component';
import { LinkInpageComponent } from '../link-inpage/link-inpage.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ImageComponent } from '../image/image.component';
import { AudioComponent } from '../audio/audio.component';
import { VideoComponent } from '../video/video.component';

@Component({
    selector: 'cm-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit, OnDestroy, OnChanges {
    @Input() content: string;
    @Input() lang: string;
    @Input() media: InformationMedia;

    @Output() galleryClosed = new EventEmitter();
    @Output() galleryOpened = new EventEmitter();

    private subscriptions: Subscription[] = [];

    private noteFactory: ComponentFactory<NoteComponent>;
    private quoteFactory: ComponentFactory<QuoteComponent>;

    private linkInternFactory: ComponentFactory<LinkInternComponent>;
    private linkExternFactory: ComponentFactory<LinkExternComponent>;
    private linkInpageFactory: ComponentFactory<LinkInpageComponent>;

    private galleryFactory: ComponentFactory<GalleryComponent>;
    private imageFactory: ComponentFactory<ImageComponent>;
    private videoFactory: ComponentFactory<VideoComponent>;
    private audioFactory: ComponentFactory<AudioComponent>;

    private componentRefs: ComponentRef<any>[] = [];

    constructor(
        private element: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
        private applicationRef: ApplicationRef,
    ) {
        this.noteFactory = this.componentFactoryResolver.resolveComponentFactory(NoteComponent);
        this.quoteFactory = this.componentFactoryResolver.resolveComponentFactory(QuoteComponent);
        this.linkInternFactory = this.componentFactoryResolver.resolveComponentFactory(LinkInternComponent);
        this.linkExternFactory = this.componentFactoryResolver.resolveComponentFactory(LinkExternComponent);
        this.linkInpageFactory = this.componentFactoryResolver.resolveComponentFactory(LinkInpageComponent);
        this.galleryFactory = this.componentFactoryResolver.resolveComponentFactory(GalleryComponent);
        this.imageFactory = this.componentFactoryResolver.resolveComponentFactory(ImageComponent);
        this.videoFactory = this.componentFactoryResolver.resolveComponentFactory(VideoComponent);
        this.audioFactory = this.componentFactoryResolver.resolveComponentFactory(AudioComponent);
    }

    ngOnInit() {
    }

    ngOnChanges() {
        this.destroyAllDynamicComponents();
        this.insertDynamicComponents();
    }

    private insertDynamicComponents() {
        setTimeout(() => {
            const elements = this.element.nativeElement.querySelectorAll(':scope > .wrapper > p, cm-note, cm-quote, cm-link-intern, cm-link-extern, cm-link-inpage, cm-gallery, cm-image, cm-video, cm-audio');
            let paragraphId = 1;
            let noteId = 1;
            let quoteId = 1;
            elements.forEach((e) => {
                let componentRef;
                if (e.tagName === 'P') {
                    e.id = 'p:' + paragraphId;
                    paragraphId += 1;
                    return
                } else if (e.tagName === 'CM-NOTE') {
                    const content = e.innerHTML;
                    componentRef = this.noteFactory.create(this.injector, [], e);
                    componentRef.instance.id = noteId;
                    noteId += 1;
                    componentRef.instance.content = content;
                    componentRef.instance.lang = this.lang;
                    componentRef.instance.media = this.media;

                } else if (e.tagName === 'CM-QUOTE') {
                    const content = e.innerHTML;
                    componentRef = this.quoteFactory.create(this.injector, [], e);
                    componentRef.instance.id = quoteId;
                    quoteId += 1;
                    componentRef.instance.content = content;
                    componentRef.instance.lang = this.lang;
                    componentRef.instance.media = this.media;
                    this.subscriptions.push(componentRef.instance.opened.subscribe(() => {
                        this.galleryOpened.emit();
                    }));
                    this.subscriptions.push(componentRef.instance.closed.subscribe(() => {
                        this.galleryClosed.emit();
                    }));

                } else if (e.tagName === 'CM-LINK-INTERN') {
                    const text = e.innerHTML;
                    const href = e.attributes.href.value;
                    let info = null;
                    if (e.attributes.info) {
                        info = e.attributes.info.value;
                    }
                    componentRef = this.linkInternFactory.create(this.injector, [], e);
                    componentRef.instance.text = text;
                    componentRef.instance.href = href;
                    componentRef.instance.info = info;
                } else if (e.tagName === 'CM-LINK-EXTERN') {
                    const text = e.innerHTML;
                    const href = e.attributes.href.value;
                    componentRef = this.linkExternFactory.create(this.injector, [], e);
                    componentRef.instance.text = text;
                    componentRef.instance.href = href;
                } else if (e.tagName === 'CM-LINK-INPAGE') {
                    const text = e.innerHTML;
                    const href = e.attributes.href.value;
                    componentRef = this.linkInpageFactory.create(this.injector, [], e);
                    componentRef.instance.text = text;
                    componentRef.instance.href = href;
                } else if (e.tagName === 'CM-GALLERY') {
                    const id = e.attributes.id.value;
                    componentRef = this.galleryFactory.create(this.injector, [], e);
                    componentRef.instance.id = id;
                    componentRef.instance.data = this.media.galleries[id];
                    componentRef.instance.lang = this.lang;
                    this.subscriptions.push(componentRef.instance.opened.subscribe(() => {
                        this.galleryOpened.emit();
                    }));
                    this.subscriptions.push(componentRef.instance.closed.subscribe(() => {
                        this.galleryClosed.emit();
                    }));
                } else if (e.tagName === 'CM-IMAGE') {
                    const id = e.attributes.id.value;
                    componentRef = this.imageFactory.create(this.injector, [], e);
                    componentRef.instance.id = id;
                    componentRef.instance.data = this.media.images[id];
                    componentRef.instance.lang = this.lang;
                    this.subscriptions.push(componentRef.instance.opened.subscribe(() => {
                        this.galleryOpened.emit();
                    }));
                    this.subscriptions.push(componentRef.instance.closed.subscribe(() => {
                        this.galleryClosed.emit();
                    }));
                } else if (e.tagName === 'CM-VIDEO') {
                    const id = e.attributes.id.value;
                    componentRef = this.videoFactory.create(this.injector, [], e);
                    componentRef.instance.id = id;
                    componentRef.instance.data = this.media.videos[id];
                    componentRef.instance.lang = this.lang;
                } else if (e.tagName === 'CM-AUDIO') {
                    const id = e.attributes.id.value;
                    componentRef = this.audioFactory.create(this.injector, [], e);
                    componentRef.instance.id = id;
                    componentRef.instance.data = this.media.audios[id];
                    componentRef.instance.lang = this.lang;
                }
                this.applicationRef.attachView(componentRef.hostView);
                this.componentRefs.push(componentRef);
            });
        });
    }

    private destroyAllDynamicComponents() {
        this.subscriptions.forEach((s) => {
            s.unsubscribe();
        });
        this.componentRefs.forEach((c) => {
            c.destroy();
        });
    }

    public openComponentByRef(ref: string) {
        if (ref.startsWith('i:') || ref.startsWith('v:') || ref.startsWith('a:') || ref.startsWith('n:')) {
            this.componentRefs.forEach(c => {
                if ((<any>c).instance.elementId === ref) {
                    c.instance.openInline();
                }
            })
        }
    }

    ngOnDestroy() {
        this.destroyAllDynamicComponents();
    }
}
