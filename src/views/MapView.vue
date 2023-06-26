<script setup lang="ts">
import {
  LMap,
  LIcon,
  LGeoJson,
  LTileLayer,
  LControlLayers,
  LMarker,
  LPopup,
  LTooltip,
  LRectangle,
} from "@vue-leaflet/vue-leaflet"
import { LatLngBounds } from "leaflet"
import type { PointExpression, LatLngTuple } from "leaflet"
import type { FeatureCollection } from "geojson"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { ref, onMounted, onBeforeMount, computed } from "vue";
import "leaflet/dist/leaflet.css"
import axios from "axios"

const map = ref()
const zoom = ref(17)
const iconWidth = ref(25)
const iconHeight = ref(40)
const maxBounds = ref(new LatLngBounds([
  [-29.716500,-53.727300],
  [-29.721600,-53.732400],
]))
const iconUrl = computed(() => `https://placekitten.com/${iconWidth.value}/${iconHeight.value}`)
const iconSize = computed(():PointExpression => [iconWidth.value, iconHeight.value])

const log = (a: any) => console.log(a)

const tileProvider = ref([{
    url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a target="_blank" href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    visible: true,
    name: 'OpenStreetMap'
  },{
    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    maxZoom: 20,
    subdomains: ['mt0','mt1','mt2','mt3'],
    attribution: '&copy; <a target="_blank" href="https://maps.google.com">Google Maps</a',
    visible: false,
    name: 'Google Maps (satellite)'
}])

const goejson= ref<FeatureCollection>({
  type: "FeatureCollection",
  features: []
})

const markers = ref([])


onBeforeMount(async() => {
  const sheet_id = import.meta.env.VITE_SHEET_ID
  const api_key = import.meta.env.VITE_GOOGLE_API_KEY
  const res = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values:batchGet?ranges=Markers!A2:D100&valueRenderOption=FORMATTED_VALUE&key=${api_key}`)
  res.data.valueRanges[0].values.forEach((point) => {
    log(point)
    markers.value.push({
      latLng: [ point[0], point[1] ],
      iconUrl: point[2],
      text: point[3],
    })
  })
})

</script>

<template>
  <div class="h-screen w-100 bg-red">
    <l-map
        :center="[-29.718902,-53.729616]"
        :zoom="zoom" ref="map"
        :min-zoom="16"
        :max-bounds="[maxBounds.getSouthWest(), maxBounds.getNorthEast()]"
        @move="log('move')"
    >
      <l-control-layers />

      <l-tile-layer
          v-for="provider in tileProvider"
          :key="provider.key"
          :name="provider.name"
          :visible="provider.visible"
          :url="provider.url"
          :attribution="provider.attribution"
          :max-zoom="provider.maxZoom"
          :subdomains="provider.subdomains"
          layer-type="base"
      />
      <l-marker
          v-for="marker in markers"
          :lat-lng="marker.latLng">
        <l-icon :icon-url="marker.iconUrl" :icon-size="iconSize"/>
        <l-tooltip v-if="marker.text">{{ marker.text }}</l-tooltip>
      </l-marker>

<!--      <l-marker :lat-lng="[-29.718902,-53.729616]" draggable @moveend="log('moveend')">-->
<!--        <l-icon :icon-url="iconUrl" :icon-size="iconSize" />-->
<!--        <l-tooltip>-->
<!--          lol-->
<!--        </l-tooltip>-->
<!--      </l-marker>-->

<!--      <l-rectangle :bounds="[maxBounds.getSouthWest(), maxBounds.getNorthEast()]"/>-->
      <l-geo-json :geojson="goejson" />
    </l-map>
  </div>
</template>