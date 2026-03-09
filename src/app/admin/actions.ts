"use server";

import { generateSingleMockTransaction } from "@/lib/mockGenerator";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function triggerMockTx(secret: string) {
    const adminSecret = process.env.ADMIN_SECRET || "admin123";
    
    if (secret !== adminSecret) {
        return { error: "Invalid admin secret" };
    }

    try {
        const session = await getServerSession(authOptions);
        let targetVaspId: string | undefined = undefined;
        
        if (session && (session.user as any)?.role === "VASP") {
            targetVaspId = session.user?.name || undefined;
        }

        const tx = await generateSingleMockTransaction(targetVaspId);
        revalidatePath('/vasp/dashboard');
        revalidatePath('/regulator/dashboard');
        return { success: true, txHash: tx.txHash };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "Failed to generate Mock TX" };
    }
}
