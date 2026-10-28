import '@maplibre/maplibre-gl-leaflet'
import { map, maplibreGL } from 'leaflet'
import { getVersion, setWorkerUrl } from 'maplibre-gl'

import { projectionDefaults } from './constants'

// The build copies MapLibre's worker into the test folder, next to the ll folder
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

// Create the ll map
const llMap = map('map', {
  minZoom: 0,
  maxZoom: projConfig.maxZoom,
  center: [projConfigLatLong.center[1], projConfigLatLong.center[0]],
  zoom: projConfig.zoom,
  maxBounds: [[extent[1], extent[0]], [extent[3], extent[2]]],
  attributionControl: false
})

// MapLibre needs an absolute sprite URL, and the style files here have one relative to the site
const style = await (await fetch(stylefile)).json()
style.sprite = new URL(style.sprite, location.href).href

const gl = maplibreGL({
  transformRequest,
  style
}).addTo(llMap)
