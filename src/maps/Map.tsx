import mapboxgl from 'mapbox-gl'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import ErrorBoundary from '../app/ErrorBoundary'
import { DataEntry } from '../lib/interfaces'
import './mapbox.css'
import MiniCard from './MiniCard'

mapboxgl.accessToken = (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string) || ''

interface MapProps {
  data: Array<DataEntry>
}

const MapWrapper: FC<MapProps> = ({ data }) => {
  return (
    <div className='map-wrapper'>
      <ErrorBoundary fallback={'Cant Load Maps'}>
        <Map data={data} />
      </ErrorBoundary>
    </div>
  )
}

interface MapFeature {
  type: string;
  properties: Record<string, string | number | object>;
  geometry: {
    type: string;
    coordinates: [number, number];
  }
}

const initialPoiData = {
  type: 'FeatureCollection',
  features: [
    // {
    //   type: 'Feature',
    //   properties: {
    //     name: 'Clérigos Tower',
    //     color: '#AC9733'
    //   },
    //   geometry: {
    //     type: 'Point',
    //     coordinates: [-8.6143, 41.1457]
    //   }
    // },
    // {
    //   type: 'Feature',
    //   properties: {
    //     name: 'Porto Cathedral',
    //     color: '#33FF57'
    //   },
    //   geometry: {
    //     type: 'Point',
    //     coordinates: [-8.6111, 41.143]
    //   }
    // },
    // {
    //   type: 'Feature',
    //   properties: {
    //     name: 'São Bento Railway Station',
    //     color: '#3357FF'
    //   },
    //   geometry: {
    //     type: 'Point',
    //     coordinates: [-8.6107, 41.1456]
    //   }
    // }
  ] as Array<MapFeature>
}

