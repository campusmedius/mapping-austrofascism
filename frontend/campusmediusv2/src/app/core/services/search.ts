import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { SearchDocument, SearchResult } from '../models/search';
import { Index } from 'lunr';

const SEARCH_ASSETS_PATH = environment.searchAssetsPath;

@Injectable()
export class SearchService {

    private searchDocumentsDictEn: { [ref: string]: SearchDocument } = {};
    private searchDocumentsDictDe: { [ref: string]: SearchDocument } = {};
    private searchIndexEn: Index;
    private searchIndexDe: Index;

    constructor(private http: HttpClient) { 
        this.http.get(SEARCH_ASSETS_PATH + "/index_en.json").subscribe((data) => {
            this.searchIndexEn = Index.load(data)
        });
        this.http.get(SEARCH_ASSETS_PATH + "/index_de.json").subscribe((data) => {
            this.searchIndexDe = Index.load(data)
        });
        this.http.get(SEARCH_ASSETS_PATH + "/documents_en.json").subscribe((data: SearchDocument[]) => {
            data.forEach((d) => {
                this.searchDocumentsDictEn[d.location] = d;
            });
        });
        this.http.get(SEARCH_ASSETS_PATH + "/documents_de.json").subscribe((data: SearchDocument[]) => {
            data.forEach((d) => {
                this.searchDocumentsDictDe[d.location] = d;
            });
        });
    }

    search(term: string, lang: string) {
        term = term.trim();
    
        const searchResults: SearchResult[] = [];
    
        if (!term || term === '') {
          return
        }
    
        const terms = term.split(' ');
        let enhancedTerm = '';
        terms.forEach((t) => {
          enhancedTerm += '*' + t + '* ';
          enhancedTerm += t + ' ';
        });
    
        let results;
        let searchDocumentsDict;
        if (lang === 'de') {
          enhancedTerm = enhancedTerm.replace(/ß/g, "*");
          results = this.searchIndexDe.search(enhancedTerm);
          searchDocumentsDict = this.searchDocumentsDictDe;
        } else {
          results = this.searchIndexEn.search(enhancedTerm);
          searchDocumentsDict = this.searchDocumentsDictEn;
        }
    
        const searchResultsPerTitle = {};
        for (let index = 0; index < results.length; index++) {
          const r = results[index];
          const doc = searchDocumentsDict[r.ref];
    
          if (!searchResultsPerTitle[doc.title]) {
            searchResultsPerTitle[doc.title] = {
              term: term,
              title: doc.title,
              location: doc.location.split('#')[0],
              textDocuments: [],
              mediaDocuments: [],
              hasResults: false
            }
            searchResults.push(searchResultsPerTitle[doc.title]);
          }
    
          if (doc.type === 'title') {
            searchResultsPerTitle[doc.title].hasResults = true;
            continue
          } else if (doc.type === 'keywords') {
            continue
          } else if (doc.type === 'page' || doc.type == 'mediator' || doc.type == 'event') {
            searchResultsPerTitle[doc.title].textDocuments.push(doc);
          } else if (doc.type === 'note') {
            searchResultsPerTitle[doc.title].textDocuments.push(doc);
          } else if (doc.type === 'image' || doc.type == 'video' || doc.type == 'audio') {
            searchResultsPerTitle[doc.title].mediaDocuments.push(doc);
          }
        };

        return searchResults;
    }
}
