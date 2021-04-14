export interface SearchDocument {
    type: string;
    title: string;
    location: string;
    text: string;
}

export interface SearchResult {
    term: string;
    title: string;
    location: string;
    textDocuments: SearchDocument[];
    mediaDocuments: SearchDocument[];
}
