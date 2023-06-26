
export default [
    {
        urlPattern: /^https?:\/\/.*\.tile\.osm\.org\/.*/i,
        handler: 'CacheFirst',
        options: {
            cacheName: 'openstreetmap-cache',
            expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
                statuses: [0, 200]
            }
        }
    },
    {
        urlPattern: /^https?:\/\/m\d\.google\.com\/vt\/lyrs\/.*/i,
        handler: 'CacheFirst',
        options: {
            cacheName: 'google-maps-cache',
            expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
                statuses: [0, 200]
            }
        }
    },
]
