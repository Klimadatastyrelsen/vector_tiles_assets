# API
URL til API'et i projektion ETR89 / UTM zone 32N (EPSG:25832)
`https://api.dataforsyningen.dk/rest/skaermkort_vector_tiles/v1.0/EPSG:25832/EPSG:25832:{z}/{y}/{x}?f=application/vnd.mapbox-vector-tile`

URL til API'et i projektion WGS84 /Psedu-Mercator (EPSG:3857)
`https://api.dataforsyningen.dk/rest/skaermkort_vector_tiles/v1.0/EPSG:3857/EPSG:3857:{z}/{y}/{x}?f=application/vnd.mapbox-vector-tile`

Husk at tilføje en token, enten som header eller URL parameter. Læs mere om tokens til din dataforsyningen bruger [her](https://confluence.sdfi.dk/display/MYD/Log+ind+og+Token).
Z, angiver zoom niveauet (0-16 i EPSG:25832 og 0-20 i EPSG:3857).

Bemærk at API'et ikke er implementeret som OGC API-Tiles standarden, men minder om den.

### API'et i webaplikationer

Som webapplikation fungerer API'et både for EPSG:25832 og EPSG:3857 i OpenLayers med `ol-mapbox-style` og i MapLibre GL JS fra version 6.15.
I Leaflet fungerer API'et med EPSG:3857 via `@maplibre/maplibre-gl-leaflet`. For at læse mere om frontend implementering se da Github repository [vector_tiles_frontend](https://github.com/Klimadatastyrelsen/vector_tiles_frontend).

#### EPSG:25832 i MapLibre GL JS

I MapLibre GL JS registreres projektionen med `addProjection` og API'ets tile-gitter, hvorefter stylefilen bruges med projektionen sat til `EPSG:25832`. Koordinater som `center` angives stadig i længde- og breddegrad, og zoomniveauerne følger API'ets gitter: zoom 7 i EPSG:25832 viser omtrent det samme som zoom 12 i EPSG:3857.

```html
<!doctype html>
<html lang="da">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@6.16.0/dist/maplibre-gl.css" />
    <script src="https://unpkg.com/proj4@2.22.0/dist/proj4.js"></script>
    <style>
      body { margin: 0; }
      #map { height: 100vh; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script type="module">
      import * as maplibregl from 'https://unpkg.com/maplibre-gl@6.16.0/dist/maplibre-gl.mjs';

      const token = 'DIN_TOKEN';

      // EPSG:25832 med API'ets tile-gitter: øverste venstre hjørne af niveau 0
      // og dets bredde, én tile på 256 px med 3276,8 m pr. pixel.
      maplibregl.addProjection({
        name: 'EPSG:25832',
        projection: proj4('EPSG:4326', '+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs'),
        tileMatrixSet: { origin: [139000, 6500000], extentAtZoom0: 838860.8 },
      });

      const style = await (await fetch('https://cdn.dataforsyningen.dk/assets/vector_tiles_assets/latest/styles/official/skaermkort_klassisk.json')).json();
      style.projection = { type: 'EPSG:25832' };

      const map = new maplibregl.Map({
        container: 'map',
        style,
        center: [10.2, 56.15],
        zoom: 7,
        // Tokenet sendes som header til API'et
        transformRequest: (url) =>
          url.startsWith('https://api.dataforsyningen.dk') ? { url, headers: { token } } : { url },
      });
    </script>
  </body>
</html>
```

### API'et i GIS-klienter
Det er forskelligt om GIS-klienterne indlæser Vector Tiles servicen via API, eller direkte igennem style filerne.
QGIS indlæser via API, mens Arc Gis pro, indlæser via style fil. Se mere om hvordan du kan tilgå vector tiles i GIS klienterne under [tutorials/gis_vejledning](https://github.com/Klimadatastyrelsen/vector_tiles_assets/blob/main/docs/tutorials/gis_vejledning.md).
