import {
    Component, OnInit, Input, ComponentRef, Compiler,
    ViewContainerRef, ModuleWithComponentFactories, NgModule, ViewChild
} from '@angular/core';

import { InformationModule } from '../../information.module';

@Component({
    selector: 'cm-caption',
    templateUrl: './caption.component.html',
    styleUrls: ['./caption.component.scss']
})
export class CaptionComponent implements OnInit {
    @Input() content: string;
    @ViewChild('caption', { read: ViewContainerRef })
    captionContainer: ViewContainerRef;
    private captionComponentRef: ComponentRef<{}>;

    constructor(private compiler: Compiler) { }

    ngOnInit() {
        const cmpClass = class RuntimeComponent { };
        const decoratedCmp = Component({
            selector: 'cm-caption-content',
            template: this.content
        })(cmpClass);

        @NgModule({ imports: [InformationModule], declarations: [decoratedCmp] })
        class RuntimeComponentModule { }

        const module: ModuleWithComponentFactories<any> = this.compiler
            .compileModuleAndAllComponentsSync(RuntimeComponentModule);
        const factory = module.componentFactories
            .find(f => f.componentType === decoratedCmp);

        if (this.captionComponentRef) {
            this.captionComponentRef.destroy();
            this.captionComponentRef = null;
        }

        this.captionComponentRef = this.captionContainer.createComponent(factory);
    }

}
