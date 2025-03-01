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
    const turn = servers[serverNum - 1].turn
    const minBet = servers[serverNum - 1].min_bet
    let potSize = 2
    const round = servers[serverNum - 1].round
    if (round === null) {
      const { data, error } = await supabase
                .from('servers')
                .update({ "round": 1 })
                .eq('id', serverNum)
    }
    
  
    const cardGen = (type) => {
      const cards = { "spades": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "hearts": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "diamonds": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"], "clubs": [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"] }
      let num1 = Math.ceil(Math.random() * 4)
      let suit = num1 === 1 ? "spades" : num1 === 2 ? "hearts" : num1 === 3 ? "diamonds" : "clubs"
      let num2 
      let copy = true
      while (copy) {
        copy = false
        num2 = Math.floor(Math.random() * 13)
        for (let i = 0; i < 10;i = i + 2) {
          if (servers[serverNum - 1].river[i] === null || (servers[serverNum - 1].river[i] === suit && servers[serverNum - 1].river[i + 1] === num2)) {
            copy = true
            break
          }
        } if (!copy) {
          for (let i = 0; i < 30; i = i + 2) {
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
      if (playerNum === "1") {
          for (let i = 1; i < 6; i++) {
              cardGen("river",i)
          }
          
          const { data, error } = await supabase
              .from('servers')
              .update({ river: river })
              .eq('id', serverNum)
              .select()
      }
      for (let i = 1; i < 7; i++) {
        cardGen("hand",1)
        cardGen("hand",2)
        hand.push(i)
      }
      const { data, error } = await supabase
              .from('servers')
              .update({ player_cards: hand })
              .eq('id', serverNum)
              .select()
    }

    const cardCheck = () => {
      let handType = "high"
      const pairNumsArr = []
      const pairCheck = () => {
        let previouslyChecked = []
        hand[1] === hand[3] ? (pairNumsArr.push(hand[1])) : ""
        for (let i = 1; i <= 9; i = i + 2) {
          if (hand[1] === river[i] || hand[3] === river[i]) {
            pairNumsArr.push(river[i])
            previouslyChecked.push(i)
          }
          for (let j = 3; j <= 9; j = j + 2) {
            if (j !== i && river[i] === river[j]) {
              !previouslyChecked.includes(i) ? pairNumsArr.push(river[i]) : ""
              previouslyChecked.push(i, j)
            }
          }
        }
        return pairNumsArr
      }
  
      pairCheck()
      let pairNum1
      let pairNum2
      let pairNum3
      let pairNum1Count = 0
      let pairNum2Count = 0
      let pairNum3Count = 0
      for (let i = 0; i < pairNumsArr.length; i++) {
        pairNum1 === undefined || pairNum1 === pairNumsArr[i] ? (pairNum1 = pairNumsArr[i], pairNum1Count++) : pairNum2 === undefined || pairNum2 === pairNumsArr[i] ? (pairNum2 = pairNumsArr[i], pairNum2Count++) : (pairNum3 = pairNumsArr[i], pairNum3Count++)
      }
      let pairNum
      pairNum1Count === 1 ? (handType = "pair", pairNum = pairNum1) : pairNum2Count === 1 ? (handType = "pair", pairNum = pairNum2) : pairNum3Count === 1 ? (handType = "pair", pairNum = pairNum3Count) : ""
      pairNum1Count === 2 ? (handType = "trips", pairNum = pairNum1) : pairNum2Count === 2 ? (handType = "trips", pairNum = pairNum2) : pairNum3Count === 2 ? (handType = "trips", pairNum = pairNum3Count) : ""
      pairNum1Count === 3 ? (handType = "quads", pairNum = pairNum1) : pairNum2Count === 3 ? (handType = "quads", pairNum = pairNum2) : pairNum3Count === 3 ? (handType = "quads", pairNum = pairNum3Count) : ""
      const pairNums = []
      if (handType === "trips") {
        if (pairNum1Count === 2) {
          pairNum2Count === 1 ? (handType = "full", pairNums.push(pairNum), pairNums.push(pairNum2)) : pairNum3Count === 1 ? (handType = "full", pairNums.push(pairNum), pairNums.push(pairNum3)) : ""
        }
        else if (pairNum2Count === 2) {
          pairNum1Count === 1 ? (handType = "full", pairNums.push(pairNum), pairNums.push(pairNum1)) : pairNum3Count === 1 ? (handType = "full", pairNums.push(pairNum), pairNums.push(pairNum3)) : ""
        }
        else if (pairNum3Count === 2) {
          pairNum2Count === 1 ? (handType = "full", pairNums.push(pairNum), pairNums.push(pairNum2)) : pairNum2Count === 1 ? (handType = "full", pairNums.push(pairNum), pairNums.push(pairNum2)) : ""
        }
      } else if (handType === "pair") {
        if (pairNum1Count === 1) {
          pairNum2Count === 1 ? (handType = "twoPair", pairNums.push(pairNum), pairNums.push(pairNum2)) : pairNum3Count === 1 ? (handType = "twoPair", pairNums.push(pairNum), pairNums.push(pairNum3)) : ""
        }
        else if (pairNum2Count === 1) {
          pairNum1Count === 1 ? (handType = "twoPair", pairNums.push(pairNum), pairNums.push(pairNum1)) : pairNum3Count === 1 ? (handType = "twoPair", pairNums.push(pairNum), pairNums.push(pairNum3)) : ""
        }
        else if (pairNum3Count === 1) {
          pairNum2Count === 1 ? (handType = "twoPair", pairNums.push(pairNum), pairNums.push(pairNum2)) : pairNum2Count === 1 ? (handType = "twoPair", pairNums.push(pairNum), pairNums.push(pairNum2)) : ""
        }
      }
      // do pair and stuff comparison
      const straightAndFlushCheck = () => {
        const cardValsArr = ["J", "Q", "K", "A"]
        const straightCheck = () => {
          const unsortedArr = []
          unsortedArr.push(isNaN(hand[1]) ? Number(11 + cardValsArr.indexOf(hand[1])) : Number(hand[1]))
          unsortedArr.push(isNaN(hand[3]) ? Number(11 + cardValsArr.indexOf(hand[3])) : Number(hand[3]))
          for (let i = 1; i < 10; i = i + 2) {
            unsortedArr.push(isNaN(river[i]) ? Number(11 + cardValsArr.indexOf(river[i])) : Number(river[i]))
          }
          for (let i = 1; i < unsortedArr.length; i++) {
            let currentValue = unsortedArr[i]
            let j
            for (j = i - 1; j >= 0 && unsortedArr[j] > currentValue; j--) {
              unsortedArr[j + 1] = unsortedArr[j]
            }
            unsortedArr[j + 1] = currentValue
          }
          const sortedArr = unsortedArr
          sortedArr.includes(14) ? sortedArr.unshift(1) : ""
          let inARow = 1
          let endOfStraight
          for (let i = 0; i < 7; i++) {
            if (sortedArr[i] === (sortedArr[i - 1] + 1)) {
              inARow++
            } else if (sortedArr[i] === sortedArr[i - 1]) {
              continue
            } else if (inARow >= 5) {
              endOfStraight = i
              break
            } else {
              inARow = 0
            }
          }
          return inARow >= 5 ? [inARow, endOfStraight, sortedArr] : false
        }
        const flushCheck = () => {
          let spadesArr = []
          let heartsArr = []
          let diamondsArr = []
          let clubsArr = []
          hand[0] === "spades" ? spadesArr.push(hand[1]) : hand[0] === "hearts" ? heartsArr.push(hand[1]) : hand[0] === "diamonds" ? diamondsArr.push(hand[1]) : clubsArr.push(hand[1])
          hand[2] === "spades" ? spadesArr.push(hand[3]) : hand[2] === "hearts" ? heartsArr.push(hand[3]) : hand[2] === "diamonds" ? diamondsArr.push(hand[3]) : clubsArr.push(hand[3])
          for (let i = 0; i < 9; i = i + 2) {
            river[i] === "spades" ? spadesArr.push(river[i + 1]) : river[i] === "hearts" ? heartsArr.push(river[i + 1]) : river[i] === "diamonds" ? diamondsArr.push(river[i + 1]) : clubsArr.push(river[i + 1])
          }
  
          return spadesArr.length >= 5 ? spadesArr : heartsArr.length >= 5 ? heartsArr : diamondsArr.length >= 5 ? diamondsArr : clubsArr.length >= 5 ? clubsArr : false
  
        }
        const straightFlushCheck = (straightLength, straightEnd, sorted, flushArr) => {
          let count = 0
          for (let i = 0; i < straightLength; i++) {
            if (flushArr.length > 0 && flushArr.includes(sorted[straightEnd - i])) {
              count++
            }
          }
          if (count >= 5 && sorted[straightEnd] === 14) {
            return "royal"
          } else if (count >= 5) {
            top = sorted[straightEnd] > 11 ? cardValsArr[sorted[straightEnd - 11]] : sorted[straightEnd]
            return ["strflu", top]
          } else {
            return false
          }
        }
  
        const straight = straightCheck()
        const flush = flushCheck()
        const straightFLush = straightFlushCheck(straight[0], straight[1], straight[2], flush)
        return straight ? flush ? straightFLush ? straightFLush : ["flush", flush] : ["straight", straightCheck()] : false
      }
      const straightOrFlush = straightAndFlushCheck()
      let highest = pairNumsArr
      if (straightOrFlush === "royal") {
        handType = "royal"
      } else if (handType === "quads") {
        return handType
      } else if (straightOrFlush === "strflu") {
        handType = "strflu"
        highest = straightOrFlush[1]
      } else if (handType === "full") {
        return handType
      } else if (straightOrFlush[0] === "flush") {
        handType = "flush"
        highest = straightOrFlush[1]
      } else if (straightOrFlush[0] === "straight") {
        handType = "straight"
        highest = straightOrFlush[1]
      }
      return highest !== undefined ? [handType, highest] : [handType]
    }

 
      if (turn === null || turn === undefined || turn === 7) {
        const { data, error } = await supabase
                .from('servers')
                .update({ "turn": 1 })
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
      
    const riverDB = servers[serverNum - 1].river
    const handDB = servers[serverNum - 1].player_cards
    const numOfPlayers = Number(servers[serverNum - 1].players)
    const stackSize = servers[serverNum - 1].stack_sizes[playerNum]

    return <>
      <nav className="flex flex-row flex-nowrap h-[7vh] justify-evenly text-white w-[100vw] border-b-2 border-gray-600">
            <Link className="inline" href="/">
                <h1 className="text-3xl inline mx-auto top-[1vh] font-extrabold relative">Card Cade {}</h1>    
            </Link>
      </nav>
      <ActionButtons minBet = {minBet} turn = {turn} potSize = {potSize} stackSize = {stackSize} serverNum={serverNum} playerNum={playerNum} round={round} river={riverDB} player_cards={handDB} numOfPlayers={numOfPlayers}/>
    </>
  }

  /*export async function updateFunct (round){
    
    const supabase = await createClient()
    const { data: servers} = await supabase
        .from("servers")
        .select("*")
    const headerList = await headers()
    const pathname = await headerList.get("x-current-path");
    const serverNum = pathname[1]
    const turn = servers[serverNum - 1].turn
    if (turn === null || turn === undefined || turn === 7) {
      const { data, error } = await supabase
              .from('servers')
              .update({ "turn": 1 })
              .eq('id', serverNum)
    }
    if (servers[serverNum - 1].river === null || servers[serverNum - 1].river.length === 0) {
      generateCards(serverNum, playerNum)
    } 
    if (turn === 1) {
      round === 5 ? round = 1 : round++
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
    }*/