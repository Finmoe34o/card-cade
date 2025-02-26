"use server";

export async function sendValuesToServer(bet) {
    console.log(bet, "BET")
    return { success: true, bet };
}