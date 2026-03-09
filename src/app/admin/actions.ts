"use server";

import { generateSingleMockTransaction } from "@/lib/mockGenerator";
import { revalidatePath } from "next/cache";

export async function triggerMockTx(secret: string) {
    const adminSecret = process.env.ADMIN_SECRET || "admin123";
    
    if (secret !== adminSecret) {
        return { error: "Invalid admin secret" };
    }

    try {
        const tx = await generateSingleMockTransaction();
        revalidatePath('/vasp/dashboard');
        revalidatePath('/regulator/dashboard');
        return { success: true, txHash: tx.txHash };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "Failed to generate Mock TX" };
    }
}
