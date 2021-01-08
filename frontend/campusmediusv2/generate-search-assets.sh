#!/usr/bin/env bash

curl http://localhost:8000/main/search-documents/de?format=json | node helper/build-search-index.js de > src/assets/search/index_de.json
curl http://localhost:8000/main/search-documents/en?format=json | node helper/build-search-index.js en > src/assets/search/index_en.json
curl http://localhost:8000/main/search-documents/de?format=json -o src/assets/search/documents_de.json
curl http://localhost:8000/main/search-documents/en?format=json -o src/assets/search/documents_en.json
