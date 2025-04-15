"use server"

import Link from "next/link"
import { createClient } from '@/utils/supabase/server';
import { headers } from "next/headers";
import ActionButtons from "../../../components/actionButtons"
import cardFunct from "../../../components/cardFunct"

export default async function page() {
    const headerList = await headers()
    const pathname = await headerList.get("x-current-path");
    const serverNum = pathname[1]
    const playerNum = pathname[3]
    const supabase = await createClient()
    const { data: servers} = await supabase
        .from("servers")
        .select("*")
    const hand = []
    const river = []
    const cards = { "spades": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "hearts": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "diamonds": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "clubs": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] }
    const activePlayers = servers[serverNum - 1].active_players
    let turn = servers[serverNum - 1].turn
    const round = servers[serverNum - 1].round
    const bigBlind = servers[serverNum - 1].big_blind
    if (bigBlind === null) {
      const { data, error } = await supabase
                .from('servers')
                .update({ "big_Blind": 1 })
                .eq('id', serverNum)
    }
    let stackSize = servers[serverNum - 1][playerNum];

    
    // starts game if none and min 2 players
    if (round === null && activePlayers >= 2) {
      const { data, error } = await supabase
                .from('servers')
                .update({ "round": 1 })
                .eq('id', serverNum)
    }
  
    const cardGen = (type) => {
      let num1 = Math.ceil(Math.random() * 4)
      let suit = num1 === 1 ? "spades" : num1 === 2 ? "hearts" : num1 === 3 ? "diamonds" : "clubs"
      let num2
      while (cards[suit][num2] === undefined) {
        num2 = Math.floor(Math.random() * 13)
      }
      const card = cards[suit][num2]
      delete cards[suit][num2]
      type === "hand" ? (hand.push(suit, `${card}`)) : river.push(suit, `${card}`)
      return <>
        {cardFunct(suit, card)}
      </>
    }

    //card gen
    const generateCards = async (serverNum, playerNum) => {
      for (let i = 0; i < hand.length; i++) {
        hand.pop()
      }
      // ensures empty hands - no need for river as it is condition for funct to be called 
      for (let i = 1; i < 6; i++) {
        cardGen("river",i)
      }
      for (let i = 1; i < 6; i++) {
        cardGen("hand",1)
        cardGen("hand",2)
        hand.push(i)
      }
      //river and hand gen for each player
      const { data, error } = await supabase
              .from('servers')
              .update({ player_cards: hand, river: river })
              .eq('id', serverNum)
              .select()
      //updates db
    }

    

      // resets turn to be appropriate for each round if turn is undefined or 6
      if (turn === null || turn === undefined || turn === 6 || turn === 0) {
        const big_blind = servers[serverNum - 1].big_blind
        round === 1 ? bigBlind === 5 ? turn = 1 : turn = bigBlind + 1 : bigBlind < 3 ? turn = 3 + bigBlind : turn = bigBlind - 2
        const { data, error } = await supabase
                .from('servers')
                .update({ "turn": turn })
                .eq('id', serverNum)
      }

      //if river hasn't been generate then the generate funct is called
      if (servers[serverNum - 1].river === null || servers[serverNum - 1].river.length === 0) {
        generateCards(serverNum, playerNum)
      }

      //if no active players then it is updated
      if (servers[serverNum - 1].active_players === undefined && round === 1) {
        const arr = []
        for (let i = 1; i < servers[serverNum - 1].players + 1; i++) {
          arr.push(i)
        }
        const { data, error } = await supabase
                .from('servers')
                .update({ "active_players": arr })
                .eq('id', serverNum)
      }
    //displays nav bar and components
    return <>
      <nav className="flex flex-row flex-nowrap h-[7vh] justify-evenly text-white w-[100vw] border-b-2 border-gray-600">
            <Link className="inline" href="/">
                <h1 className="text-3xl inline mx-auto top-[1vh] font-extrabold relative">Card Cade {}</h1>    
            </Link>
      </nav>
      <ActionButtons serverObject={servers[serverNum -1]} playerNum={playerNum} />
    </>
  }