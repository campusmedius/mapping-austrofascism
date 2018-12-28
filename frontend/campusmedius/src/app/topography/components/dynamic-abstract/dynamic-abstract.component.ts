import {
    Component, OnInit, OnChanges, ViewChild, ViewContainerRef, ComponentRef,
    ComponentFactoryResolver, Compiler, ComponentFactory,
    ModuleWithComponentFactories, NgModule, Input, SimpleChanges
} from '@angular/core';

import { InformationModule } from '../../../information/information.module';

@Component({
    selector: 'cm-dynamic-abstract',
    templateUrl: './dynamic-abstract.component.html',
    styleUrls: ['./dynamic-abstract.component.scss']
})
export class DynamicAbstractComponent implements OnInit, OnChanges {
    @ViewChild('container', { read: ViewContainerRef })
    abstractContainer: ViewContainerRef;
    private abstractComponentRef: ComponentRef<{}>;

    @Input() content: string;


    constructor(private compiler: Compiler) { }

    ngOnInit() {
        this.renderContent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['content']) {
            this.renderContent();
        }
    }

    private renderContent() {
        const cmpClass = class RuntimeComponent { };
        const decoratedCmp = Component({
            selector: 'cm-abstract-dynamic',
            template: this.content
        })(cmpClass);

        @NgModule({ imports: [InformationModule], declarations: [decoratedCmp] })
        class RuntimeComponentModule { }

        const module: ModuleWithComponentFactories<any> = this.compiler
            .compileModuleAndAllComponentsSync(RuntimeComponentModule);
        const factory = module.componentFactories
            .find(f => f.componentType === decoratedCmp);

        if (this.abstractComponentRef) {
            this.abstractComponentRef.destroy();
            this.abstractComponentRef = null;
        }

        this.abstractComponentRef = this.abstractContainer.createComponent(factory);
    }

}
