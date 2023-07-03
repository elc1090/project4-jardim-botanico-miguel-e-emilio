/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/vue" />
import type {LatLngExpression} from "leaflet";

declare module '*.vue' {
    import Vue from 'vue';
//     export default Vue;
}

type Trail = {
    id: number,
    name?: string,
    time?: string,
    desc?: string,
    points: LatLngExpression[]
}

type Marker = {
    id: number,
    category: string,
    icon?: string,
    latLng: LatLngExpression,
    iconUrl?: string,
    name: string,
    detail?: ?string,
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

type Visit = {
    id: number,
    type: string,
    visited: boolean
}
