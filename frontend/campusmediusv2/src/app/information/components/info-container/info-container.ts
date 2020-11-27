import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges } from '@angular/core';
import { InformationMedia } from '../../models/information';

@Component({
  selector: 'cm-info-container',
  templateUrl: './info-container.html',
  styleUrls: ['./info-container.scss']
})
export class InfoContainerComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() hideSubTitle = false;
  @Input() abstract: string;
  @Input() lang: string;
  @Input() content: string;
  @Input() media: InformationMedia;
  @Input() state: string = 'short';
  @Input() readMoreText: string = 'START';
  @Input() hideReadMoreText = false;

  @Output() moreClick = new EventEmitter();
  @Output() citeClick = new EventEmitter();
  @Output() sectionChange = new EventEmitter<string>();

  private spiedElements;
  private parentElement;
  private currentSection: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    setTimeout(() => {
      this.parentElement = this.element.nativeElement.children[0];
      this.spiedElements = this.element.nativeElement.querySelectorAll('.info-content > div > cm-information > div > p');
      this.onScroll();
      this.sectionChange.emit(this.currentSection);
    }, 50);
  }

  public onScroll() {
      let currentSection: string;
      const scrollTop = this.parentElement.scrollTop;
      const parentOffset = this.parentElement.offsetTop;
      for (let i = 0; i < this.spiedElements.length; i++) {
          const element = this.spiedElements[i];
          if ((element.offsetTop - parentOffset) <= (scrollTop + 200)) {
              currentSection = element.id;
          }
      }
      if (currentSection !== this.currentSection) {
          this.currentSection = currentSection;
          this.sectionChange.emit(this.currentSection);
      }
  }

}
