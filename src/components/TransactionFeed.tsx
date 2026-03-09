"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/app/actions/transactionActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function TransactionFeed({ isRegulator = false }: { isRegulator?: boolean }) {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [filters, setFilters] = useState({ minRisk: "", vasp: "", asset: "" });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getTransactions(filters);
            setTransactions(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 5000); // Poll every 5 seconds for "live" feel
        return () => clearInterval(interval);
    }, [filters]);

    const handleFilterChange = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <Card className="w-full shadow-sm border-ngao-border">
            <CardHeader className="bg-white rounded-t-lg border-b border-ngao-border flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="heading-serif text-2xl">Live Transaction Feed</CardTitle>
                    <CardDescription>Real-time monitoring and risk assessment.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Min Risk Score" 
                        name="minRisk" 
                        type="number" 
                        value={filters.minRisk} 
                        onChange={handleFilterChange} 
                        className="w-32" 
                    />
                    {isRegulator && (
                        <Input 
                            placeholder="Filter VASP" 
                            name="vasp" 
                            value={filters.vasp} 
                            onChange={handleFilterChange} 
                            className="w-40" 
                        />
                    )}
                    <Input 
                        placeholder="Asset" 
                        name="asset" 
                        value={filters.asset} 
                        onChange={handleFilterChange} 
                        className="w-24" 
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-ngao-warm-gray bg-opacity-30">
                        <TableRow>
                            <TableHead className="py-4">Time</TableHead>
                            <TableHead>Tx Hash</TableHead>
                            <TableHead>Asset / Amount</TableHead>
                            <TableHead>Risk Score</TableHead>
                            <TableHead>Flags</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && transactions.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-8 text-ngao-muted">Loading transactions...</TableCell></TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-8 text-ngao-muted">No transactions found.</TableCell></TableRow>
                        ) : (
                            transactions.map((tx: any) => (
                                <TableRow key={tx._id} className="hover:bg-ngao-green/5 transition-colors">
                                    <TableCell className="text-sm text-ngao-muted">
                                        {new Date(tx.timestamp).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell className="font-mono text-xs max-w-xs truncate" title={tx.txHash}>
                                        {tx.txHash.substring(0, 16)}...
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold">{tx.amount.toLocaleString()} {tx.asset}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={tx.riskScore > 70 ? "destructive" : tx.riskScore > 30 ? "default" : "secondary"}
                                            className={tx.riskScore > 70 ? "bg-ngao-ochre text-white" : tx.riskScore > 30 ? "bg-ngao-gold text-white" : "bg-ngao-warm-gray text-ngao-dark"}
                                        >
                                            {tx.riskScore}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs">
                                        {tx.flags.length > 0 ? tx.flags.join(", ") : "None"}
                                    </TableCell>
                                    <TableCell>
                                        {tx.status}
                                    </TableCell>
                                    <TableCell>
                                        {!isRegulator ? (
                                            tx.status === "FLAGGED" ? (
                                                <Link href={`/vasp/sar/${tx._id}`}>
                                                    <Button size="sm" className="bg-ngao-ochre hover:bg-orange-800 text-white h-7 text-xs">
                                                        File SAR
                                                    </Button>
                                                </Link>
                                            ) : (
                                                <Dialog>
                                                    <DialogTrigger render={<Button size="sm" variant="ghost" className="h-7 text-xs text-ngao-muted hover:text-ngao-dark" />}>
                                                        View Details
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[500px]">
                                                        <DialogHeader>
                                                            <DialogTitle className="heading-serif text-2xl text-ngao-dark">Transaction Summary</DialogTitle>
                                                            <DialogDescription>
                                                                Detailed view of the flagged operations and network activity.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Hash</span>
                                                                <span className="col-span-3 text-sm font-mono break-all">{tx.txHash}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Amount</span>
                                                                <span className="col-span-3 text-sm font-semibold">{tx.amount.toLocaleString()} {tx.asset}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Risk Score</span>
                                                                <span className="col-span-3">
                                                                    <Badge 
                                                                        variant={tx.riskScore > 70 ? "destructive" : tx.riskScore > 30 ? "default" : "secondary"}
                                                                        className={tx.riskScore > 70 ? "bg-ngao-ochre text-white" : tx.riskScore > 30 ? "bg-ngao-gold text-white" : "bg-ngao-warm-gray text-ngao-dark"}
                                                                    >
                                                                        {tx.riskScore}
                                                                    </Badge>
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Flags</span>
                                                                <span className="col-span-3 text-sm">{tx.flags.length > 0 ? tx.flags.join(", ") : "None detected"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Sender</span>
                                                                <span className="col-span-3 text-sm font-mono break-all text-ngao-green">{tx.senderAddress}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Receiver</span>
                                                                <span className="col-span-3 text-sm font-mono break-all text-ngao-green">{tx.receiverAddress}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium text-ngao-muted">Time</span>
                                                                <span className="col-span-3 text-sm text-ngao-muted">{new Date(tx.timestamp).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )
                                        ) : (
                                                <Dialog>
                                                    <DialogTrigger render={<Button size="sm" variant="outline" className="border-ngao-green text-ngao-green h-7 text-xs" />}>
                                                        View Event
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[500px]">
                                                        <DialogHeader>
                                                            <DialogTitle className="heading-serif text-2xl text-ngao-dark">Transaction Summary</DialogTitle>
                                                            <DialogDescription>
                                                                Detailed view of the flagged operations and network activity.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Hash</span>
                                                                <span className="col-span-3 text-sm font-mono break-all">{tx.txHash}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Amount</span>
                                                                <span className="col-span-3 text-sm font-semibold">{tx.amount.toLocaleString()} {tx.asset}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Risk Score</span>
                                                                <span className="col-span-3">
                                                                    <Badge 
                                                                        variant={tx.riskScore > 70 ? "destructive" : tx.riskScore > 30 ? "default" : "secondary"}
                                                                        className={tx.riskScore > 70 ? "bg-ngao-ochre text-white" : tx.riskScore > 30 ? "bg-ngao-gold text-white" : "bg-ngao-warm-gray text-ngao-dark"}
                                                                    >
                                                                        {tx.riskScore}
                                                                    </Badge>
                                                                </span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Flags</span>
                                                                <span className="col-span-3 text-sm">{tx.flags.length > 0 ? tx.flags.join(", ") : "None detected"}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Sender</span>
                                                                <span className="col-span-3 text-sm font-mono break-all text-ngao-green">{tx.senderAddress}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4 border-b border-ngao-border pb-2">
                                                                <span className="text-sm font-medium text-ngao-muted">Receiver</span>
                                                                <span className="col-span-3 text-sm font-mono break-all text-ngao-green">{tx.receiverAddress}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="text-sm font-medium text-ngao-muted">Time</span>
                                                                <span className="col-span-3 text-sm text-ngao-muted">{new Date(tx.timestamp).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
