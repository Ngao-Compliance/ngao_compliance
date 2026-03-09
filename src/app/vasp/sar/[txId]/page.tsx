"use client";

import { useState } from "react";
import { submitSAR } from "@/app/actions/sarActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function SARForm() {
    const params = useParams();
    const router = useRouter();
    const txId = params.txId as string;
    
    const [narrative, setNarrative] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitSAR(txId, narrative);
            router.push("/vasp/dashboard");
        } catch (e) {
            console.error(e);
            setSubmitting(false);
        }
    };

    return (
        <div className="container-wide section-padding min-h-screen">
            <h1 className="heading-serif text-3xl mb-6">File Suspicious Activity Report</h1>
            
            <Card className="max-w-2xl border-ngao-border shadow-sm">
                <CardHeader className="bg-ngao-ivory border-b border-ngao-border rounded-t-lg">
                    <CardTitle>SAR Submission</CardTitle>
                    <CardDescription>Ref: TX-{txId.substring(0, 8)}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="narrative" className="text-sm font-semibold text-ngao-dark">
                                Narrative / Justification
                            </Label>
                            <textarea 
                                id="narrative"
                                className="w-full min-h-[150px] p-3 border border-ngao-border rounded-md focus:outline-none focus:ring-1 focus:ring-ngao-green"
                                placeholder="Describe the suspicious activity..."
                                required
                                value={narrative}
                                onChange={(e) => setNarrative(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-end gap-4 border-t border-ngao-border pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.push("/vasp/dashboard")}
                                className="border-ngao-border text-ngao-muted hover:text-ngao-dark hover:bg-ngao-warm-gray"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={submitting || !narrative}
                                className="bg-ngao-ochre hover:bg-orange-800 text-white"
                            >
                                {submitting ? "Submitting to CBK..." : "Submit SAR"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
