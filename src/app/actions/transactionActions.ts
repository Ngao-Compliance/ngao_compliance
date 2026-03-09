"use server";

import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getTransactions(filters: any) {
    await dbConnect();
    
    // Auth check
    const session = await getServerSession(authOptions);
    /*if (!session) {
        throw new Error("Unauthorized");
    }*/
    
    // If VASP, only fetch their txs. If Regulator, fetch all.
    const query: any = {};
    if ((session?.user as any)?.role === "VASP") {
        query.vaspId = session?.user?.name || "Unknown VASP"; 
    }
    
    if (filters?.minRisk) query.riskScore = { $gte: Number(filters.minRisk) };
    if (filters?.vasp) query.vaspId = filters.vasp;
    if (filters?.asset) query.asset = filters.asset;
    if (filters?.status) query.status = filters.status;
    
    const txs = await Transaction.find(query)
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();
        
    return JSON.parse(JSON.stringify(txs)); 
}
