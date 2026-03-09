"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "VASP"
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                setLoading(false);
            } else {
                setSuccess(true);
                setLoading(false);
                // Redirect to login after a short delay
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
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
                    <h2 className="text-3xl font-bold text-center heading-serif">Create an Account</h2>
                    <p className="text-zinc-500 text-center mt-2 dark:text-zinc-400">
                        Join Ngao Compliance today
                    </p>
                </div>

                {success ? (
                    <div className="p-6 bg-green-50 text-green-700 rounded-xl text-center border border-green-200 dark:bg-green-900/20 dark:border-green-900/30 dark:text-green-400">
                        <h3 className="text-lg font-semibold mb-2">Registration Successful!</h3>
                        <p className="text-sm">Redirecting to login page...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:text-red-400 text-center">
                                {error}
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ngao-green/20 focus:border-ngao-green transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:focus:bg-zinc-800 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="e.g., vasp_user"
                                    className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ngao-green/20 focus:border-ngao-green transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:focus:bg-zinc-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ngao-green/20 focus:border-ngao-green transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:focus:bg-zinc-800 dark:text-white"
                                required
                                minLength={6}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                                Account Type
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-5 py-3 rounded-xl border border-zinc-200 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ngao-green/20 focus:border-ngao-green transition-all dark:bg-zinc-800 dark:border-zinc-700 dark:focus:bg-zinc-800 dark:text-white cursor-pointer appearance-none"
                            >
                                <option value="VASP">Virtual Asset Service Provider (VASP)</option>
                                <option value="REGULATOR">Regulator / Authority</option>
                            </select>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-12 mt-4 rounded-xl bg-ngao-green text-ngao-ivory hover:bg-ngao-green-light transition-colors text-base font-semibold shadow-lg shadow-ngao-green/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </form>
                )}

                {!success && (
                    <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-ngao-green underline underline-offset-4 hover:text-ngao-green-light dark:text-ngao-green-light">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
