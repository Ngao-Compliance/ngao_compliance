import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Users, BarChart } from "lucide-react";
import TransactionFeed from "@/components/TransactionFeed";
import { getSARQueue } from "@/app/actions/sarActions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RegulatorDashboard() {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "REGULATOR") {
        redirect("/api/auth/signin");
    }

    const sars = await getSARQueue();

    return (
        <div className="container-wide section-padding space-y-8 min-h-screen">
            <div>
                <h1 className="heading-serif text-4xl mb-2">Central Oversight Panel</h1>
                <p className="text-ngao-muted text-lg">Market-wide monitoring for {session.user?.name}.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-ngao-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-ngao-muted">Monitored VASPs</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-ngao-green/5 flex items-center justify-center text-ngao-green">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">12 Active</div>
                        <p className="text-xs text-ngao-muted mt-1">Market Coverage: 85%</p>
                    </CardContent>
                </Card>

                <Card className="border-ngao-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-ngao-muted">Market Risk Level</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-ngao-ochre/10 flex items-center justify-center text-ngao-ochre">
                            <BarChart className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold text-ngao-ochre">ELEVATED</div>
                        <p className="text-xs text-ngao-muted mt-1">Due to cross-border flows</p>
                    </CardContent>
                </Card>

                <Card className="border-ngao-border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-ngao-muted">Pending SARs</CardTitle>
                        <div className="h-8 w-8 rounded-lg bg-ngao-green/10 flex items-center justify-center text-ngao-green">
                            <Shield className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold">{sars.filter((s: any) => s.status === 'SUBMITTED').length}</div>
                        <p className="text-xs text-ngao-muted mt-1">Awaiting Review</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: SAR Queue */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-ngao-border shadow-sm">
                        <CardHeader className="bg-white rounded-t-lg border-b border-ngao-border">
                            <CardTitle className="heading-serif text-2xl">SAR Review Queue</CardTitle>
                            <CardDescription>Suspicious Activity Reports submitted by VASPs.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {sars.length === 0 ? (
                                <div className="p-8 text-center text-ngao-muted">No SARs found.</div>
                            ) : (
                                <div className="divide-y divide-ngao-border">
                                    {sars.map((sar: any) => (
                                        <div key={sar._id} className="p-4 hover:bg-ngao-green/5 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <Badge variant="outline" className="border-ngao-border text-ngao-dark">{sar.vaspId}</Badge>
                                                    <span className="text-xs text-ngao-muted">{new Date(sar.submissionDate).toLocaleString()}</span>
                                                </div>
                                                <div className="text-sm font-medium">Ref: TX-{sar.transactionId?.txHash?.substring(0,8)}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={
                                                    sar.status === 'SUBMITTED' ? 'bg-ngao-ochre text-white' : 'bg-ngao-green text-ngao-ivory'
                                                }>
                                                    {sar.status}
                                                </Badge>
                                                <Link href={`/regulator/sar/${sar._id}`}>
                                                    <Button size="sm" variant="outline" className="text-xs">Review</Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Transaction feed below */}
                    <TransactionFeed isRegulator={true} />
                </div>

                {/* Right Side: VASP Profiles Mock */}
                <div className="space-y-6">
                    <Card className="border-ngao-border shadow-sm">
                        <CardHeader className="bg-ngao-ivory border-b border-ngao-border">
                            <CardTitle className="heading-serif text-xl">VASP Profiles</CardTitle>
                            <CardDescription>Compliance standing overview.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            {[
                                { name: 'Binance Kenya', score: 92, status: 'Compliant' },
                                { name: 'Yellow Card', score: 88, status: 'Compliant' },
                                { name: 'Bitmama', score: 76, status: 'Warning' },
                                { name: 'LocalBitcoins KE', score: 55, status: 'High Risk' }
                            ].map((vasp) => (
                                <div key={vasp.name} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div>
                                        <div className="font-medium text-sm">{vasp.name}</div>
                                        <div className="text-xs text-ngao-muted">{vasp.status}</div>
                                    </div>
                                    <Badge variant={vasp.score > 80 ? 'default' : vasp.score > 60 ? 'secondary' : 'destructive'}
                                        className={vasp.score > 80 ? 'bg-ngao-green' : vasp.score > 60 ? 'bg-ngao-gold' : 'bg-ngao-ochre'}
                                    >
                                        {vasp.score}
                                    </Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
