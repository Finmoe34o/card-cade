"use server";

import { createClient } from "@/utils/supabase/server"

export async function activePlayerHandling(serverNum, playerNum, action) {
    const supabase = await createClient()
    const { data: servers } = await supabase
        .from("servers")
        .select("*")
    const arr = servers[serverNum - 1].active_players
    if (action === "add") {
        arr.push(playerNum)
        const { data, error } = await supabase
            .from("servers")
            .update({ "active_players": arr })
            .eq('id', serverNum);
    }

}