import dbConnect from "./mongoose";
import Transaction from "../models/Transaction";
import VASP from "../models/VASP";
import { submitAuditLog, createHederaTopic } from "./hedera";

const VASP_NAMES = ["Binance Kenya", "Yellow Card", "Bitmama", "LocalBitcoins KE"];
const ASSETS = ["BTC", "ETH", "USDT", "USDC"];
const SANCTIONED_ADDRESSES = ["1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", "0x7F3A5954B4B144E5B8E67e074dDa6A40"];
const MIXER_ADDRESSES = ["0xTornadoCashProxy...", "bc1qmixer..."];

const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomHex = (len: number) => Array.from({length: len}, () => Math.floor(Math.random() * 16).toString(16)).join('');

export async function generateSingleMockTransaction() {
    await dbConnect();

    let vasps = await VASP.find({});
    if (vasps.length === 0) {
        console.log("Seeding VASPs and creating Hedera Topics...");
        for (const name of VASP_NAMES) {
            const topicId = await createHederaTopic(`Audit Log for ${name}`) || "0.0.0"; // Fallback if HCS fails
            await VASP.create({ vaspId: name, topicId });
        }
        vasps = await VASP.find({});
    }

    const isSanctioned = Math.random() < 0.1; // 10% chance
    const isMixer = Math.random() < 0.15; // 15% chance
    const isStructuring = Math.random() < 0.2; // 20% chance
    
    let amount = Math.floor(Math.random() * 50000);
    if (isStructuring) {
        amount = 9500 + Math.random() * 499; // 9500 - 9999
    }

    const senderAddress = isSanctioned ? SANCTIONED_ADDRESSES[0] : (isMixer ? MIXER_ADDRESSES[0] : '0x' + randomHex(40));
    const receiverAddress = '0x' + randomHex(40);

    let riskScore = 10;
    const flags: string[] = [];

    if (isSanctioned) {
        riskScore += 80;
        flags.push("Sanctioned Address (ISIL/Al-Qaida)");
    }
    if (isMixer) {
        riskScore += 50;
        flags.push("Mixer Interaction");
    }
    if (isStructuring) {
        riskScore += 30;
        flags.push("Potential Structuring");
    }
    if (amount > 100000) {
        riskScore += 40;
        flags.push("High Value Transaction");
    }

    riskScore = Math.min(100, riskScore);

    const selectedVasp = randomItem(vasps);

    const tx = new Transaction({
        txHash: '0x' + randomHex(64),
        senderAddress,
        receiverAddress,
        amount,
        asset: randomItem(ASSETS),
        vaspId: selectedVasp.vaspId,
        riskScore,
        flags,
        status: riskScore > 70 ? 'FLAGGED' : 'PENDING'
    });

    await tx.save();

    // Log to Hedera (async)
    submitAuditLog(tx.vaspId, {
        action: "Transaction Processed",
        txHash: tx.txHash,
        riskScore: tx.riskScore,
        flags: tx.flags,
    });

    return tx;
}
