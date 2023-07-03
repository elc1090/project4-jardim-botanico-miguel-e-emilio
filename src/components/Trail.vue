<script setup lang="ts">

import {LPolyline, LPopup} from "@vue-leaflet/vue-leaflet";
import type { Trail } from "!/env";
import type {LeafletMouseEvent} from "leaflet";

const props = defineProps<{
  trail: Trail,
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
  <l-polyline
      :lat-lngs="trail.points"
      :color="`green`"
      :weight="spot === trail.id ? 6 : 3"
      @click="$emit('on-click', $event, 'trail', trail.id)"
      @touch.stop.prevent.capture
      @mouseover="onMarkerMouseOver($event)"
      @mouseout="onMarkerMouseOut($event)"
  >
    <l-popup
        :options="{
              closeButton: false,
              className:'d-none d-sm-block'
            }"
    >
      <div>
        <h2>{{ trail.name }}</h2>
        {{ trail.desc }}
      </div>
    </l-popup>
  </l-polyline>
</template>
