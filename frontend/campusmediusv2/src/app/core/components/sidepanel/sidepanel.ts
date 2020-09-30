import { Component, OnInit, HostBinding, Input, EventEmitter, Output } from '@angular/core';
import { trigger, transition, animate, style, state } from '@angular/animations';


@Component({
  selector: 'cm-sidepanel',
  templateUrl: './sidepanel.html',
  styleUrls: ['./sidepanel.scss'],
  animations: [
      trigger('control', [
          state('full', style({ transform: 'scaleX(1)' })),
          state('short', style({ transform: 'scaleX(-1)' })),
          transition('full <=> short', animate('300ms ease-in'))
      ])
  ]
})
export class SidepanelComponent implements OnInit {

  @HostBinding('style.width') @Input() width: string = '450px';
  @Input() showControl = false;
  @Input() state: string;

  @Output() controlClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
