import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'cm-start-page-selector',
  templateUrl: './start-page-selector.html',
  styleUrls: ['./start-page-selector.scss'],
  animations: [
      trigger('topologyBlur', [
          state('topography', style({ opacity: '0.5' })),
          state('topology', style( {opacity: '0' })),
          transition('* <=> *', animate('300ms ease-in'))
      ]),
      trigger('topographyBlur', [
        state('topography', style({ opacity: 0 })),
        state('topology', style( {opacity: 0.5 })),
        transition('* <=> *', animate('300ms ease-in'))
    ]),
    ]
})
export class StartPageSelectorComponent implements OnInit {

  private active: string;

  constructor() { }

  ngOnInit() {
  }

    activateHover(active) {
      this.active = active;
    }

}

