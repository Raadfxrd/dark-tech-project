export default defineNuxtConfig({
    compatibilityDate: '2026-10-01',
    devtools: {enabled: false},
    css: ['~/assets/css/main.css'],
    devServer: {port: 5181},
    app: {
        head: {
            htmlAttrs: {lang: 'nl'},
            title: 'Greep H1',
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover'},
                {
                    name: 'description',
                    content: 'Greep H1 is een handschoen die je wijsvinger voor je beweegt. Alle techniek zit in een kleine module op je onderarm. €199.'
                },
                {name: 'theme-color', content: '#EEF2F0'},
            ],
            link: [
                {rel: 'icon', href: '/favicon.ico', sizes: '32x32'},
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
                {rel: 'apple-touch-icon', href: '/apple-touch-icon.png'},
                {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
                {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: ''},
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..800&display=swap'
                },
            ],
        },
    },
})
