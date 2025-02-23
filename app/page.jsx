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
                },
              ])
            .select("*")
        console.error("Error inserting server:", error);
    }

    const iteratePlayerNum = async (playerNum,serverNum) => {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('servers')
            .update({ "players": playerNum })
            .eq("id", serverNum)

    }

    const cardGen = (type,num) => {
        const cards = { "spades": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "hearts": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "diamonds": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "clubs": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] }
        let num1 = Math.ceil(Math.random() * 4)
        let suit = num1 === 1 ? "spades" : num1 === 2 ? "hearts" : num1 === 3 ? "diamonds" : "clubs"
        let num2
        while (cards[suit][num2] === undefined) {
            num2 = Math.floor(Math.random() * 13)
            num1 = Math.ceil(Math.random() * 4)
            suit = num1 === 1 ? "spades" : num1 === 2 ? "hearts" : num1 === 3 ? "diamonds" : "clubs"
        }
        const card = cards[suit][num2]
        delete cards[suit][num2]
        type === "hand" ? hand.push(suit, `${card}`) : river.push(suit, `${card}`)
    }
        

    const generateCards = async (serverNum, playerNum) => {
        if (playerNum === 1) {
            for (let i = 1; i < 6; i++) {
                cardGen("river",i)
            }
            const { data, error } = await supabase
                .from('servers')
                .update({ river: river })
                .eq('id', serverNum)
                .select()
        }
        cardGen("hand",1)
        cardGen("hand",2)
        hand.push(playerNum)
        const { data, error } = await supabase
                .from('servers')
                .update({ player_cards: hand })
                .eq('id', serverNum)
                .select()
        
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
        if (playerNum === 1) {
            generateCards(serverNum, playerNum)
        }
        //iteratePlayerNum(playerNum,serverNum) !!!!!!!!!
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