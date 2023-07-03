<script setup lang="ts">
import {
  LMap,
  LGeoJson,
  LTileLayer,
  LControlLayers,
  LControl,
  LControlZoom,
  LControlScale,
  LLayerGroup,
} from "@vue-leaflet/vue-leaflet"
import {LatLngBounds} from "leaflet"
import type { LeafletMouseEvent } from "leaflet"
import type { PointExpression } from "leaflet"
import type { FeatureCollection } from "geojson"
import MyMarker from '@/components/Marker.vue'
import MyTrail from '@/components/Trail.vue'
import {ref, computed} from "vue";
import {useRoute, useRouter} from "vue-router"
import "leaflet/dist/leaflet.css"
import type {Marker, TileProvider, Trail} from "!/env";

const map = ref()
const zoom = ref(17)
const iconWidth = ref(25)
const iconHeight = ref(40)
const maxBounds = ref(new LatLngBounds([
  [-29.715500,-53.726300],
  [-29.722600,-53.733400],
]))
const iconUrl = computed(() => `https://placekitten.com/${iconWidth.value}/${iconHeight.value}`)
const iconSize = computed(():PointExpression => [iconWidth.value, iconHeight.value])

const props = defineProps<{
  spot: number|null,
  type?: string|null,
  markers: Marker[],
  trails: Trail[],
}>()

const emits = defineEmits<{
  'nav-click': []
  'click-marker': [type:string, id: number]
}>()

const route = useRoute()
const router = useRouter()

const log = (a: any) => console.log(a)

const tileProvider = ref<TileProvider[]>([{
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

// const markers = useStorage<Marker[]>('markers', [])


const mapBuildings = computed<Marker[]>(() => {
  return props.markers.filter((marker) => marker.category === 'Edificações')
})
const mapCollections = computed<Marker[]>(() => {
  return props.markers.filter((marker) => marker.category === 'Coleções')
})
const mapLeisure = computed<Marker[]>(() => {
  return props.markers.filter((marker) => marker.category === 'Espaço de lazer')
})
const mapTrails = computed<Marker[]>(() => {
  return props.markers.filter((marker) => marker.category === 'Trilha')
})

const onMapClick = async (event: LeafletMouseEvent, type: string, id: number) => {
  // debugger
  console.log('markerClick', id, Number(route.params.id))
  const path = type === 'point' ? 'local' : 'trilha'
  if ((path === route.params.type) && (id === Number(route.params.id))) {
    emits('click-marker', type, id)
  } else {
    await router.push(`/${path}/${id}`)
  }
}

</script>

<template>
  <div class="h-screen w-100">
    <l-map
        :center="[-29.718902,-53.729616]"
        :zoom="zoom" ref="map"
        :min-zoom="16"
        :max-bounds="[maxBounds.getSouthWest(), maxBounds.getNorthEast()]"
        :options="{zoomControl: false}"
    >
      <l-control position="topleft">

      <v-app-bar-nav-icon
          variant="elevated"
          @click.stop="$emit('nav-click')"
          class="text-green-darken-3"
      />
      </l-control>
      <l-control-layers
          :collapsed="false"
      />

      <l-control-scale :metric="true" :imperial="false" position="topright" />

      <l-tile-layer
          v-for="provider in tileProvider"
          :name="provider.name"
          :visible="provider.visible"
          :url="provider.url"
          :attribution="provider.attribution"
          :max-zoom="provider.maxZoom"
          :subdomains="provider.subdomains"
          layer-type="base"
      />

      <l-layer-group
          layer-type="overlay"
          name="Edificações"
      >
        <MyMarker
            v-for="marker in mapBuildings"
            :spot="type === 'point' ? spot : null"
            :marker="marker"
            @on-click="(event, type, id) => onMapClick(event, type, id)"
        />
      </l-layer-group>

      <l-layer-group
          layer-type="overlay"
          name="Coleções"
      >
        <MyMarker
            v-for="marker in mapCollections"
            :spot="type === 'point' ? spot : null"
            :marker="marker"
            @on-click="(event, type, id) => onMapClick(event, type, id)"
        />
      </l-layer-group>

      <l-layer-group
          layer-type="overlay"
          name="Espaços de lazer"
      >
        <MyMarker
            v-for="marker in mapLeisure"
            :spot="type === 'point' ? spot : null"
            :marker="marker"
            @on-click="(event, type, id) => onMapClick(event, type, id)"
        />
      </l-layer-group>

      <l-layer-group
          layer-type="overlay"
          name="Trilhas"
      >
<!--        <MyMarker-->
<!--            v-for="marker in mapTrails"-->
<!--            :spot="spot"-->
<!--            :marker="marker"-->
<!--            @on-click="(event, id) => onMarkerClick(event, id)"-->
<!--        />-->
        <MyTrail
            v-for="trail in trails"
            :spot="type === 'trail' ? spot : null"
            :trail="trail"
            @on-click="(event, type, id) => onMapClick(event, type, id)"
        />
      </l-layer-group>

<!--      <l-marker :lat-lng="[-29.718902,-53.729616]" draggable @moveend="log('moveend')">-->
<!--        <l-icon :icon-url="iconUrl" :icon-size="iconSize" />-->
<!--        <l-tooltip>-->
<!--          lol-->
<!--        </l-tooltip>-->
<!--      </l-marker>-->

<!--      <l-rectangle :bounds="[maxBounds.getSouthWest(), maxBounds.getNorthEast()]"/>-->
      <l-geo-json :geojson="goejson" />
      <l-control-zoom position="bottomright" ></l-control-zoom>
    </l-map>
  </div>
</template>
