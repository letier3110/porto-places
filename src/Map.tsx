import mapboxgl from 'mapbox-gl'
import { FC, useEffect, useRef, useState } from 'react'
import ErrorBoundary from './ErrorBoundary'
import CardsData from '../public/data.json'
import { DataEntry } from './interfaces'

const data = CardsData as { data: Array<DataEntry> }
const cardsData = data.data
// import access token from .env file from vite environment variables

mapboxgl.accessToken = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string) || ''

const MapWrapper = () => {
  return (
    <div className='map-wrapper'>
      <ErrorBoundary fallback={'Cant Load Maps'}>
        <Map />
      </ErrorBoundary>
    </div>
  )
}

const poiData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Clérigos Tower',
        color: '#FF5733'
      },
      geometry: {
        type: 'Point',
        coordinates: [-8.6143, 41.1457]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'Porto Cathedral',
        color: '#33FF57'
      },
      geometry: {
        type: 'Point',
        coordinates: [-8.6111, 41.143]
      }
    },
    {
      type: 'Feature',
      properties: {
        name: 'São Bento Railway Station',
        color: '#3357FF'
      },
      geometry: {
        type: 'Point',
        coordinates: [-8.6107, 41.1456]
      }
    }
  ].concat(cardsData.map((card) => ({
    type: 'Feature',
    properties: {
      name: card.name,
      color: '#FF5733'
    },
    geometry: {
      type: 'Point',
      coordinates: [card.coordinates.longitude, card.coordinates.latitude]
    }
  })))
}

const Map: FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [lat, ] = useState(41.1579)
  const [lng, ] = useState(-8.6291)
  const [zoom, ] = useState(13)
  useEffect(() => {
    if (map.current) return // initialize map only once
    // create map once, then "fly" to new locations
    map.current = new mapboxgl.Map({
      container: mapContainer.current as never, // container ID
      style: 'mapbox://styles/mapbox/light-v10',
      // center: [-8.6291, 41.1579], // Porto coordinates
      // zoom: 13,
      center: [lng, lat],
      zoom: zoom,
      pitch: 60,
      bearing: -60,
      dragRotate: false,
      touchZoomRotate: false
    })
    if (map.current) {
      map.current.on('load', () => {
        if (!map.current) return
        map.current.addSource('poi-source', {
          type: 'geojson',
          data: poiData
        })

        map.current.addLayer({
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
        map.current.addLayer({
          id: 'poi-layer',
          source: 'poi-source',
          type: 'circle',
          // type: 'fill-extrusion',
          // paint: {
          //   'fill-extrusion-color': ['get', 'color'],
          //   'fill-extrusion-height': ['get', 'height'],
          //   'fill-extrusion-base': 0,
          //   'fill-extrusion-opacity': 0.8
          // }
        })

        let hoveredStateId: number | null = null

        map.current.on('mousemove', '3d-buildings', (e) => {
          if (!map.current) return
          if (e.features.length > 0) {
            if (hoveredStateId !== null) {
              map.current.setFeatureState(
                { source: 'composite', sourceLayer: 'building', id: hoveredStateId },
                { hover: false }
              )
            }
            hoveredStateId = e.features[0].id
            map.current.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: hoveredStateId || 0 },
              { hover: true }
            )
          }
        })

        map.current.on('mouseleave', '3d-buildings', () => {
          if (!map.current) return
          if (hoveredStateId !== null) {
            map.current.setFeatureState(
              { source: 'composite', sourceLayer: 'building', id: hoveredStateId },
              { hover: false }
            )
          }
          hoveredStateId = null
        })

        // Add click event for POIs
        map.current.on('click', 'poi-layer', (e) => {
          if (!map.current) return
          const coordinates = e.features[0].geometry.coordinates.slice()
          const name = e.features[0].properties.name

          new mapboxgl.Popup().setLngLat(coordinates).setHTML(`<h3>${name}</h3>`).addTo(map.current)
        })

        // Change cursor on POI hover
        map.current.on('mouseenter', 'poi-layer', () => {
          if (!map.current) return
          map.current.getCanvas().style.cursor = 'pointer'
        })
        map.current.on('mouseleave', 'poi-layer', () => {
          if (!map.current) return
          map.current.getCanvas().style.cursor = ''
        })
      })
    }
  })
  return <div ref={mapContainer} id='map' style={{ width: '100%', height: '100%' }}></div>
}

export default MapWrapper
