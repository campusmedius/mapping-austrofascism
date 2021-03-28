import { Component, OnInit, Input, Output, EventEmitter, ElementRef, OnChanges, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { InformationMedia } from '../../models/information';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { InformationComponent } from '../information/information.component';
import { isPlatformServer } from '@angular/common';

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
  @Output() showTitleHeader = new EventEmitter<boolean>();

  @ViewChild(InformationComponent) information: InformationComponent;

  private spiedElements;
  private parentElement;
  private currentSection: string;
  private currentShowTitleHeader = false;

  constructor(
    private element: ElementRef,
    private scrollToService: ScrollToService,
    @Inject(PLATFORM_ID) private platformId,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    setTimeout(() => {
      this.parentElement = this.element.nativeElement.children[0];
      this.spiedElements = this.element.nativeElement.querySelectorAll('.info-content > div > cm-information > div > p');
      this.onScroll();
    }, 50);
  }

  public onScroll() {
      if (isPlatformServer(this.platformId)) {
        return;
      }

      if (!(window as any).skipSectionChange) {
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
              this.sectionChange.emit(currentSection);
          }

          this.emitTitleHeaderVisibility();
      }
  }

  public emitTitleHeaderVisibility() {
    let currentShowTitleHeader = false;
    if (this.parentElement && this.parentElement.scrollTop > 110) {
        currentShowTitleHeader = true;
    }
    if (currentShowTitleHeader !== this.currentShowTitleHeader) {
      this.currentShowTitleHeader = currentShowTitleHeader;
      this.showTitleHeader.emit(this.currentShowTitleHeader);
    }
  }

  public scrollToReference(ref: string, duration=0, offset=-100) {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    (window as any).skipSectionChange += 1;
    
    if (ref === 'top' || ref === 'p:1') {
        ref = '#info-top';
    }
    this.information.openComponentByRef(ref);
    this.scrollToService.scrollTo({
        target: ref,
        offset: offset,
        duration: duration
    });
    setTimeout(() => {
      this.emitTitleHeaderVisibility();
      (window as any).skipSectionChange -= 1;
      this.onScroll();
    }, (duration + 50));
  }

}
