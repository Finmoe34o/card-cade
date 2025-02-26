"use server";

import { createClient } from "@/utils/supabase/server"

export async function sendValuesToServer(bet, serverNum, playerNum) {
    const supabase = await createClient()
    const { data: servers } = await supabase
        .from("servers")
        .select("*")
    if (bet === 0) {

    }
}
