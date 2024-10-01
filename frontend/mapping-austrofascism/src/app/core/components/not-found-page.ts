import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'cm-not-found-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    404: Not Found
  `,
    styles: [
        `
    :host {
      text-align: center;
    }
  `,
    ],
})
export class NotFoundPageComponent { }
