import { createClient } from '@/utils/supabase/server';
import Link from "next/link"


export default async function page() {
    const river = []
    const hand = []
    const supabase = await createClient();
    let { data: servers } = await supabase
        .from('servers')
        .select("*")

    const newServer = async (newServer) => {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('servers')
            .insert([
                {
                    players: 1,
                    river: '{}',
                    player_cards: '{}',
                    stack_sizes: `{}`
                },
              ])
            .eq("id", newServer)
        console.error("Error inserting server:", error);
    }

    const iteratePlayerNum = async (playerNum,serverNum) => {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('servers')
            .update({ "players": playerNum })
            .eq("id", serverNum)

    }
    
    const findServer = () => {
        let serverNum
        let playerNum
        for (let i = 0; i < servers.length; i++) {
            if (servers[i].players < 6) {
                serverNum = servers[i].id
                playerNum = servers[i].players
                break;
            }
        }
        if (serverNum === undefined) {
            newServer(servers.length + 1)
            serverNum = servers.length + 1
        }
        iteratePlayerNum(playerNum,serverNum)
        return `/${serverNum}/${playerNum}`
    }
 
    return <div className="text-white text-center">
        <nav className="flex flex-row flex-nowrap h-[14vh] justify-evenly w-[100vw] border-b-2 border-gray-600">
            <Link className="inline" href="/">
                <h1 className="text-4xl inline mx-auto top-[3vh] font-extrabold relative">Card Cade</h1>
            </Link>
        </nav>
        <h2 className="text-3xl font-semibold text-gray-200 relative top-[18.5vh]">Play Poker now</h2>
        <a href={findServer()} className="w-[15vw] h-[5vh] relative block py-1 top-[38vh] bg-gray-600 rounded-2xl mx-auto">Find a table</a>
    </div>
}