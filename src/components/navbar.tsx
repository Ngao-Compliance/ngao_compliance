import Link from "next/link";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Navbar() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    return (
        <nav className="border-b border-ngao-border bg-ngao-ivory">
            <div className="container-wide flex h-16 items-center justify-between px-6 md:px-12 lg:px-24">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-ngao-green flex items-center justify-center text-ngao-ivory">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="heading-serif text-xl tracking-tight">Ngao</span>
                </Link>

                <div className="flex items-center gap-6">
                    {session ? (
                        <>
                            {role === "VASP" && (
                                <Link href="/vasp/dashboard" className="text-sm font-medium text-ngao-dark hover:text-ngao-green">
                                    VASP Dashboard
                                </Link>
                            )}
                            {role === "REGULATOR" && (
                                <Link href="/regulator/dashboard" className="text-sm font-medium text-ngao-dark hover:text-ngao-green">
                                    Oversight Panel
                                </Link>
                            )}
                            <Link href="/audit" className="text-sm font-medium text-ngao-dark hover:text-ngao-green">
                                Logs
                            </Link>

                            <Link href="/api/auth/signout">
                                <Button variant="outline" className="border-ngao-green text-ngao-green hover:bg-ngao-green hover:text-ngao-ivory">
                                    Sign Out
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <Link href="/api/auth/signin">
                            <Button className="bg-ngao-green text-ngao-ivory hover:bg-ngao-green-light">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
