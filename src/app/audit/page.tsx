import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dbConnect from "@/lib/mongoose";
import VASP from "@/models/VASP";

async function getAuditLogs(topicId: string) {
    if (!topicId) return { error: "No Topic ID provided." };

    try {
        const res = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages?limit=100&order=desc`, {
            next: { revalidate: 10 } // Revalidate every 10 seconds
        });
        
        if (!res.ok) {
            return { error: "Failed to fetch from Hedera Mirror Node" };
        }

        const data = await res.json();
        
        const decodedMessages = data.messages.map((m: any) => {
            let payload = {};
            try {
                const decodedStr = Buffer.from(m.message, 'base64').toString('utf-8');
                payload = JSON.parse(decodedStr);
            } catch (e) {
                payload = { raw: m.message };
            }
            return {
                sequenceNumber: m.sequence_number,
                consensusTimestamp: m.consensus_timestamp,
                payload
            };
        });

        return { messages: decodedMessages, topicId };
    } catch (e: any) {
        return { error: e.message };
    }
}

export default async function AuditTrailPage(props: { searchParams: Promise<{ vaspId?: string }> }) {
    await dbConnect();
    const vasps = (await VASP.find({}).lean()) as any[];

    const searchParams = await props.searchParams;
    let selectedVaspId = searchParams.vaspId;

    if (!selectedVaspId && vasps.length > 0) {
        selectedVaspId = vasps[0].vaspId;
    }

    const selectedVasp = vasps.find((v: any) => v.vaspId === selectedVaspId);
    
    let data: any = { messages: [] };
    if (selectedVasp?.topicId) {
        data = await getAuditLogs(selectedVasp.topicId);
    } else {
        data = { error: "No Topic ID found for selected VASP." };
    }

    return (
        <div className="container-wide section-padding min-h-screen">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-lg bg-ngao-green flex items-center justify-center text-ngao-ivory">
                    <Fingerprint className="h-6 w-6" />
                </div>
                <h1 className="heading-serif text-4xl">Immutable Audit Trail</h1>
            </div>
            <p className="text-ngao-muted text-lg mb-8">Cryptographically secured operations logs via Hedera Consensus Service.</p>

            <div className="mb-6 flex gap-2 flex-wrap">
                {vasps.map((v) => (
                    <Link key={v.vaspId} href={`/audit?vaspId=${encodeURIComponent(v.vaspId)}`}>
                        <Button 
                            variant={v.vaspId === selectedVaspId ? "default" : "outline"}
                            className={v.vaspId === selectedVaspId ? "bg-ngao-green text-ngao-ivory" : "border-ngao-green text-ngao-green"}
                        >
                            {v.vaspId}
                        </Button>
                    </Link>
                ))}
            </div>

            <Card className="border-ngao-border shadow-sm">
                <CardHeader className="bg-ngao-ivory border-b border-ngao-border rounded-t-lg flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-ngao-green" />
                            On-chain Records for {selectedVaspId || "None"}
                        </CardTitle>
                        <CardDescription>Topic ID: {selectedVasp?.topicId || "Not Configured"}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {data.error ? (
                        <div className="p-8 text-center text-ngao-ochre font-medium">
                            {data.error}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-ngao-warm-gray bg-opacity-30">
                                <TableRow>
                                    <TableHead className="py-4">Consensus Time</TableHead>
                                    <TableHead>Seq</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.messages?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-ngao-muted">No audit logs found on this topic.</TableCell>
                                    </TableRow>
                                )}
                                {data.messages?.map((msg: any) => (
                                    <TableRow key={msg.sequenceNumber} className="hover:bg-ngao-green/5">
                                        <TableCell className="text-sm font-mono text-ngao-muted">
                                            {new Date(parseFloat(msg.consensusTimestamp) * 1000).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{msg.sequenceNumber}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="border-ngao-green font-mono">
                                                {msg.payload.action || "UNKNOWN"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-mono break-all max-w-md">
                                            {JSON.stringify(msg.payload)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
