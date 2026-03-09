import TransactionFeed from "@/components/TransactionFeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Activity, AlertTriangle } from "lucide-react";

export default async function VASPDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "VASP") {
        redirect("/api/auth/signin");
    }

    return (
        <div className="container-wide section-padding space-y-8 min-h-screen">
            <div>
                <h1 className="heading-serif text-4xl mb-2">VASP Operations Dashboard</h1>
                <p className="text-ngao-muted text-lg">Monitor transactions, manage alerts, and file SARs for {session.user?.name}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-ngao-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-ngao-muted">Total Monitored Vol</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-ngao-green/5 flex items-center justify-center text-ngao-green">
                            <Activity className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">2,345 TXs</div>
                        <p className="text-xs text-ngao-muted mt-1">+14% from last week</p>
                    </CardContent>
                </Card>

                <Card className="border-ngao-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-ngao-muted">Action Required</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-ngao-ochre/10 flex items-center justify-center text-ngao-ochre">
                            <AlertTriangle className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold text-ngao-ochre">7 FLAGGED</div>
                        <p className="text-xs text-ngao-muted mt-1">Pending SAR Review</p>
                    </CardContent>
                </Card>

                <Card className="border-ngao-border shadow-sm bg-ngao-green text-ngao-ivory">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-ngao-green-light">Compliance Score</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-ngao-ivory">
                            <Shield className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">92 / 100</div>
                        <p className="text-xs text-ngao-green-light mt-1">Excellent Standing</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <TransactionFeed isRegulator={false} />
            </div>
        </div>
    );
}
