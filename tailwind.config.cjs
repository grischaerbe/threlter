const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				orange: {
					DEFAULT: 'var(--color-orange)'
				},
				blue: {
					dark: 'var(--color-blue-dark)',
					darker: 'var(--color-blue-darker)',
					darkest: 'var(--color-blue-darkest)'
				}
			},
			fontFamily: {
				sans: 'var(--font-sans)',
				headline: 'var(--font-headline)',
				segments: 'var(--font-segments)'
			}
		}
	},

	plugins: []
}

module.exports = config
