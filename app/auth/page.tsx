'use client';

import { API_URL, countries } from '@/lib/helper'
import { UserContext } from '@/lib/userContext';
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation';

const AuthPage = () => {
    const router = useRouter();
    const userContext = useContext(UserContext);
    const setUser = userContext?.setUser;
    const [loginLoading, setLoginLoading] = useState(false);
    const [signupLoading, setSignupLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

    const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        const formData = new FormData(event.currentTarget);
        const email = String(formData.get('email') ?? '');
        const password = String(formData.get('password') ?? '');

        try {
            console.log(API_URL);
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
                signal: AbortSignal.timeout(5000)
            });
            const result = await response.json();

            if (!response.ok) {
                setLoginError(result?.message ?? 'Unable to login.');
                return;
            }

            if (setUser) {
                setUser(result?.data?.user ?? null);
            }
            router.push(result?.data?.user.role === 'ADMIN' ? '/admin' : '/dashboard');
            router.refresh();
        } catch {
            setLoginError('Unable to login right now. Please try again.');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleSignup = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSignupError('');
        setSignupLoading(true);

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get('name') ?? '');
        const email = String(formData.get('email') ?? '');
        const password = String(formData.get('password') ?? '');
        const confirm_password = String(formData.get('confirm_password') ?? '');
        const nationality = String(formData.get('nationality') ?? '');

        if (password !== confirm_password) {
            setSignupError('Password and confirm password are not same.');
            setSignupLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, confirm_password, nationality }),
                signal: AbortSignal.timeout(5000)
            });
            const result = await response.json();

            if (!response.ok) {
                setSignupError(result?.message ?? 'Unable to signup.');
                return;
            }

            if (setUser) {
                setUser(result?.data?.user ?? null);
            }
            router.push(result?.data?.user.role === 'ADMIN' ? '/admin' : '/dashboard');
            router.refresh();
        } catch {
            setSignupError('Unable to signup right now. Please try again.');
        } finally {
            setSignupLoading(false);
        }
    };

    return (
        <div className="max-w-5xl grid lg:grid-cols-2 gap-6 mb-4 mt-4">
            <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <h1 className="text-3xl font-extrabold">
                Elite<span className="text-green-600">XI</span>
                </h1>
                <p className="text-gray-400 mt-3">
                Welcome back. Login to manage clubs, players, transfers, and tournaments.
                </p>

                <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                    <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400"
                    placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showLoginPassword ? 'text' : 'password'}
                            name="password"
                            required
                            className="w-full rounded-lg px-4 py-3 pr-11 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowLoginPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                            aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                        >
                            {showLoginPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <button className="cursor-pointer text-blue-500">Forgot password?</button>
                </div>
                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                <button disabled={loginLoading} type="submit" className="cursor-pointer w-full rounded-lg px-4 py-3 bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                    {loginLoading ? 'Logging in...' : 'Login'}
                </button>
                </form>
            </section>

            <section className="bg-gray-800 border border-gray-800 rounded-2xl p-8">
                <h2 className="text-2xl font-bold">Create Your Account</h2>
                <p className="text-gray-400 mt-2">
                Join EliteXI and start building your ultimate football club.
                </p>

                <form className="mt-8 space-y-4" onSubmit={handleSignup}>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Full Name</label>
                    <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400"
                    placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                    <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400"
                    placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showSignupPassword ? 'text' : 'password'}
                            name="password"
                            required
                            className="w-full rounded-lg px-4 py-3 pr-11 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400"
                            placeholder="Create a password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowSignupPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                            aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                        >
                            {showSignupPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showSignupConfirmPassword ? 'text' : 'password'}
                            name="confirm_password"
                            required
                            className="w-full rounded-lg px-4 py-3 pr-11 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400"
                            placeholder="Confirm password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowSignupConfirmPassword((prev) => !prev)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer"
                            aria-label={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showSignupConfirmPassword ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Nationality</label>
                    <select
                        name="nationality"
                        required
                        className="w-full rounded-lg px-4 py-3 bg-gray-900 border border-gray-800 text-gray-50 placeholder-gray-400 cursor-pointer"
                    >
                        {
                            countries.map((country, i) => <option key={i} value={country}>{country}</option>)
                        }
                    </select>
                </div>
                {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
                <button disabled={signupLoading} type="submit" className="cursor-pointer w-full rounded-lg px-4 py-3 bg-blue-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                    {signupLoading ? 'Creating account...' : 'Signup'}
                </button>
                </form>
            </section>
        </div>
    )
}

export default AuthPage
