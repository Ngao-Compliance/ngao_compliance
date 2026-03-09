"use client";

import { useState } from "react";
import { triggerMockTx } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AdminPage() {
    const [secret, setSecret] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleGenerate = async () => {
        setLoading(true);
        setResult(null);
        const res = await triggerMockTx(secret);
        setResult(res);
        setLoading(false);
    };

    return (
        <div className="container-wide section-padding min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md shadow-lg border-ngao-border">
                <CardHeader className="bg-ngao-ivory rounded-t-lg border-b border-ngao-border mb-4">
                    <CardTitle className="heading-serif text-2xl">System Admin</CardTitle>
                    <CardDescription>Generate mock data for the live feed.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Input 
                            type="password" 
                            placeholder="Admin Secret" 
                            value={secret} 
                            onChange={(e) => setSecret(e.target.value)}
                        />
                    </div>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={loading || !secret}
                        className="w-full bg-ngao-green text-ngao-ivory hover:bg-ngao-green-light"
                    >
                        {loading ? "Generating..." : "Generate Mock TX"}
                    </Button>

                    {result?.success && (
                        <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
                            Success! TX Hash: {result.txHash}
                        </div>
                    )}
                    {result?.error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                            Error: {result.error}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
