import Link from "next/link"
import { createClient } from '@/utils/supabase/server';
import { headers } from "next/headers";
import ActionButtons from "../../../components/actionButtons"


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
    if (round === null && activePlayers >= 2) {
      const { data, error } = await supabase
                .from('servers')
                .update({ "round": 1 })
                .eq('id', serverNum)
    }
    
    const cardFunct = (suit, num) => {
      const spade = () => {
        return <>
          <div className="circle one"></div>
          <div className="circle two"></div>
          <div className="diag spade-left"></div>
          <div className="diag spade-right"></div>
          <div className="spade-block"></div>
          <div className="spade-stem"></div>
        </>
      }
  
      const hearts = () => {
        return <>
          <div className="heart-circle heart-one"></div>
          <div className="heart-circle heart-two"></div>
          <div className="heartDiag heartLeft"></div>
          <div className={`heartDiag heartRight`}></div>
          <div className="heart-block"></div>
        </>
      }
  
      const diamonds = () => {
        return <>
          <div className="rhombus"></div>
          <div className="out-take diamond-one"></div>
          <div className="out-take diamond-two"></div>
          <div className="out-take diamond-three"></div>
          <div className="out-take diamond-four"></div>
        </>
      }
  
      const clubs = () => {
        return <>
          <div className="club-circle club-one"></div>
          <div className="club-circle club-two"></div>
          <div className="club-circle club-three"></div>
          <div className="club-circle club-four"></div>
          <div className="clubStem"></div>
        </>
      }
  
      return <div className={`bg-gray-600 flex flex-col w-[80px] h-[120px] rounded-md border-[1px] border-white`}>
        <div className="relative left-1 text-sm  font-bold top-1">{num}</div>
        <div className={`absolute w-[80px] top-[20px] h-[80px]`}>
          {suit === "spades" ? <div className="absolute left-[17.5px] w-[100%] h-[100%] top-[30px]">{spade()}</div> : suit === "hearts" ? <div className="left-[17px] top-[21px] w-[100%] h-[100%] absolute">{hearts()}</div> : suit === "diamonds" ? <div className="absolute left-[10px] top-[15.5px] w-[100%] h-[100%]">{diamonds()}</div> : <div className="absolute left-[-1px] top-[15px] w-[100%] h-[100%]">{clubs()}</div>}
        </div>
      </div>
    }
  
    const cardGen = (type) => {
      const cards = { "spades": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "hearts": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "diamonds": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "clubs": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] }
      let num1 = Math.ceil(Math.random() * 4)
      let suit = num1 === 1 ? "spades" : num1 === 2 ? "hearts" : num1 === 3 ? "diamonds" : "clubs"
      let num2 
      let copy = true
      while (copy) {
        const cardVals = ["J","Q","K","A"]
        copy = false
        num2 = Math.floor(Math.random() * 13)
        let num2Plus = num2 + 2
        num2Plus === 1 ? num2Plus = "A" : num2Plus > 10 ? num2Plus = cardVals[num2Plus - 11] : null  
        for (let i = 0; i < 10;i = i + 2) {
          if (servers[serverNum - 1].river[i] === null || (servers[serverNum - 1].river[i] === suit && servers[serverNum - 1].river[i + 1] === num2Plus) || (servers[serverNum - 1][i] === suit && servers[serverNum - 1].river[i + 1] === num2)) {
            copy = true
            break
          }
        } if (!copy) {
          for (let i = 0; i < 25; i = i + 2) {
            if (i % 5 === 0 && i > 0) {
              i++
            } else if (servers[serverNum - 1].player_cards[i] === null || (servers[serverNum - 1].player_cards[i] === suit && servers[serverNum - 1].player_cards[i + 1] === num2)) {
              copy = true
              break
            }
          }
        }
      }  
      const card = cards[suit][num2]
      delete cards[suit][num2]
      type === "hand" ? (hand.push(suit, `${card}`)) : river.push(suit, `${card}`)
      return <>
        {cardFunct(suit, card)}
      </>
    }


    const generateCards = async (serverNum, playerNum) => {
      for (let i = 0; i < hand.length; i++) {
        hand.pop()
      }
      for (let i = 0; i < river.length; i++) {
        river.pop()
      }
          for (let i = 1; i < 6; i++) {
              cardGen("river",i)
          }
          
      for (let i = 1; i < 6; i++) {
        cardGen("hand",1)
        cardGen("hand",2)
        hand.push(i)
      }
      const { data, error } = await supabase
              .from('servers')
              .update({ player_cards: hand, river: river })
              .eq('id', serverNum)
              .select()
    }

    

 
      if (turn === null || turn === undefined || turn === 6) {
        const big_blind = servers[serverNum - 1].big_blind
        bigBlind === 5 ? turn = 1 : turn = bigBlind + 1
        const { data, error } = await supabase
                .from('servers')
                .update({ "turn": turn })
                .eq('id', serverNum)
      }
      if (servers[serverNum - 1].river === null || servers[serverNum - 1].river.length === 0) {
        generateCards(serverNum, playerNum)
      }
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

    return <>
      <nav className="flex flex-row flex-nowrap h-[7vh] justify-evenly text-white w-[100vw] border-b-2 border-gray-600">
            <Link className="inline" href="/">
                <h1 className="text-3xl inline mx-auto top-[1vh] font-extrabold relative">Card Cade {}</h1>    
            </Link>
      </nav>
      <ActionButtons serverObject={servers[serverNum -1]} playerNum={playerNum} />
    </>
  }