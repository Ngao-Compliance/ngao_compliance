import { Client, TopicMessageSubmitTransaction, TopicCreateTransaction } from "@hashgraph/sdk";
import dbConnect from "@/lib/mongoose";
import VASP from "@/models/VASP";

export const getHederaClient = () => {
    const accountId = process.env.HEDERA_ACCOUNT_ID;
    const privateKey = process.env.HEDERA_PRIVATE_KEY;

    if (!accountId || !privateKey) {
        console.warn("Hedera account ID and private key are not set. Audit logs will not be recorded.");
        return null;
    }

    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);
    return client;
};

export const createHederaTopic = async (memo: string): Promise<string | null> => {
    const client = getHederaClient();
    if (!client) return null;

    try {
        const transaction = new TopicCreateTransaction().setTopicMemo(memo);
        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);
        return receipt.topicId?.toString() || null;
    } catch (e) {
        console.error("Failed to create Hedera Topic:", e);
        return null;
    }
};

export const submitAuditLog = async (vaspId: string, messageObject: any) => {
    try {
        await dbConnect();
        const vasp = await VASP.findOne({ vaspId });
        
        if (!vasp || !vasp.topicId) {
            console.warn(`No Hedera Topic found for VASP: ${vaspId}. Audit log bypassed.`);
            return false;
        }

        const client = getHederaClient();
        if (!client) return false;

        const messageString = JSON.stringify({
            ...messageObject,
            timestamp: new Date().toISOString()
        });

        const transaction = new TopicMessageSubmitTransaction({
            topicId: vasp.topicId,
            message: messageString,
        });

        transaction.execute(client).catch(err => console.error("Hedera HCS error:", err));
        return true;
    } catch (error) {
        console.error("Failed to submit audit log to Hedera:", error);
        return false;
    }
};
