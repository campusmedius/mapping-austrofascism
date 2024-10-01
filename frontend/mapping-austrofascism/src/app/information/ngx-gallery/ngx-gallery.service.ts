import {ElementRef, Injectable, Renderer2} from '@angular/core';
import * as Hammer from '@egjs/hammerjs';

@Injectable({
  providedIn: 'root'
})
export class NgxGalleryService {
  private swipeHandlers: Map<string, (() => void)[]> = new Map<string, (() => void)[]>();

  constructor(private renderer: Renderer2) {
  }

  manageSwipe(status: boolean, element: ElementRef, id: string, nextHandler: () => void, prevHandler: () => void): void {

    const handlers = this.getSwipeHandlers(id);

    // swipeleft and swiperight are available only if hammerjs is included
    try {
      if (status && !handlers) {
        const left = new Hammer.Manager(element.nativeElement);
        left.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
        left.on('swipeleft', () => nextHandler());
        const right = new Hammer.Manager(element.nativeElement);
        right.add(new Hammer.Swipe({ direction: Hammer.DIRECTION_HORIZONTAL }));
        left.on('swiperight', () => prevHandler());

        this.swipeHandlers.set(id, [
          <any>left,
          <any>right,
        ]);
      } else if (!status && handlers) {
        handlers.map((handler) => handler());
        this.removeSwipeHandlers(id);
      }
    } catch (e) {
    }
  }

  validateUrl(url: string): string {
    if (url.replace) {
      return url.replace(new RegExp(' ', 'g'), '%20')
        .replace(new RegExp('\'', 'g'), '%27');
    } else {
      return url;
    }
  }

  getBackgroundUrl(image: string) {
    return 'url(\'' + this.validateUrl(image) + '\')';
  }

  getFileType (fileSource: string): string {
    if (fileSource.startsWith('data:')) {
      return fileSource.substr(5, Math.min(fileSource.indexOf(';'), fileSource.indexOf('/')) - 5);
    }
    if (fileSource.startsWith('blob:')) {
      return 'image';
    }
    const fileExtension = fileSource.split('.').pop().toLowerCase();
    if (!fileExtension
      || fileExtension === 'jpeg' || fileExtension === 'jpg'
      || fileExtension === 'png' || fileExtension === 'bmp'
      || fileExtension === 'gif' || fileExtension === 'webp') {
      return 'image';
    }
    else if (fileExtension === 'avi' || fileExtension === 'flv'
      || fileExtension === 'wmv' || fileExtension === 'mov'
      || fileExtension === 'mp4') {
      return 'video';
    }
    return 'unknown';
}

  private getSwipeHandlers(id: string): (() => void)[] | undefined {
    return this.swipeHandlers.get(id);
  }

  private removeSwipeHandlers(id: string): void {
    this.swipeHandlers.delete(id);
  }
}
