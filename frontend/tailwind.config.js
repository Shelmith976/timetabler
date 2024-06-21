/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"light-gray": "#f0f2f9",
				"light-violet": "#e2e5fa",
				"dark-violet": "#6e00ff",
				"dark-orange": "#ff7a49",
				"dark-yellow": "#ffbd00",
				"dark-green": "#00a36c",
				"primary-black": "#040404",
			},
		},
	},
	plugins: [require("daisyui"), ],

	daisyui: {
		themes: false,
	},
};
