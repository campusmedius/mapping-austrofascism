import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cm-start-page-selector',
  templateUrl: './start-page-selector.html',
  styleUrls: ['./start-page-selector.scss']
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
