# API
URL til API'et i projektion ETR89 / UTM zone 32N (EPSG:25832)
`https://api.dataforsyningen.dk/rest/skaermkort_vector_tiles/v1.0/EPSG:25832/EPSG:25832:{z}/{y}/{x}?f=application/vnd.mapbox-vector-tile`

URL til API'et i projektion WGS84 /Psedu-Mercator (EPSG:3857)
`https://api.dataforsyningen.dk/rest/skaermkort_vector_tiles/v1.0/EPSG:3857/EPSG:3857:{z}/{y}/{x}?f=application/vnd.mapbox-vector-tile`

Husk at tilføje en token, enten som header eller URL parameter. Læs mere om tokens til din dataforsyningen bruger [her](https://confluence.sdfi.dk/display/MYD/Log+ind+og+Token).
Z, angiver zoom niveauet (0-16 i EPSG:25832 og 0-20 i EPSG:3857).

Bemærk at API'et ikke er implementeret som OGC API-Tiles standarden, men minder om den.

### API'et i webaplikationer

Som webapplikation fungerer API'et både for EPSG:25832 og EPSG:3857 i Openlayers, med `ol-mapbox-style`.
Derudover fungerer API'et med EPSG:3857 i Leaflet og MapLibre ligeledes `ol-mapbox-style`. For at læse mere om frontend implementering se da Github repository [vector_tiles_frontend](https://github.com/Klimadatastyrelsen/vector_tiles_frontend).

### API'et i GIS-klienter
Det er forskelligt om GIS-klienterne indlæser Vector Tiles servicen via API, eller direkte igennem style filerne.
QGIS indlæser via API, mens Arc Gis pro, indlæser via style fil. Se mere om hvordan du kan tilgå vector tiles i GIS klienterne under [tutorials/gis_vejledning](https://github.com/Klimadatastyrelsen/vector_tiles_assets/blob/main/docs/tutorials/gis_vejledning.md).
