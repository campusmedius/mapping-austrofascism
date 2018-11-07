import {
    Component, OnInit, Input
} from '@angular/core';

import { Information } from '../../models/information';

@Component({
    selector: 'cm-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
    @Input() data: Information;
    @Input() lang: string;

    constructor() { }

    ngOnInit() { }

}