const Map: FC<MapProps> = ({ data }) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const prevData = useRef<Array<DataEntry>>([])
  const [lat] = useState(41.1579)
  const [lng] = useState(-8.6291)
  const [zoom] = useState(13)

  const [mode, setMode] = useState<string>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  )

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      const colorScheme = event.matches ? 'dark' : 'light'
      console.log(colorScheme) // "dark" or "light"
      setMode(colorScheme)
    })
  }, [])

  const poiData = useMemo(() => {
    return {
      ...initialPoiData,
      features: initialPoiData.features.concat(
        data.map<MapFeature>((card) => ({
          type: 'Feature',
          properties: {
            ...card,
            name: card.name,
            color: '#646cff'
          },
          geometry: {
            type: 'Point',
            coordinates: [card.coordinates.longitude, card.coordinates.latitude]
          }
        }))
      )
    }
  }, [data])
  useEffect(() => {
    if (map.current) {
      // if map loaded && data changed
      if (prevData.current.every((card, index) => card === data[index]) && prevData.current.length === data.length) {
        return
      }
      if (map.current.getSource('poi-source') && map.current.getLayer('poi-layer')) {
        prevData.current = data
        map.current.removeLayer('poi-layer')
        map.current.removeSource('poi-source')
        map.current.addSource('poi-source', {
          type: 'geojson',
          data: poiData
        })
        map.current.addLayer({
          id: 'poi-layer',
          source: 'poi-source',
          type: 'circle',
          paint: {
            'circle-radius': 6,
            'circle-color': ['get', 'color']
          }

          // type: 'fill-extrusion',
          // paint: {
          //   'fill-extrusion-color': ['get', 'color'],
          //   'fill-extrusion-height': ['get', 'height'],
          //   'fill-extrusion-base': 0,
          //   'fill-extrusion-opacity': 0.8
          // }
        })
        return
      }
      return
    } // initialize map only once
    // create map once, then "fly" to new locations
    map.current = new mapboxgl.Map({
      container: mapContainer.current as never, // container ID
      // traffic v12
      style: `mapbox://styles/mapbox/${mode}-v11`, // style URL
      // center: [-8.6291, 41.1579], // Porto coordinates
      // zoom: 13,
      center: [lng, lat],
      zoom: zoom,
      // pitch: 60,
      // bearing: -60,
      dragRotate: false,
      touchZoomRotate: false
    })
    if (map.current) {
      map.current.on('load', () => {
        if (!map.current) return
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
          if(!map.current) return;
          const colorScheme = event.matches ? 'dark' : 'light'
          map.current.setStyle(`mapbox://styles/mapbox/${colorScheme}-v11`)
        })
        map.current.addControl(new mapboxgl.NavigationControl())
        map.current.addControl(new mapboxgl.FullscreenControl())
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          })
        )
        prevData.current = data
        map.current.addSource('poi-source', {
          type: 'geojson',
          data: poiData
        })

        // map.current.addLayer({
        //   id: '3d-buildings',
        //   source: 'composite',
        //   'source-layer': 'building',
        //   filter: ['==', 'extrude', 'true'],
        //   type: 'fill-extrusion',
        //   minzoom: 15,
        //   paint: {
        //     'fill-extrusion-color': '#aaa',
        //     'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
        //     'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
        //     'fill-extrusion-opacity': 0.6
        //   }
        // })
        map.current.addLayer({
          id: 'poi-layer',
          source: 'poi-source',
          type: 'circle',
          paint: {
            'circle-radius': 6,
            'circle-color': ['get', 'color']
          }

          // type: 'fill-extrusion',
          // paint: {
          //   'fill-extrusion-color': ['get', 'color'],
          //   'fill-extrusion-height': ['get', 'height'],
          //   'fill-extrusion-base': 0,
          //   'fill-extrusion-opacity': 0.8
          // }
        })

        // const hoveredStateId: number | null = null

        // map.current.on('mousemove', 'poi-layer', (e) => {
        //   if (!map.current) return
        //   if (e.features.length > 0) {
        //     if (hoveredStateId !== null) {
        //       map.current.setFeatureState(
        //         { source: 'poi-source', id: hoveredStateId },
        //         { hover: false }
        //       )
        //     }
        //     hoveredStateId = e.features[0].id
        //     map.current.setFeatureState(
        //       { source: 'poi-source', id: hoveredStateId || 0 },
        //       { hover: true }
        //     )
        //   }
        // })

        // map.current.on('mouseleave', 'poi-layer', () => {
        //   if (!map.current) return
        //   if (hoveredStateId !== null) {
        //     map.current.setFeatureState(
        //       { source: 'poi-source', id: hoveredStateId },
        //       { hover: false }
        //     )
        //   }
        //   hoveredStateId = null
        // })

        // Add click event for POIs
        map.current.on('click', 'poi-layer', (e) => {
          if (!map.current) return
          const coordinates = e.features[0].geometry.coordinates.slice()
          const plainProperties = e.features[0].properties

          // TODO: get from Minicard
          const component = MiniCard({
            cardData: {
              name: plainProperties.name,
              mediaUrl: JSON.parse(plainProperties.mediaUrl),
              tags: JSON.parse(plainProperties.tags),
              medianRating: plainProperties.medianRating,
              numberOfRatings: plainProperties.numberOfRatings,
              address: plainProperties.address,
              menu: JSON.parse(plainProperties.menu),
              hours: JSON.parse(plainProperties.menu),
              reviews: JSON.parse(plainProperties.reviews),
              gmaps: plainProperties.gmaps,
              coordinates: {
                latitude: coordinates[1],
                longitude: coordinates[0]
              }
            }
          })
          const template = renderToString(component)

          if (!template) return

          new mapboxgl.Popup({
            className: 'poi-popup'
          })
            .setLngLat(coordinates)
            .setHTML(template)
            .addTo(map.current)
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
  }, [poiData])

  return <div ref={mapContainer} id='map' style={{ width: '100%', height: '100%' }}></div>
}

export default MapWrapper
