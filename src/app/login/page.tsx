"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                username,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid username or password");
                setLoading(false);
            } else {
                router.push("/");
                router.refresh(); // Refresh to ensure navbar and layout update with new session
            }
        } catch (err) {
            setError("An unexpected error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 font-sans p-6 dark:bg-black">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl shadow-ngao-green/5 border border-ngao-border dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-ngao-green flex items-center justify-center text-ngao-ivory mb-6 shadow-md">
                        <Shield className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-center heading-serif">Welcome Back</h2>
                    <p className="text-zinc-500 text-center mt-2 dark:text-zinc-400">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400 text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g., vasp_user"
                            className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ngao-green/20 focus:border-ngao-green transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:focus:bg-zinc-800 dark:text-white"
                            required
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ngao-green/20 focus:border-ngao-green transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:focus:bg-zinc-800 dark:text-white"
                            required
                        />
                    </div>

                    <Button 
                        type="submit" 
                        disabled={loading}
                        className="w-full h-12 mt-2 rounded-xl bg-ngao-green text-ngao-ivory hover:bg-ngao-green-light transition-colors text-base font-semibold shadow-lg shadow-ngao-green/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-ngao-green underline underline-offset-4 hover:text-ngao-green-light dark:text-ngao-green-light">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
