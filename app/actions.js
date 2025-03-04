"use server";

import { createClient } from "@/utils/supabase/server"

export async function sendValuesToServer(bet, serverObject, playerNum) {
    const supabase = await createClient()
    const serverNum = serverObject.id
    const playerArr = serverObject.active_players
    let turn = Number(serverObject.turn)
    let round = Number(serverObject.round)
    let pot = Number(serverObject.pot)
    pot = pot + bet
    const minBet = serverObject.min_bet
    const activePlayers = serverObject.active_players
    // get vars

    const cardCheck = (river, hand) => {
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
    if (round === 5) {
        const river = serverObject.river
        const mutiplier = (Number(playerNum) - 1) * 5
        const hand = []
        const player_cards = serverObject.player_cards
        hand.push(player_cards[mutiplier], player_cards[mutiplier + 1], player_cards[mutiplier + 2], player_cards[mutiplier + 3])
        const best = { "card": cardCheck(river, hand), "num": playerNum }
        const bestDb = serverObject.best_hand
        if (!isNaN(best.card[1])) {
            const arrValues = ["J", "Q", "K", "A"];
            best.card[1] !== undefined && best.card[1] !== playerNum ? best.card[1] = 10 + arrValues.indexOf(best.card[1]) : null;
        }
        const comparison = async (i) => {
            if (bestDb === null) {
                const arr = [];
                arr.push(best)
                const { data, error } = await supabase
                    .from("servers")
                    .update({ best_hand: arr })
                    .eq("id", serverNum);
            } else {
                if (bestDb.card[0] !== "royal") {
                    if (bestDb.card[0] === "strflu") {
                        if (best.card[0] === "royal" || (best.card[0] === "strflu" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "quads") {
                        if ((best.card[0] === "strflu" || best.card[0] === "royal") || (best.card[0] === "quads" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "full") {
                        if ((best.card[0] === "quads" || best.card[0] === "strflu" || best.card[0] === "royal") || (best.card[0] === "full" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "flush") {
                        if ((best.card[0] === "quads" || best.card[0] === "full" || best.card[0] === "strflu" || best.card[0] === "royal") || (best.card[0] === "flush" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "straight") {
                        if ((best.card[0] !== "high" && best.card[0] !== "pair" && best.card[0] !== "trips" && best.card[0] !== "straight" && best.card[0] !== "twoPair") || (best.card[0] === "straight" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "trips") {
                        if ((best.card[0] !== "high" && best.card[0] !== "pair" && best.card[0] !== "twoPair" && best.card[0] !== "trips") || (best.card[0] === "trips" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "twoPair") {
                        if ((best.card[0] !== "high" && best.card[0] !== "pair" && best.card[0] !== "trips") || (best.card[0] === "twoPair" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "pair") {
                        if ((best.card[0] !== "high" && best.card[0] !== "pair") || (best.card[0] === "pair" && best.card[1] > bestDb.card[1])) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    } else if (bestDb.card[0] === "high") {
                        if (best.card[0] !== "high" || best.card[1] > bestDb.card[1]) {
                            const arr = [];
                            arr.push(best);
                            const { data, error } = await supabase
                                .from("servers")
                                .update({ best_hand: arr })
                                .eq("id", serverNum);
                        }
                    }
                }
            }
        }

    }

    const roundRestart = async (round) => {
        round = 1
        const river = []
        const hand = []
        const activePlayers = []
        const { data, error } = await supabase
            .from("servers")
            .update({
                river: [],
                player_cards: [],
                active_players: [],
                best_hand: null,
                min_bet: 50
            })
            .eq("id", serverNum)
    }
    let big_Blind = Number(serverObject.big_blind)
    bet >= minBet && round === 1 ? activePlayers.push(playerNum) : null
    let stackSizes = { ...serverObject.stack_sizes };
    const { data, error } = await supabase
        .from("servers")
        .update({ "stack_sizes": stackSizes, pot, pot, active_players: activePlayers })
        .eq('id', serverNum);
    if (bet === 0) {

        const newArr = []
        for (let i = 0; i < playerArr.length; i++) {
            playerArr[i] !== playerNum ? newArr.push(playerArr[i]) : ""
        }
        const { data, error } = await supabase
            .from('servers')
            .update({ "active_players": newArr })
            .eq("id", serverNum)
// add best hand arr functionality and make side pots and all revisit on raise.
    } else if (bet > serverObject.min_bet) {
        const { data, error } = await supabase
            .from("servers")
            .update({ "min_bet": bet })
            .eq("id", serverNum)
    }
    if ((round === 1 && turn !== big_Blind) || (round > 1 && turn > 3 && turn !== big_Blind - 2) || (round > 1 && turn < 3 && turn !== 7 - big_Blind)) {
        while (!activePlayers.includes(turn) && activePlayers.length) {
            turn === 6 ? turn = 1 : turn++
        }
        const { data, error } = await supabase
            .from("servers")
            .update({ "turn": turn })
            .eq("id", serverNum)
    }
    else {

        if (round === 1) {
            big_Blind === 6 ? turn = 1 : turn = big_Blind + 1
            round++
        } else if (round < 5) {
            big_Blind > 2 ? turn = big_Blind - 2 : turn = 7 - big_Blind
            round++

        } else {
            roundRestart()
            round = 1
            big_Blind === 6 ? big_Blind = 1 : big_Blind++
            const bestDb = serverObject.best_hand
            stackSizes[Number(bestDb.num)] = stackSizes[Number(bestDb.num)] + pot
            console.log("\n\n\n\n\n\n ", stackSizes, bestDb.num, stackSizes[Number(bestDb.num)], pot)
            const { data, error } = await supabase
                .from("servers")
                .update({ "round": round, "turn": turn, big_blind: big_Blind, stack_sizes: stackSizes })
        }

        const { data, error } = await supabase
            .from("servers")
            .update({ "round": round, "turn": turn, "big_blind": big_Blind, "stack_sizes": stackSizes })
            .eq("id", serverNum)
    }
}
