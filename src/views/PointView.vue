<script setup lang="ts">
import type {Marker, Trail, Visit} from "!/env";
import {assert, useStorage} from "@vueuse/core";
import {computed} from "vue";

const props = defineProps<{
  marker?: Marker
  trail?: Trail
  type: string|null
  spot: number|null
}>()

const visits = useStorage<Visit[]>('visits', [])

const getCurrentVisit = (): Visit|undefined => {
  return visits.value.find((visit) => {
    return visit.type === getCurrentEntryType() && (
        visit.id === getCurrentEntryId()
    )
  })
}

const getCurrentEntryId = (): number => {
  return (props.type === 'point'
      ? (props.marker ? props.marker.id : 0)
      : (props.trail ? props.trail.id : 0)
  )
}

const getCurrentEntryType = (): string => {
  return props.type || ''
}

const youtubeId = computed<string|undefined>(() => {
  const matchArray = props.marker?.detail?.trim()?.match(
      /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
  )
  return matchArray ? matchArray[1] : undefined;
})

const visit = computed<boolean>({
  get () {
    return getCurrentVisit()?.visited || false
  },
  set (value) {
    const existingVisit = getCurrentVisit()
    if (existingVisit) {
      existingVisit.visited = value
    } else {
      assert(props.type !== null)
      visits.value.push({
        id: getCurrentEntryId(),
        type: getCurrentEntryType(),
        visited: value
      })
    }
  }
})

</script>

<template>

  <div v-if="spot">
    <v-card v-if="marker" border="none" elevation="0">
      <div v-if="youtubeId" style="height: 200px">
        <iframe
            width="100%"
            height="100%"
            :src="`https://www.youtube.com/embed/${youtubeId}`"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
      </div>
      <v-img
          v-else-if="marker.detail?.trim()?.match(/\.(png|jpe?g|gif|webp)$/i) || false"
          class="align-end text-white"
          height="200"
          :src="marker.detail.trim()"
          :cover="true"
        >
      </v-img>

      <v-card-title
          class="d-block text-wrap"
      >
        {{ marker.name }}
      </v-card-title>

      <v-card-text>
        {{ marker.text }}
      </v-card-text>
      <v-card-actions>
        <v-checkbox
            v-model="visit"
            color="green-darken-3"
        >
          <template v-slot:label>
            <span class="text-black font-weight-bold text-uppercase">Visitado</span>
          </template>
        </v-checkbox>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="trail" border="none" elevation="0">
      <v-card-title
          class="d-block text-wrap"
      >
        {{ trail.name }}
      </v-card-title>

      <v-card-text>
        {{ trail.desc }}
      </v-card-text>
      <v-card-actions>
        <v-checkbox
            v-model="visit"
            color="green-darken-3"
        >
          <template v-slot:label>
            <span class="text-black font-weight-bold text-uppercase">Visitado</span>
          </template>
        </v-checkbox>
      </v-card-actions>
    </v-card>
  </div>
  <div v-else>
    <v-card border="none" elevation="0">
      <v-card-title>Bem-vindo</v-card-title>
      <v-card-text>
        Explore o mapa para descobrir o que temos esperando você no nosso jardim.
      </v-card-text>
    </v-card>
  </div>
</template>
