<script setup lang="ts">

import {LIcon, LMarker, LPopup} from "@vue-leaflet/vue-leaflet";
import type { Marker } from "!/env";
import type {LeafletMouseEvent} from "leaflet";

const props = defineProps<{
  marker: Marker,
  spot: number|null
}>()

const emits = defineEmits<{
  'on-click': [event: LeafletMouseEvent, type: string, id: number],
}>()

const onMarkerMouseOver = (event: LeafletMouseEvent) => {
  event.target.openPopup()
}
const onMarkerMouseOut = (event: LeafletMouseEvent) => {
  event.target.closePopup()
}

</script>

<template>
  <l-marker
      :lat-lng="marker.latLng"
      @click="$emit('on-click', $event, 'point', marker.id)"
      @touch.stop.prevent.capture
      @mouseover="onMarkerMouseOver($event)"
      @mouseout="onMarkerMouseOut($event)"
  >
    <l-icon
        :icon-url="marker.icon"
        :icon-anchor="spot === marker.id ? [18,18] : [9,9]"
        :icon-size="spot === marker.id ? [36,36] : [18,18]"
    />
    <l-popup
        v-if="marker.text"
        :options="{
              closeButton: false,
              className:'d-none d-sm-block'
            }"
    >
      <div>
        <h2>{{ marker.name }}</h2>
        {{ marker.text }}
      </div>
    </l-popup>
  </l-marker>
</template>
