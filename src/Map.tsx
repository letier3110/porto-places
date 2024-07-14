import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { FC, useEffect } from 'react'
// import access token from .env file from vite environment variables

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string || ''

const Map: FC = () => {
  useEffect(() => {
    // create map once, then "fly" to new locations
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-8.6291, 41.1579], // Porto coordinates
      zoom: 13,
      pitch: 60,
      bearing: -60,
      dragRotate: false,
      touchZoomRotate: false
    })
    map.addLayer({
      id: '3d-buildings',
      source: 'composite',
      'source-layer': 'building',
      filter: ['==', 'extrude', 'true'],
      type: 'fill-extrusion',
      minzoom: 15,
      paint: {
        'fill-extrusion-color': '#aaa',
        'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
        'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
        'fill-extrusion-opacity': 0.6
      }
    })
  }, [])
  return <div id='map'></div>
}

export default Map
