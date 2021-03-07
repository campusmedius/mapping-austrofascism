import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'cm-link-intern',
    templateUrl: './link-intern.component.html',
    styleUrls: ['./link-intern.component.scss']
})
export class LinkInternComponent implements OnInit {
    @Input() href: string;
    @Input() info = 'full';
    @Input() text = '';

    public fragment = '';

    constructor(private router: Router) { }

    ngOnInit() {
        if (this.href.indexOf('#')) {
            const split = this.href.split('#');
            this.href = split[0];
            this.fragment = split[1] || 'p:1';
        }

        if (this.href.startsWith('events')) {
            this.href = /topography/ + this.href;
        }
    }

    click(event) {
        event.preventDefault();
        (window as any).skipSectionChange = true;
        this.router.navigate([this.href], {
            queryParams: { 'info': this.info },
            queryParamsHandling: 'merge',
            fragment: this.fragment
        });
        setTimeout(() => {
            (window as any).skipSectionChange = false;
          }, 200);
    }

}
