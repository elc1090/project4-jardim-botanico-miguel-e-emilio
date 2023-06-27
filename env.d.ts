/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />
import type {LatLngExpression} from "leaflet";

declare module '*.vue' {
    import Vue from 'vue';
//     export default Vue;
}

type Marker = {
    latLng: LatLngExpression,
    iconUrl: string,
    text: ?string
}

type TileProvider = {
    url: string,
    maxZoom?: numeric,
    subdomains?: Array<string>,
    attribution: string,
    visible: boolean,
    name: string
}
