"use server";

import dbConnect from "@/lib/mongoose";
import SAR from "@/models/SAR";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { submitAuditLog } from "@/lib/hedera";
import { revalidatePath } from "next/cache";

export async function submitSAR(txId: string, narrative: string) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    // Determine VASP ID from authenticated user
    const vaspId = session?.user?.name || "Unknown VASP";
    const reporterName = session?.user?.email || "VASP Admin";

    // 1. Create SAR
    const sar = new SAR({
        transactionId: txId,
        vaspId,
        status: 'SUBMITTED',
        narrative,
        reporterName,
        submissionDate: new Date()
    });
    await sar.save();

    // 2. Fetch Tx and record on-chain
    const tx = await Transaction.findById(txId);
    
    submitAuditLog(vaspId, {
        action: "SAR_SUBMITTED",
        transactionHash: tx?.txHash,
        vaspId,
        timestamp: new Date().toISOString()
    });

    revalidatePath('/vasp/dashboard');
    revalidatePath('/regulator/dashboard');
    return { success: true, sarId: sar._id.toString() };
}

export async function reviewSAR(sarId: string, notes: string) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    
    // In production, ensure user is a Regulator
    if ((session?.user as any)?.role !== "REGULATOR") {
        throw new Error("Unauthorized: Only regulators can review SARs");
    }

    const sar = await SAR.findByIdAndUpdate(sarId, {
        status: 'REVIEWED',
        regulatorNotes: notes
    });

    submitAuditLog(sar?.vaspId || "Unknown VASP", {
        action: "SAR_REVIEWED",
        sarId,
        regulatorNoteLength: notes.length,
        timestamp: new Date().toISOString()
    });

    revalidatePath('/regulator/dashboard');
    return { success: true };
}

export async function getSARQueue() {
    await dbConnect();
    // For Regulator oversight panel
    const sars = await SAR.find({}).populate('transactionId').sort({ submissionDate: -1 }).lean();
    return JSON.parse(JSON.stringify(sars));
}
