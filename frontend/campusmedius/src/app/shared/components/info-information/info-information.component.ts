import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { Information } from '../../models/information';

import { InfoImageComponent } from '../info-image/info-image.component';

@Component({
    selector: 'cm-info-information',
    templateUrl: './info-information.component.html',
    styleUrls: ['./info-information.component.scss']
})
export class InfoInformationComponent implements OnInit, AfterViewInit {
    @Input() data: Information;
    @Input() lang: string;
    @ViewChild('test') test: ElementRef;


    public content: SafeHtml;


    constructor(private element: ElementRef, private sanitizer: DomSanitizer, private viewContainerRef: ViewContainerRef, private componentFactoryResolver: ComponentFactoryResolver) {
        this.content = this.sanitizer.bypassSecurityTrustHtml('sddsa <div #test id="test"> sdsdd</div> adsda');
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        console.log('dsa');

        this.viewContainerRef.element.nativeElement = this.element.nativeElement.querySelector('#test');

        const inputProviders = [
            { provide: 'data', useValue: this.data.media.images['1'] },
            { provide: 'lang', useValue: this.lang }
        ];
        const resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.viewContainerRef.parentInjector);

        const factory = this.componentFactoryResolver.resolveComponentFactory(InfoImageComponent);

        const component = factory.create(injector);

        component.instance.data = this.data.media.images['1'];

        const componentRef = this.viewContainerRef.insert(component.hostView);
    }

}
