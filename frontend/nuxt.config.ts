import { NuxtConfig } from '@nuxt/types';
import colors from 'vuetify/lib/util/colors';

import en from './locales/en';
import fr from './locales/fr';

require('events').EventEmitter.defaultMaxListeners = 20;
require('dotenv').config();

const proxyHost = process.env.proxyHost || 'http://localhost:8080';
const authHost = process.env.authHost || 'http://localhost:8000';
const publicHost = process.env.PUBLIC_HOST || 'http://localhost:3000';
const host = process.env.host || 'localhost';
const nodeEnv = process.env.NODE_ENV;

export default {
    telemetry: false,
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        htmlAttrs: {
            dir: 'ltr',
        },
        titleTemplate: (titleChunk: string) => {
            return titleChunk ? `${titleChunk} | Hangar` : 'Hangar';
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' },
        ],
    },

    env: {
        proxyHost,
        authHost,
        publicHost,
        host,
        nodeEnv,
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['~/assets/main.scss'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['~/plugins/api.ts', '~/plugins/utils.ts', '~/plugins/auth.ts', '~/plugins/perms.ts'],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: false,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/typescript
        '@nuxt/typescript-build',
        // https://go.nuxtjs.dev/vuetify
        '@nuxtjs/vuetify',
        // https://go.nuxtjs.dev/eslint
        '@nuxtjs/eslint-module',
        // https://go.nuxtjs.dev/pwa
        '@nuxtjs/pwa',
        '@nuxtjs/dotenv',
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
        '@nuxtjs/proxy',
        'nuxt-i18n',
        '@dansmaculotte/nuxt-security',
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {},

    // PWA module configuration: https://go.nuxtjs.dev/pwa
    pwa: {
        manifest: {
            name: 'Hangar | PaperMC',
            short_name: 'Hangar',
            description: 'Plugin repository for Paper plugins and more!',
            lang: 'en',
        },
    },

    // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        optionsPath: '~/plugins/vuetify.ts',
        treeShake: true,
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: ['lodash-es'],
    },

    router: {
        middleware: ['auth', 'routePermissions'],
    },

    proxy: [
        // backend
        proxyHost + '/api/',
        proxyHost + '/signup',
        proxyHost + '/login',
        proxyHost + '/logout',
        proxyHost + '/refresh',
        proxyHost + '/invalidate',
        proxyHost + '/v2/api-docs/',
        proxyHost + '/robots.txt',
        proxyHost + '/sitemap.xml',
        proxyHost + '/global-sitemap.xml',
        proxyHost + '/*/sitemap.xml',
        proxyHost + '/statusz',
        // auth
        authHost + '/avatar',
    ],

    i18n: {
        vueI18nLoader: true,
        strategy: 'no_prefix',
        defaultLocale: 'en',
        locales: [
            { code: 'fr', iso: 'fr-FR', name: 'Français' },
            { code: 'en', iso: 'en-US', name: 'English' },
        ],
        vueI18n: {
            locale: 'en',
            fallbackLocale: 'en',
            messages: {
                en,
                fr,
            },
        },
    },

    security: {
        dev: true,
        hsts: {
            maxAge: 15552000,
            includeSubDomains: true,
            preload: true,
        },
        csp: {
            directives: {
                defaultSrc: ["'self'", 'https://google-analytics.com', 'https://fonts.gstatic.com', 'https://fonts.googleapis.com'],
                styleSrc: ["'self'", 'https://fonts.googleapis.com', 'cdn.jsdelivr.net', "'unsafe-inline'"],
                fontSrc: ['fonts.gstatic.com', 'cdn.jsdelivr.net'],
                scriptSrc: ["'self'" /* , "'nonce-{nonce}'" */, "'unsafe-inline'", "'unsafe-eval'"],
                imgSrc: [
                    "'self'",
                    'https://www.google-analytics.com',
                    'https://www.gravatar.com',
                    authHost,
                    'data: papermc.io paper.readthedocs.io',
                    'https:', // ppl can use images in descriptions, we would need an image proxy or smth
                ],
                frameSrc: ["'self'", 'http://localhost/', 'https://papermc.io/'],
                manifestSrc: ["'self'"],
                connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://stats.g.doubleclick.net'],
                mediaSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'none'"],
            },
            reportOnly: false,
        },
        referrer: 'same-origin',
        additionalHeaders: true,
    },

    server: {
        port: 3000,
        host,
    },

    loading: {
        color: colors.blue.lighten2,
        continuous: true,
    },

    publicRuntimeConfig: {
        axios: {
            browserBaseURL: publicHost,
        },
    },

    privateRuntimeConfig: {
        axios: {
            baseURL: proxyHost,
        },
    },
} as NuxtConfig;
