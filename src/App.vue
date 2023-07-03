<script setup lang="ts">
import {fetchMarkers, fetchTrails} from "@/markers";
  import { onBeforeMount } from "vue";
  import { useStorage } from "@vueuse/core";
import type { Marker, Trail } from "!/env";

  const markers = useStorage<Marker[]>('markers', [])
  const trails = useStorage<Trail[]>('trails', [])

  const startFetchers = async () => {
    fetchTrails()
        .then((data) => {
            trails.value = data
        }, () => { console.warn("Could not fetch trails.") })

    fetchMarkers()
        .then((data) => {
          markers.value = data;
        }, () => { console.warn("Could not fetch markers.") })
        .finally(() => {
          // setTimeout(startFetchers, 1000 * 60 * 10)
        })
  }

  onBeforeMount(() => {
    console.log('beforemount')
    startFetchers()
  })

</script>


<template>
    <RouterView :markers="markers" :trails="trails" />
</template>
