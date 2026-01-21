import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './tests',
	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:3000',
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
		env: {
			NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
			NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'anon'
		}
	},
	use: {
		headless: true,
		baseURL: 'http://localhost:3000',
		trace: 'on-first-retry'
	}
})


