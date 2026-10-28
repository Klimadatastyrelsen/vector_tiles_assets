import { Map, addProjection, getVersion, setWorkerUrl } from 'maplibre-gl'
import proj4 from 'proj4/dist/proj4'

import { projectionDefaults } from './constants'

// The build copies MapLibre's worker into the test folder, next to the ml folder
setWorkerUrl(new URL(`../maplibre-gl-worker.mjs?v=${getVersion()}`, import.meta.url).toString())

// get defaults from config
const mapElement = document.getElementById('map')
const projConfig = projectionDefaults[mapElement.dataset.projection]
const projConfigLatLong = projectionDefaults['4326']
const extent = projConfigLatLong.extent
const stylefile = mapElement.dataset.stylefile

// Custom transformRequest to add a header with a token
const transformRequest = (url, resourceType) => {
  const headers = {}
  if (resourceType === 'Tile' && config.API_TOKEN &&
    url.includes('api.dataforsyningen.dk') && !url.includes('token')) {
    headers.token = config.API_TOKEN
  }
  return {
    url,
    headers
  }
}

// MapLibre needs an absolute sprite URL, and the style files here have one relative to the site
const style = await (await fetch(stylefile)).json()
style.sprite = new URL(style.sprite, location.href).href

// Other projections than EPSG:3857 are registered with the tile grid the API serves:
// the top left corner of level 0 and its width, one 256 px tile at the first resolution.
if (projConfig.name !== 'EPSG:3857') {
  addProjection({
    name: projConfig.name,
    projection: proj4('EPSG:4326', projConfig.projection),
    tileMatrixSet: {
      origin: [projConfig.extent[0], projConfig.extent[3]],
      extentAtZoom0: 256 * projConfig.resolutions[0]
    }
  })
  style.projection = { type: projConfig.name }
}

// Create the ml map
const map = new Map({
  container: 'map',
  minZoom: 0,
  maxZoom: projConfig.maxZoom,
  style,
  maxBounds: [[extent[0], extent[1]], [extent[2], extent[3]]],
  center: projConfigLatLong.center,
  zoom: projConfig.zoom,
  attributionControl: false,
  transformRequest
})
