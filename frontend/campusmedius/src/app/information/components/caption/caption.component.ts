import {
    Component, OnInit, Input
} from '@angular/core';

import { InformationModule } from '../../information.module';

@Component({
    selector: 'cm-caption',
    templateUrl: './caption.component.html',
    styleUrls: ['./caption.component.scss']
})
export class CaptionComponent implements OnInit {
    @Input() content: string;
    @Input() lang: string;

    constructor() { }

    ngOnInit() {
    } l
}
