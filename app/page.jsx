
import Link from "next/link";
import { createClient } from "@/utils/supabase/server"

export default async function page() {
    const newServer = async (newServer, supabase) => {
        const { error } = await supabase
            .from('servers')
            .insert([
                {
                    players: [1],
                    river: '{}',
                    player_cards: '{}',
                    stack_sizes: { 1: 10000, 2: 10000, 3: 10000, 4: 10000, 5: 10000 },
                    contributions: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    active_players: [],
                    big_blind: 1,
                    turn: 2,
                    round: 1,
                    min_bet: 50
                },
            ])
            .eq("id", newServer);
    
        if (error) console.error("Error inserting server:", error);
        return
    };
    
    const iteratePlayerNum = async (playerNum, serverNum, supabase, servers) => {
        const playerArr = playerNum === 1 ? [1] : await servers[serverNum - 1].players
        playerArr.push(playerNum)
        await supabase
            .from("servers")
            .update({ players: playerArr })
            .eq("id", serverNum)
    };
    
    const findServer = async () => {
        const supabase = await createClient();
        let { data: servers } = await supabase.from('servers').select("*");
        let serverNum, playerNum, newServerCheck
        for (let i = 0; i < servers.length + 1; i++) {
            if (servers[i] === undefined) {
                newServerCheck = true
                serverNum = i + 1
                break;
            }
            if (servers[i].players.length < 5) {
                serverNum = servers[i].id
                for (let j = 1; j < 6; j++) {
                    if (!servers[serverNum - 1].players.includes(j)) {
                        playerNum = j
                        break;
                    }
                }
                break;
            }
        }
        if (newServerCheck) {
            await newServer(servers.length + 1, supabase);
            playerNum = 1
        }
        else {
            iteratePlayerNum(playerNum, serverNum, supabase, servers);
        }
        return `/${serverNum}/${playerNum}`;
    };

    const url = await findServer()
    let count = 0

    return (
        <div className="text-white text-center bg-gray-900 min-h-screen">
            {/* Navbar */}
            <nav className="flex justify-center items-center h-16 border-b-2 border-gray-600 bg-gray-800 shadow-lg">
                <Link href="/">
                    <h1 className="text-4xl font-extrabold text-white hover:text-gray-300 transition">
                        Card Cade
                    </h1>
                </Link>
            </nav>

            {/* Main Content */}
            <div className="mt-[30vh]">
                <h2 className="text-3xl font-semibold text-gray-200">Play Poker Now</h2>
                <Link href={url}
                    className={`mt-12 ${url === undefined} left-[25%] w-[50%] 400px:w-[40%] 400px:left-[30%] 500px:w-[30%] 500px:left-[35%] sm:w-[25%] sm:left-[37.5%] md:w-[20%] md:left-[40%] lg:w-[15%] lg:left-[42.5%] inline-block absolute bg-blue-600 hover:bg-blue-900 transition px-6 py-3 text-lg font-bold text-white rounded-2xl shadow-md`}
                >
                    Find a Tournament
                </Link>
                <button className="mt-12 -z-50 mx-auto block bg-blue-600 hover:bg-blue-900 transition px-6  py-3 text-lg font-bold text-white rounded-2xl shadow-md absolute">Find a table</button>
            </div>
        </div>
    );
}

//all sound
