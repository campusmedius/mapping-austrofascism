import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { InformationMedia } from '../../models/information';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { InformationComponent } from '../information/information.component';
import { trigger, transition, animate, style, state } from '@angular/animations';

@Component({
  selector: 'cm-info-container-mobile',
  templateUrl: './info-container-mobile.html',
  styleUrls: ['./info-container-mobile.scss'],
  animations: [
    trigger('titleHeader', [
        state('false', style({ opacity: 0 })),
        state('true', style({ opacity: 1 })),
        transition('false <=> true', animate('300ms ease-in'))
    ])
  ]
})
export class InfoContainerMobileComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() hideSubTitle = false;
  @Input() lang: string;
  @Input() content: string;
  @Input() media: InformationMedia;
  @Input() showHeader: boolean;

  @Output() citeClick = new EventEmitter();
  @Output() showShort = new EventEmitter();
  @Output() sectionChange = new EventEmitter();
  @Output() galleryClosed = new EventEmitter();
  @Output() galleryOpened = new EventEmitter();

  @ViewChild(InformationComponent) information: InformationComponent;

  private spiedElements;
  private parentElement;
  private currentSection: string;
  private skipSectionChange = false;
  public galleryIsOpen = false;

  constructor(
    private element: ElementRef,
    private scrollToService: ScrollToService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    setTimeout(() => {
      this.parentElement = this.element.nativeElement.children[0];
      this.spiedElements = this.element.nativeElement.querySelectorAll('.info-content > div > cm-information > div > p');
    }, 50);
  }

  public checkCurrentSection(scrollTop) {
    if (!(window as any).skipSectionChange && this.spiedElements) {
      let currentSection: string;
      for (let i = 0; i < this.spiedElements.length; i++) {
        const element = this.spiedElements[i];
        if ((element.offsetTop - scrollTop) <= 200) {
            currentSection = element.id;
        }
      }
      if (currentSection !== this.currentSection) {
          this.currentSection = currentSection;
          this.sectionChange.emit(this.currentSection);
      }
    }
  }

  public scrollToReference(ref: string, duration=0, offset=-45) {
    (window as any).skipSectionChange = true;

    if (ref === 'top' || ref === 'p:1') {
        ref = '#info-top';
    }
    setTimeout(() => {
      this.information.openComponentByRef(ref);
      this.scrollToService.scrollTo({
          target: ref,
          offset: offset,
          duration: duration
      });
      setTimeout(() => {
        (window as any).skipSectionChange = false;
      }, duration);
    }, 0);
  }

  public triggerGalleryClosed($event) {
    this.galleryIsOpen = false;
    this.galleryClosed.emit($event);

  }

  public triggerGalleryOpened($event) {
      this.galleryIsOpen = true;
      this.galleryOpened.emit($event);
  }

}
