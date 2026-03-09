"use client";

import { useState } from "react";
import { reviewSAR } from "@/app/actions/sarActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function RegulatorSARReview() {
    const params = useParams();
    const router = useRouter();
    const sarId = params.sarId as string;
    
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await reviewSAR(sarId, notes);
            router.push("/regulator/dashboard");
        } catch (e) {
            console.error(e);
            setSubmitting(false);
        }
    };

    return (
        <div className="container-wide section-padding min-h-screen">
            <h1 className="heading-serif text-3xl mb-6">Review Suspicious Activity Report</h1>
            
            <Card className="max-w-3xl border-ngao-border shadow-sm">
                <CardHeader className="bg-white border-b border-ngao-border rounded-t-lg flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>SAR Review</CardTitle>
                        <CardDescription>Internal evaluation and notes.</CardDescription>
                    </div>
                    <Badge className="bg-ngao-ochre text-white">SUBMITTED</Badge>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="text-sm font-semibold text-ngao-dark">
                                Regulator Notes / Decision
                            </Label>
                            <textarea 
                                id="notes"
                                className="w-full min-h-[150px] p-3 border border-ngao-border rounded-md focus:outline-none focus:ring-1 focus:ring-ngao-green"
                                placeholder="Enter review notes and actions taken..."
                                required
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-end gap-4 border-t border-ngao-border pt-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => router.push("/regulator/dashboard")}
                                className="border-ngao-border text-ngao-muted hover:text-ngao-dark hover:bg-ngao-warm-gray"
                            >
                                Back
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={submitting || !notes}
                                className="bg-ngao-green hover:bg-ngao-green-light text-white"
                            >
                                {submitting ? "Processing..." : "Mark as Reviewed"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
