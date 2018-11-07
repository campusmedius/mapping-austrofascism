import {
    Component, OnInit, OnChanges, ViewChild, ViewContainerRef, ComponentRef,
    ComponentFactoryResolver, Compiler, ComponentFactory,
    ModuleWithComponentFactories, NgModule, Input
} from '@angular/core';

import { InformationModule } from '../../../information/information.module';
import { Information } from '../../../information/models/information';

@Component({
    selector: 'cm-dynamic-information',
    templateUrl: './dynamic-information.component.html',
    styleUrls: ['./dynamic-information.component.scss']
})
export class DynamicInformationComponent implements OnInit, OnChanges {
    @ViewChild('container', { read: ViewContainerRef })
    infoContainer: ViewContainerRef;
    private infoComponentRef: ComponentRef<{}>;

    @Input() information: Information;
    @Input() lang: string;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private compiler: Compiler) { }

    ngOnInit() { }

    ngOnChanges() {
        if (this.information && this.lang) {
            this.renderInformation(this.information, this.lang);
        }
    }

    private renderInformation(information: Information, lang: string) {
        const content = lang === 'en' ? information.contentEn : information.contentDe;
        const cmpClass = class RuntimeComponent { data = information; lang = lang; };
        const decoratedCmp = Component({
            selector: 'cm-info-dynamic',
            template: '<cm-information [data]="data" [lang]="lang">'
                + content + '</cm-information>'
        })(cmpClass);

        @NgModule({ imports: [InformationModule], declarations: [decoratedCmp] })
        class RuntimeComponentModule { }

        const module: ModuleWithComponentFactories<any> = this.compiler
            .compileModuleAndAllComponentsSync(RuntimeComponentModule);
        const factory = module.componentFactories
            .find(f => f.componentType === decoratedCmp);

        if (this.infoComponentRef) {
            this.infoComponentRef.destroy();
            this.infoComponentRef = null;
        }

        this.infoComponentRef = this.infoContainer.createComponent(factory);
    }
}
