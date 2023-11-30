import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
    styles: {
        global: {
            color: {
                colors: {
                    gray: {
                        '900': '#060606',
                        '800': '#1F2029',
                        '700': '#353646',
                        '600': '#4B4D63',
                        '500': '#616480',
                        '400': '#797D9A',
                        '300': '#9699B0',
                        '200': '#B3B5C6',
                        '100': '#D1D2DC',
                        '50': '#EEEEF2',
                    },

                    blue: {
                        theme: '#40a9d6',
                    },
                },
            },

            fonts: {
                heading: 'Roboto',
                body: 'Roboto',
            },

            body: {
                bg: 'gray.900',
                color: 'gray.50',
            },
        },
    },
})
