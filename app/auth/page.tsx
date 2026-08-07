'use client';

import { API_URL, countries } from '@/lib/clientUtils'
import { UserContext } from '@/lib/contexts';
import React, { useContext, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Shield, Trophy, Users, ArrowRightLeft } from 'lucide-react';

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
    const [isLogin, setIsLogin] = useState(true);

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
            router.push(result?.data?.user.role === 'ADMIN' ? '/admin' : '/user/clubs');
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
            router.push(result?.data?.user.role === 'ADMIN' ? '/admin' : '/user/clubs');
            router.refresh();
        } catch {
            setSignupError('Unable to signup right now. Please try again.');
        } finally {
            setSignupLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl px-4 py-8 mb-4">
            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                <aside className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-900 to-green-950/40 p-8 flex flex-col justify-between">
                    <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.25),_transparent_55%)]" />
                    <div className="relative">
                        <p className="text-sm text-green-500 font-semibold tracking-wide uppercase">Football management</p>
                        <h1 className="mt-3 text-4xl font-extrabold tracking-tight">
                            Elite<span className="text-green-600">XI</span>
                        </h1>
                        <p className="mt-4 text-gray-300 leading-relaxed">
                            Build your club, shape the squad, and chase silverware. EliteXI is a friendly home for managers who love transfers, tactics, and big-match nights.
                        </p>

                        <ul className="mt-8 space-y-4">
                            <li className="flex gap-3 items-start">
                                <span className="mt-0.5 rounded-lg bg-gray-800 border border-gray-700 p-2 text-green-500">
                                    <Shield size={18} />
                                </span>
                                <div>
                                    <p className="font-semibold text-white">Own your club</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Create a side, earn approval, and grow your reputation.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="mt-0.5 rounded-lg bg-gray-800 border border-gray-700 p-2 text-green-500">
                                    <Users size={18} />
                                </span>
                                <div>
                                    <p className="font-semibold text-white">Shape the squad</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Buy talent, manage contracts, and set your starting XI.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="mt-0.5 rounded-lg bg-gray-800 border border-gray-700 p-2 text-green-500">
                                    <ArrowRightLeft size={18} />
                                </span>
                                <div>
                                    <p className="font-semibold text-white">Live the market</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Negotiate transfers and keep the balance sheet healthy.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <span className="mt-0.5 rounded-lg bg-gray-800 border border-gray-700 p-2 text-green-500">
                                    <Trophy size={18} />
                                </span>
                                <div>
                                    <p className="font-semibold text-white">Compete for glory</p>
                                    <p className="text-sm text-gray-400 mt-0.5">Play fixtures and tournaments against other managers.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <p className="relative mt-10 text-sm text-gray-500">
                        Ready when you are. Log in or create an account to kick off.
                    </p>
                </aside>

                <div className="flex flex-col">
                    <div className="flex self-center lg:self-start rounded-xl overflow-hidden border border-gray-800 text-sm sm:text-base">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`py-2.5 px-8 text-center cursor-pointer font-semibold transition-colors ${isLogin ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`py-2.5 px-8 text-center cursor-pointer font-semibold transition-colors ${!isLogin ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-400 hover:text-white'}`}
                        >
                            Signup
                        </button>
                    </div>

                    {isLogin ? (
                        <section className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 flex-1">
                            <h2 className="text-2xl font-extrabold">Welcome back</h2>
                            <p className="text-gray-400 mt-2">
                                Login to manage clubs, players, transfers, and tournaments.
                            </p>

                            <form className="mt-8 space-y-4" onSubmit={handleLogin}>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full rounded-lg px-4 py-3 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400"
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
                                            className="w-full rounded-lg px-4 py-3 pr-11 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400"
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
                                    <button type="button" className="cursor-pointer text-green-500 hover:text-green-400">Forgot password?</button>
                                </div>
                                {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
                                <button disabled={loginLoading} type="submit" className="cursor-pointer w-full rounded-lg px-4 py-3 bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                                    {loginLoading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                        </section>
                    ) : (
                        <section className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 flex-1">
                            <h2 className="text-2xl font-bold">Create your account</h2>
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
                                        className="w-full rounded-lg px-4 py-3 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full rounded-lg px-4 py-3 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400"
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
                                            className="w-full rounded-lg px-4 py-3 pr-11 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400"
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
                                            className="w-full rounded-lg px-4 py-3 pr-11 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400"
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
                                        className="w-full rounded-lg px-4 py-3 bg-gray-950 border border-gray-800 text-gray-50 placeholder-gray-400 cursor-pointer"
                                    >
                                        {countries.map((country, i) => (
                                            <option key={i} value={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                                {signupError && <p className="text-red-500 text-sm">{signupError}</p>}
                                <button disabled={signupLoading} type="submit" className="cursor-pointer w-full rounded-lg px-4 py-3 bg-green-600 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed">
                                    {signupLoading ? 'Creating account...' : 'Signup'}
                                </button>
                            </form>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthPage
