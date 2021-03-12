import { Component, OnInit, Input } from '@angular/core';
import { Mediator } from '@app/topology/models/mediator';

@Component({
  selector: 'cm-start-selector-mobile',
  templateUrl: './start-selector-mobile.html',
  styleUrls: ['./start-selector-mobile.scss']
})
export class StartSelectorMobileComponent implements OnInit {

  @Input() mediators: Mediator[];
  @Input() lang: string;

  constructor() { }

  ngOnInit() {
  }
}
