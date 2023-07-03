import axios from "axios";
import type { Marker, Trail } from "!/env";
import home from "@/assets/markers/home.svg";
import eco from "@/assets/markers/eco.svg";
import hiking from "@/assets/markers/hiking.svg";
import deck from "@/assets/markers/deck.svg";


const sheet_id = import.meta.env.VITE_SHEET_ID
const api_key = import.meta.env.VITE_GOOGLE_API_KEY
const fetchTrails = async () => {
    return new Promise<Trail[]>((resolve, reject) => {
        axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values:batchGet?ranges=trilhas!A2:E10&key=${api_key}`)
            .then((res) => {

                const promises:Promise<Trail>[] = []
                res.data.valueRanges[0].values.forEach((trail: Array<string>) => {
                    promises.push(new Promise<Trail>((resolve,reject) => {
                        axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values:batchGet?ranges=${trail[3]}!A2:B1000&key=${api_key}`)
                            .then((res) => {
                                resolve({
                                    id: Number(trail[0]),
                                    name: trail[1],
                                    time: trail[2],
                                    desc: trail[4],
                                    points: res.data.valueRanges[0].values
                                })
                            }, reject)
                    }))
                })

                Promise.all(promises).then((data) => {
                    resolve(data)
                }, reject)

            }, reject)
    })
}

const fetchMarkers = async () => {
    return new Promise<Marker[]>((resolve, reject) => axios.get(`https://sheets.googleapis.com/v4/spreadsheets/${sheet_id}/values:batchGet?ranges=pontos!A2:G24&valueRenderOption=UNFORMATTED_VALUE&key=${api_key}`)
        .then((res) => {
            let data: Marker[] = []
            res.data.valueRanges[0].values.forEach((point: any[], index: number) => {
                if (
                    point[0] === '' || point[4] === '' || point[5] === '' ||
                    ['INATIVADO', 'NÃO EXISTE'].includes(point[6])
                ) {
                    return
                }

                let icon = undefined
                switch (point[1].trim()) {
                    case 'Edificações':
                        icon = home
                        break
                    case 'Coleções':
                        icon = eco
                        break
                    case 'Trilha':
                        icon = hiking
                        break
                    case 'Espaço de lazer':
                        icon = deck
                        break
                }

                data.push({
                    id: point[0],
                    category: point[1].trim(),
                    icon: icon,
                    latLng: [point[4], point[5]],
                    name: point[2],
                    detail: point[6],
                    // iconUrl: point[2],
                    text: point[3],
                })
            })
            resolve(data)
        }, reject)
    )
}

export {
    fetchTrails,
    fetchMarkers,
}
