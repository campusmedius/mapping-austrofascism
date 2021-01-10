import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { SearchComponent } from '../search/search';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'cm-header',
    templateUrl: './header.html',
    styleUrls: ['./header.scss'],
    host: { 'class': 'row header-row' }
})
export class HeaderComponent implements OnInit {
    @Input() lang: string;

    constructor(
        private router: Router,
        private dialog: MatDialog,
    ) { }

    ngOnInit() {
    }

    public changeLanguage(lang: string) {
        this.router.navigate([], { queryParams: { 'lang': lang }, queryParamsHandling: 'merge' });
    }

    showSearch() {
        const dialogRef = this.dialog.open(SearchComponent, {
            width: '800px',
            maxHeight: '90vh',
            autoFocus: false
        });
    }
}
