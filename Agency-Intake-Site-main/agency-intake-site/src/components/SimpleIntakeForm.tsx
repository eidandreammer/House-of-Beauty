'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { simpleIntakeSchema, type SimpleIntake } from '@/lib/simple-intake.schema'
import { submitSimpleIntake } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { useBackground } from '@/contexts/BackgroundContext'

export default function SimpleIntakeForm() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [message, setMessage] = useState<string | null>(null)
	const tokenRef = useRef<string>('')
	const { getButtonColor, getButtonTextColor } = useBackground()
	const buttonColor = getButtonColor()
	const buttonTextColor = getButtonTextColor()

	const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, trigger } = useForm<SimpleIntake>({
		resolver: zodResolver(simpleIntakeSchema),
		mode: 'onBlur',
		defaultValues: { role: 'owner', urgency: 'soon' }
	})

	useEffect(() => {
		if (!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return
		if (document.querySelector('script[src*="turnstile/v0/api.js"]')) return
		const s = document.createElement('script')
		s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
		s.async = true
		s.defer = true
		document.head.appendChild(s)
	}, [])

	const onSubmit = async (data: SimpleIntake) => {
		setIsSubmitting(true)
		setMessage(null)
		let token = tokenRef.current

		if (!token && process.env.NODE_ENV !== 'production') token = 'placeholder-token'
		if (!token && typeof window !== 'undefined' && (window as any).turnstile) {
			await new Promise<void>((resolve) => {
				const container = document.getElementById('turnstile-container')
				if (!container) return resolve()
					; (window as any).turnstile.render('#turnstile-container', {
						sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
						callback: (t: string) => { tokenRef.current = t; resolve() }
					})
			})
			token = tokenRef.current
		}

		if (!token) {
			setIsSubmitting(false)
			setMessage('Please complete the captcha to continue.')
			return
		}

		const res = await submitSimpleIntake({ ...data, turnstileToken: token }, token)
		if (res.success) {
			setMessage('Thanks! We’ll be in touch shortly.')
		} else {
			setMessage(res.error || 'Something went wrong.')
		}
		setIsSubmitting(false)
	}

	const role = watch('role')
	const urgency = watch('urgency')

	const pill = (active: boolean) =>
		`px-4 py-2 rounded-full border text-sm ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
			<form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-sm space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700">My name is*</label>
					<input {...register('name')} className="mt-2 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="Jane Doe" />
					{errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">and I work in*</label>
					<input {...register('company')} className="mt-2 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900" placeholder="Acme Health" />
					{errors.company && <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>}
				</div>

				<div>
					<span className="block text-sm font-medium text-gray-700 mb-2">My role there is*</span>
					<div className="flex flex-wrap gap-2">
						{(['owner', 'manager', 'employee', 'investor', 'other'] as const).map(v => (
							<button type="button" key={v} onClick={() => setValue('role', v, { shouldValidate: true })}
								className={pill(role === v)}>{v[0].toUpperCase() + v.slice(1)}</button>
						))}
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Feel free to contact me at*</label>
					<input
						{...register('email', {
							onBlur: () => trigger('email')
						})}
						type="email"
						className="mt-2 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900"
						placeholder="jane@acme.com"
					/>
					{errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">Phone number*</label>
					<input
						{...register('phone', {
							onBlur: () => trigger('phone')
						})}
						type="tel"
						className="mt-2 w-full rounded-md border-gray-300 focus:ring-2 focus:ring-gray-900"
						placeholder="(555) 123-4567"
					/>
					{errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
				</div>

				<div>
					<span className="block text-sm font-medium text-gray-700 mb-2">I would like to get an answer*</span>
					<div className="flex flex-wrap gap-2">
						<button type="button" onClick={() => setValue('urgency', 'soon', { shouldValidate: true })} className={pill(urgency === 'soon')}>Soon</button>
						<button type="button" onClick={() => setValue('urgency', 'no_rush', { shouldValidate: true })} className={pill(urgency === 'no_rush')}>No Rush</button>
					</div>
				</div>

				<div id="turnstile-container" className="hidden" />

				<motion.button
					type="submit"
					disabled={!isValid || isSubmitting}
					className="w-full inline-flex items-center justify-center rounded-xl px-6 py-4 text-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
					style={{
						backgroundColor: buttonColor,
						color: buttonTextColor,
					}}
					whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
					whileTap={{ scale: 0.98 }}
					initial={{ opacity: 0.9 }}
					animate={{
						opacity: 1,
						boxShadow: `0 10px 30px -10px ${buttonColor}` // Glow effect based on theme
					}}
				>
					{isSubmitting ? (
						<span className="flex items-center gap-2">
							<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Submitting...
						</span>
					) : 'Get Started Now'}
				</motion.button>

				<p className="text-xs text-gray-500">By submitting, you agree to be contacted about your inquiry.</p>
				{message && <p className="text-sm mt-2">{message}</p>}
			</form>

			<aside className="bg-gray-50 p-6 rounded-xl">
				<h3 className="text-lg font-semibold mb-2">Contact Us</h3>
				<p className="text-gray-600">We’re here to help you get started. Share your details and we’ll reach out.</p>
			</aside>
		</div>
	)
}


