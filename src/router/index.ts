import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ShowcaseView from "@/views/ShowcaseView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map',
      component: HomeView,
      props: false
    },
    {
      path: '/:type(local|trilha)/:id(\\d*)',
      name: 'selected',
      component: HomeView,
      props: true
    },{
      path: '/help-me',
      component: ShowcaseView
    }
  ]
})

export default router
