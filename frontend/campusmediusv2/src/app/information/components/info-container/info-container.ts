import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InformationMedia } from '../../models/information';

@Component({
  selector: 'cm-info-container',
  templateUrl: './info-container.html',
  styleUrls: ['./info-container.scss']
})
export class InfoContainerComponent implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() abstract: string;
  @Input() lang: string;
  @Input() content: string;
  @Input() media: InformationMedia;
  @Input() state: string = 'short';

  @Output() moreClick = new EventEmitter();
  @Output() citeClick = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

}
