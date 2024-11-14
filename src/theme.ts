import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    colors: {
        brand: {
            50: "#E2E8FF",  // Lightest blue-tinted gray
            100: "#B8C4E8", // Light blue-gray
            200: "#8E9BCC", // Medium light blue-gray
            300: "#6B79B0", // Medium blue-gray
            400: "#4A5785", // Medium dark blue-gray
            500: "#2F3B66", // Dark blue-gray
            600: "#1C2547", // Darker blue-gray
            700: "#101838", // Very dark blue-gray
            800: "#080E28", // Almost black with blue tint
            900: "#040819", // Darkest blue-black
        }
    },
    styles: {
        global: {
            body: {
                bg: "brand.800",
                color: "brand.50",
            }
        }
    }
})

export default theme