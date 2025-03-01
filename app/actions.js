"use server";

import { createClient } from "@/utils/supabase/server"
import activePlayerHandling from "./activePlayerHandling"

export async function sendValuesToServer(bet, serverNum, playerNum) {
    const supabase = await createClient()
    const { data: servers } = await supabase
        .from("servers")
        .select("*")

    const roundRestart = async (round) => {
        round = 1
        const river = []
        const hand = []
        const activePlayers = []
        const { data, errror } = await supabase
            .from("servers")
            .update({
                river: [],
                player_cards: [],
                active_players: []
            })
            .eq("id", serverNum)
    }

    const stackSizes = { ...servers[serverNum - 1].stack_sizes };
    console.log(servers[serverNum - 1].active_players.includes("6"))
    stackSizes[playerNum] = Number(stackSizes[playerNum]) - Number(bet);
    const { data, error } = await supabase
        .from("servers")
        .update({ "stack_sizes": stackSizes })
        .eq('id', serverNum);
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
    let round = servers[serverNum - 1].round
    if (turn !== 6) {
        turn++
        const { data, error } = await supabase
            .from("servers")
            .update({ "turn": turn })
            .eq("id", serverNum)
    }
    else {
        turn = 1
        round < 5 ? round++ : (roundRestart(), round = 1)
        const { data, error } = await supabase
            .from("servers")
            .update({ "round": round, "turn": turn })
            .eq("id", serverNum)
    }
}
