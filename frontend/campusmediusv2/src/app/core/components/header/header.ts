import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Component({
    selector: 'cm-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
    host: { 'class': 'row header-row' }
})
export class HeaderComponent implements OnInit {
    @Input() lang: string;

    constructor(
        private router: Router
    ) { }

    ngOnInit() {
    }

    public changeLanguage(lang: string) {
        this.router.navigate([], { queryParams: { 'lang': lang }, queryParamsHandling: 'merge' });
    }
}
