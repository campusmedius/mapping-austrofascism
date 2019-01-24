import {
    Component, OnInit, Input
} from '@angular/core';

import { Block } from '../../models/information';

@Component({
    selector: 'cm-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
    @Input() content: Block[];
    @Input() lang: string;

    constructor() { }

    ngOnInit() {

    }

}
