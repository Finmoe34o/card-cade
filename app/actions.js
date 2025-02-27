"use server";

import { createClient } from "@/utils/supabase/server"
import { updateFunct } from "./[server-id]/[player-num]/page";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";
import page from "../app/[server-id]/[player-num]/page"

export async function sendValuesToServer(bet, serverNum, playerNum, round) {
    const supabase = await createClient()
    const { data: servers } = await supabase
        .from("servers")
        .select("*")
    if (bet === 0) {
        const arr = servers[serverNum - 1].active_players
        const newArr = []
        for (let i = 0; i < arr.length; i++) {
            arr[i] !== playerNum ? newArr.push(arr[i]) : ""
        }
        const { data, error } = await supabase
            .from('servers')
            .update({ "active_players": newArr })
            .eq("id", serverNum)
    } else if (bet > servers[serverNum - 1].min_bet) {
        const { data, error } = await supabase
            .from("servers")
            .update({ "min_bet": bet })
            .eq("id", serverNum)
    }
    let turn = servers[serverNum - 1].turn
    turn++
    const { data, error } = await supabase
        .from("servers")
        .update({ "turn": turn })
        .eq("id", serverNum)
    console.log("ASDHBSAJ")
    updateFunct(round)
    revalidatePath(`/${serverNum}/${playerNum}`)
    revalidateTag('server-data')
    page()
}
