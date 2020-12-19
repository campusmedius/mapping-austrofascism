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
    
        const start = firstPosition - 100;
        const end = firstPosition + 200;
        let shortText = text.substring(start, end);
    
        terms.forEach((t) => {
            let matches = shortText.match(new RegExp(t, 'ig'));
            matches = [...new Set(matches)]; // remove duplicates
            matches.forEach((m) => {
                shortText = shortText.replace(m, '<span class="highlight">' + m + '</span>');
            });
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
