import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'searchresulttext'
})

export class SearchResultTextPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {

    }

    transform(text: string, term: string): any {
        const terms = term.toLowerCase().split(' ');
        let firstPosition = 9999999;
        terms.forEach((t) => {
          const postion = text.toLowerCase().indexOf(t);
          if(postion < firstPosition) {
            firstPosition = postion;
          }
        });
    
        const start = firstPosition - 60;
        const end = firstPosition + 120;
        let shortText = text.substring(start, end);
    
        terms.forEach((t) => {
            shortText = shortText.replace(new RegExp('(' + t + ')', 'ig'), '<span class="highlight">$1</span>');
        });

        if (start > 0) {
            shortText = '[...] ' + shortText;
        }
        if (end < text.length) {
            shortText = shortText + ' [...]';
        }
    
        return this.sanitizer.bypassSecurityTrustHtml(shortText)
    }
}
