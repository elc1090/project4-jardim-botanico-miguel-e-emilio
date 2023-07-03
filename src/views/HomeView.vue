<script setup lang="ts">
import {useRoute, useRouter} from 'vue-router'
import logo from "@/assets/logo.svg"
import {computed, onBeforeMount, ref, watch} from "vue";
import MapView from "@/views/MapView.vue";
import PointView from "@/views/PointView.vue";
import type {Marker, Trail} from "!/env";

const route = useRoute()
const router = useRouter()
const drawer = ref<boolean>(false)
const spot = ref<number|null>(null)

console.log('setup')

const props = defineProps<{
  markers: Marker[],
  trails: Trail[],
}>()

const type = ref<string|null>(null)

// onBeforeRouteUpdate(async (to) => {
//   spot.value = Number(to.params.id)
//   console.log(`bru ${to.params.id} ${spot.value}`)
// })

watch(
    () => [route.params.type, route.params.id],
    ([newType, newId], [oldType, oldId]) => {
      console.log(`newType ${oldType} -> ${newType}`)
      console.log(`newId ${oldId} -> ${newId}`)
      setTimeout( () => {
        type.value = newType === 'local' ? 'point' : 'trail';
        spot.value = Number(newId);
        drawer.value = true
      }, 1)
    }
)

const marker = computed<Marker|undefined>(() => {
  return type.value === 'point' ? props.markers.find((marker) => marker.id === spot.value) : undefined
})

const trail = computed<Trail|undefined>(() => {
  return type.value === 'trail' ? props.trails.find((trail) => trail.id === spot.value) : undefined
})

const onMapClick = (newType: string, newId: number) => {
  console.log('on-map-click at HOME')
  type.value = newType;
  spot.value = newId;
  drawer.value = true;
}

onBeforeMount(async () => {
  console.log('beforeMount')
  await router.isReady()
  type.value = route.params.type === 'local' ? 'point' : 'trail'
  drawer.value = !!route.params.id
  spot.value = Number(route.params.id)
  console.log(!!route.params.id, drawer.value)
})

</script>

<template>
  <v-layout class="rounded rounded-md">

    <v-navigation-drawer
        v-model="drawer"
        :temporary="true"
        width="300"
        @update:model-value="spot = null"
    >
      <!--      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->
      <!--      <HelloWorld msg="You did it!" />-->
      <v-list-item
          :prepend-avatar="logo"
          :nav="true"
          title="Jardim Botânico / UFSM"
      >
        <template v-slot:append>
          <v-btn variant="text" icon="mdi:mdi-chevron-left" @click.stop="drawer = !drawer; spot = null"></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <PointView
          :trail="trail"
          :marker="marker"
          :type="type"
          :spot="spot"
      />
    </v-navigation-drawer>
    <v-main class="d-flex align-center justify-center">
      <MapView
          :spot="spot"
          :type="type"
          :markers="markers"
          :trails="trails"
          @click-marker="(type, id) => onMapClick(type, id)"
          @nav-click="drawer = !drawer"
      />
    </v-main>
  </v-layout>
  <!--  <header>-->
  <!--    <div class="wrapper">-->
  <!--      <HelloWorld msg="You did it!" />-->

  <!--&lt;!&ndash;      <div class="d-flex justify-space-around">&ndash;&gt;-->
  <!--&lt;!&ndash;        a<v-icon>$vuetify</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        b<v-icon>fa:fas fa-user-plus</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        c0<v-icon>mdi:mdi-widgets</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        c1<v-icon>mdi:mdi-hiking</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;&lt;!&ndash;        ci<i class="material-icons-outlined">energy_savings_leaf</i>&ndash;&gt;&ndash;&gt;-->
  <!--&lt;!&ndash;        c?<v-icon class="material-icons-outlined">md:eco</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        c2<v-icon>md:eco</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        c2<v-icon>md:home</v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;&lt;!&ndash;        c3<v-icon icon="md:spa"></v-icon>&ndash;&gt;&ndash;&gt;-->
  <!--&lt;!&ndash;&lt;!&ndash;        c4<v-icon icon="md:nest-eco-leaf"></v-icon>&ndash;&gt;&ndash;&gt;-->
  <!--&lt;!&ndash;&lt;!&ndash;        c5<v-icon icon="md:psychiatry"></v-icon>&ndash;&gt;&ndash;&gt;-->
  <!--&lt;!&ndash;        c6<v-icon icon="mdi:mdi-share-variant"></v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        d0<v-icon :icon="`mdiSvg:${mdiShareVariant}`"></v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        d1<v-icon :icon="`mdiSvg:${mdiSpa}`"></v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        d2<v-icon :icon="`mdiSvg:${mdiLeaf}`"></v-icon>&ndash;&gt;-->
  <!--&lt;!&ndash;        e<v-icon icon="fa:fas fa-plus"/>&ndash;&gt;-->
  <!--&lt;!&ndash;        f<v-icon icon="mdi:mdi-plus" />&ndash;&gt;-->
  <!--&lt;!&ndash;      </div>&ndash;&gt;-->

  <!--      <nav>-->
  <!--&lt;!&ndash;        <RouterLink to="/start">Home</RouterLink>&ndash;&gt;-->
  <!--&lt;!&ndash;        <RouterLink to="/about">About</RouterLink>&ndash;&gt;-->
  <!--      </nav>-->
  <!--    </div>-->
  <!--  </header>-->

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
