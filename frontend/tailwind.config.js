/** @type {import('tailwindcss').Config} */
// Design tokens extracted programmatically from the provided AI WeatherWise
// mockups (ai_weatherwise_dashboard.html etc.) so every value here is exact,
// not hand-transcribed. All 4 mockups shared an identical config (verified
// by hash comparison), so there was a single source of truth to port.
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
            "colors": {
                  "tertiary-fixed-dim": "#ffb95f",
                  "background": "#0b1326",
                  "on-primary-container": "#004965",
                  "surface-tint": "#7bd0ff",
                  "inverse-primary": "#00668a",
                  "on-error-container": "#ffdad6",
                  "surface-variant": "#2d3449",
                  "tertiary": "#ffc174",
                  "secondary": "#c0c1ff",
                  "surface-container-low": "#131b2e",
                  "secondary-fixed-dim": "#c0c1ff",
                  "surface-container-high": "#222a3d",
                  "surface-bright": "#31394d",
                  "on-secondary": "#1000a9",
                  "on-tertiary-fixed-variant": "#653e00",
                  "surface-container-highest": "#2d3449",
                  "primary-fixed-dim": "#7bd0ff",
                  "surface-container": "#171f33",
                  "on-error": "#690005",
                  "on-tertiary": "#472a00",
                  "error-container": "#93000a",
                  "inverse-on-surface": "#283044",
                  "primary-container": "#38bdf8",
                  "tertiary-container": "#f59e0b",
                  "primary-fixed": "#c4e7ff",
                  "on-secondary-container": "#b0b2ff",
                  "on-primary-fixed-variant": "#004c69",
                  "surface-dim": "#0b1326",
                  "on-secondary-fixed": "#07006c",
                  "outline-variant": "#3e484f",
                  "on-primary": "#00354a",
                  "surface": "#0b1326",
                  "secondary-fixed": "#e1e0ff",
                  "on-background": "#dae2fd",
                  "on-tertiary-fixed": "#2a1700",
                  "outline": "#87929a",
                  "error": "#ffb4ab",
                  "primary": "#8ed5ff",
                  "tertiary-fixed": "#ffddb8",
                  "inverse-surface": "#dae2fd",
                  "on-primary-fixed": "#001e2c",
                  "on-surface-variant": "#bdc8d1",
                  "on-secondary-fixed-variant": "#2f2ebe",
                  "surface-container-lowest": "#060e20",
                  "on-tertiary-container": "#613b00",
                  "secondary-container": "#3131c0",
                  "on-surface": "#dae2fd"
            },
            "borderRadius": {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
            },
            "spacing": {
                  "margin-tablet": "1.5rem",
                  "space-xl": "2.25rem",
                  "gutter": "1rem",
                  "margin": "1rem",
                  "gutter-desktop": "1.5rem",
                  "margin-desktop": "2.5rem",
                  "space-lg": "1.5rem",
                  "space-sm": "0.5rem",
                  "gutter-tablet": "1.25rem",
                  "space-xs": "0.25rem",
                  "space-md": "1rem"
            },
            "fontFamily": {
                  "label-sm": [
                        "Plus Jakarta Sans"
                  ],
                  "headline-lg": [
                        "Plus Jakarta Sans"
                  ],
                  "display-hero": [
                        "Plus Jakarta Sans"
                  ],
                  "label-md": [
                        "Plus Jakarta Sans"
                  ],
                  "display-hero-mobile": [
                        "Plus Jakarta Sans"
                  ],
                  "body-sm": [
                        "Plus Jakarta Sans"
                  ],
                  "headline-md": [
                        "Plus Jakarta Sans"
                  ],
                  "body-md": [
                        "Plus Jakarta Sans"
                  ],
                  "body-lg": [
                        "Plus Jakarta Sans"
                  ],
                  "headline-lg-mobile": [
                        "Plus Jakarta Sans"
                  ],
                  "headline-sm": [
                        "Plus Jakarta Sans"
                  ],
                  "label-lg": [
                        "Plus Jakarta Sans"
                  ]
            },
            "fontSize": {
                  "label-sm": [
                        "10px",
                        {
                              "lineHeight": "14px",
                              "letterSpacing": "0.06em",
                              "fontWeight": "600"
                        }
                  ],
                  "headline-lg": [
                        "36px",
                        {
                              "lineHeight": "44px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "600"
                        }
                  ],
                  "display-hero": [
                        "96px",
                        {
                              "lineHeight": "96px",
                              "letterSpacing": "-0.04em",
                              "fontWeight": "200"
                        }
                  ],
                  "label-md": [
                        "12px",
                        {
                              "lineHeight": "16px",
                              "letterSpacing": "0.02em",
                              "fontWeight": "500"
                        }
                  ],
                  "display-hero-mobile": [
                        "72px",
                        {
                              "lineHeight": "76px",
                              "letterSpacing": "-0.03em",
                              "fontWeight": "200"
                        }
                  ],
                  "body-sm": [
                        "13px",
                        {
                              "lineHeight": "18px",
                              "fontWeight": "400"
                        }
                  ],
                  "headline-md": [
                        "24px",
                        {
                              "lineHeight": "32px",
                              "letterSpacing": "-0.01em",
                              "fontWeight": "600"
                        }
                  ],
                  "body-md": [
                        "15px",
                        {
                              "lineHeight": "22px",
                              "fontWeight": "400"
                        }
                  ],
                  "body-lg": [
                        "18px",
                        {
                              "lineHeight": "28px",
                              "letterSpacing": "-0.005em",
                              "fontWeight": "400"
                        }
                  ],
                  "headline-lg-mobile": [
                        "28px",
                        {
                              "lineHeight": "34px",
                              "letterSpacing": "-0.02em",
                              "fontWeight": "600"
                        }
                  ],
                  "headline-sm": [
                        "20px",
                        {
                              "lineHeight": "28px",
                              "letterSpacing": "-0.01em",
                              "fontWeight": "500"
                        }
                  ],
                  "label-lg": [
                        "14px",
                        {
                              "lineHeight": "20px",
                              "letterSpacing": "0.01em",
                              "fontWeight": "600"
                        }
                  ]
            }
      }
  },
  plugins: []
};
