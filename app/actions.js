"use server";

import { createClient } from "@/utils/supabase/server"

export async function sendValuesToServer(bet, serverObject, playerNum) {
    const comparison = async (set1) => {
        if (set1[0] === "high") {
            isNaN(set1[1][0]) ? set1[1][0] === "J" ? set1[1][0] = 11 : set1[1][0] === "Q" ? set1[1][0] = 12 : set1[1][0] === "K" ? set1[1][0] = 13 : set1[1][0] === "A" ? set1[1][0] = 14 : isNaN(set1[1][1]) ? set1[1][1] === "J" ? set1[1][1] = 11 : set1[1][1] === "Q" ? set1[1][1] = 12 : set1[1][1] === "K" ? set1[1][1] = 13 : set1[1][1] === "A" ? set1[1][1] = 14 : null : null : null
            const newArr = []
            Number(set1[1][0]) > Number(set1[1][1]) ? newArr.push(set1[1][0], set1[1][1]) : newArr.push(set1[1][1], set1[1][0])
            return [1, newArr]
        } else if (set1[0] === "pair") {
            isNaN(set1[1][0]) ? set1[1][0] === "J" ? set1[1][0] = 11 : set1[1][0] === "Q" ? set1[1][0] = 12 : set1[1][0] === "K" ? set1[1][0] = 13 : set1[1][0] === "A" ? set1[1][0] = 14 : null : null
            return [2, set1[1]]
        } else if (set1[0] === "twoPair") {
            isNaN(set1[1][0]) ? set1[1][0] === "J" ? set1[1][0] = 11 : set1[1][0] === "Q" ? set1[1][0] = 12 : set1[1][0] === "K" ? set1[1][0] = 13 : set1[1][0] === "A" ? set1[1][0] = 14 : isNaN(set1[1][1]) ? set1[1][1] === "J" ? set1[1][1] = 11 : set1[1][1] === "Q" ? set1[1][1] = 12 : set1[1][1] === "K" ? set1[1][1] = 13 : set1[1][1] === "A" ? set1[1][1] = 14 : null : null : null
            const newArr = []
            Number(set1[1][0]) > Number(set1[1][1]) ? newArr.push(set1[1][0], set1[1][1]) : newArr.push(set1[1][1], set1[1][0])
            return [3, newArr];
        } else if (set1[0] === "trips") {
            return [4, set1[1]];
        } else if (set1[0] === "straight") {
            return [5, set1[1]];
        } else if (set1[0] === "flush") {
            return [6, set1[1]];
        } else if (set1[0] === "full") {
            const count = [0]
            for (let i = 0; i < set1[1].length; i++) {
                isNaN(set1[1][i]) ? set1[1][i] === "J" ? set1[1][i] = 11 : set1[1][i] === "Q" ? set1[1][i] = 12 : set1[1][i] === "K" ? set1[1][i] = 13 : set1[1][i] === "A" ? set1[1][i] = 14 : null : null
                count[0] === 0 ? (count[0] = set1[1][i], count[1] = 1) : count[0] === set1[1][i] ? count[1] = count[1] + 1 : count[2] === 0 ? (count[2] = set1[1][i], count[3] = 1) : count[2] === set1[1][i] ? count[3] = count[3] + 1 : null
            }
            const newArr = []
            count[1] === 2 && count[3] === 1 ? newArr.push(count[0], count[2]) : count[3] === 2 && count[1] === 1 ? newArr.push(count[2], count[0]) : count[0] > count[2] ? newArr.push(count[0], count[2]) : newArr.push(count[2], count[0])
        } else if (set1[0] === "quads") {
            return [7, set1[1]];
        } else if (set1[0] === "strflu") {
            return [8, set1[1]];
        } else if (set1[0] === "royal") {
            return [9, set1[1]];
        } else {
            return "ERROR"
        }
    }

    const supabase = await createClient()
    const serverNum = serverObject.id
    const playerArr = serverObject.active_players
    let turn = Number(serverObject.turn)
    let round = Number(serverObject.round)
    let pot = Number(serverObject.pot)
    pot = pot + bet
    const minBet = serverObject.min_bet
    const activePlayers = serverObject.active_players
    let contributions = serverObject.contributions
    const updatedContributions = Object.keys(contributions).forEach(function (key, index) {
        if (key === playerNum) {
            return { ...key, playerNum: contributions[playerNum] + bet };
        }
        return key;
    });
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
                return inARow >= 5 ? [endOfStraight, inARow, sortedArr] : false
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

                return spadesArr.length >= 5 ? "spades" : heartsArr.length >= 5 ? "hearts" : diamondsArr.length >= 5 ? "diamonds" : clubsArr.length >= 5 ? "clubs" : false

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
            const straightFLush = straightFlushCheck(straight[1], straight[0], straight[2], flush)
            return straight ? flush ? straightFLush ? straightFLush : ["flush", flush] : ["straight", straightCheck()] : false
        }
        const straightOrFlush = straightAndFlushCheck()
        let highest = pairNumsArr
        if (straightOrFlush === "royal") {
            handType = "royal"
        } else if (handType === "quads") {
            return [handType, highest]
        } else if (straightOrFlush === "strflu") {
            handType = "strflu"
            highest = straightOrFlush[1]
        } else if (handType === "full") {
            return [handType, highest]
        } else if (straightOrFlush[0] === "flush") {
            handType = "flush"
            highest = straightOrFlush[1]
        } else if (straightOrFlush[0] === "straight") {
            handType = "straight"
            highest = straightOrFlush[1]
        } else if (handType === "high") {
            highest = [hand[1], hand[3]]
        }
        return highest !== undefined ? [handType, highest] : [handType]
    }
    if (round === 4) {
        const river = serverObject.river
        const mutiplier = (Number(playerNum) - 1) * 5
        const hand = []
        const player_cards = serverObject.player_cards
        hand.push(player_cards[mutiplier], player_cards[mutiplier + 1], player_cards[mutiplier + 2], player_cards[mutiplier + 3])
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
                active_players: [1, 2, 3, 4, 5],
                best_hand: [],
                min_bet: 50
            })
            .eq("id", serverNum)
    }
    let big_Blind = Number(serverObject.big_blind)
    bet >= minBet && round === 1 ? activePlayers.push(playerNum) : null
    let stackSizes = { ...serverObject.stack_sizes };
    const { data, error } = await supabase
        .from("servers")
        .update({ "stack_sizes": stackSizes, pot, pot, active_players: activePlayers, contributions: updatedContributions })
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
    } if (bet > serverObject.min_bet) {
        const { data, error } = await supabase
            .from("servers")
            .update({ "min_bet": bet })
            .eq("id", serverNum)
    }
    if ((round === 1 && turn !== big_Blind) || (round > 1 && big_Blind > 2 && turn !== big_Blind - 2) || (round > 1 && big_Blind < 3 && turn !== 5 + big_Blind - 2)) {
        turn === 5 ? turn = 1 : turn++
        while (!activePlayers.includes(Number(turn)) && activePlayers.length > 0 && round > 1) {
            turn === 5 ? turn = 1 : turn++
        }
        const { data, error } = await supabase
            .from("servers")
            .update({ "turn": turn })
            .eq("id", serverNum)
    }
    else {

        if (round === 1) {
            big_Blind === 5 ? turn = 1 : turn = big_Blind + 1
            round++
        } else if (round < 4) {
            big_Blind > 2 ? turn = big_Blind - 2 : big_Blind = 5 + big_Blind - 2
            round++

        } else {
            round = 1
            big_Blind === 5 ? big_Blind = 1 : big_Blind
            big_Blind === 5 ? turn = 1 : turn = big_Blind + 1
            const bestPlayer = async () => {
                const obj = { "1": null, "2": null, "3": null, "4": null, "5": null }
                const river = serverObject.river
                for (let i = 0; i < activePlayers.length; i++) {
                    const index = activePlayers[i]
                    const hand1 = [serverObject.player_cards[(index - 1) * 5], (serverObject.player_cards[(index - 1) * 5 + 1]), (serverObject.player_cards[(index - 1) * 5 + 2]), (serverObject.player_cards[(index - 1) * 5 + 3])]
                    const hand2 = [serverObject.player_cards[(index) * 5], (serverObject.player_cards[(index) * 5 + 1]), (serverObject.player_cards[(index) * 5 + 2]), (serverObject.player_cards[(index) * 5 + 3])]
                    const value1 = cardCheck(river, hand1)
                    const value2 = cardCheck(river, hand2)
                    obj[index] = await comparison(value1)
                }
                let bestNum
                let broken
                for (let i = 9; i > 0 && !broken; i--) {
                    for (let j = 1; j < 6; j++) {
                        if (obj[j] !== null && obj[j] !== undefined) {
                            if (obj[j].length > 0) {
                                if (obj[j][0] === i) {
                                    bestNum = (obj[j][0])
                                    broken = true
                                    break
                                }
                            }
                        } else if (obj[j] === 1) {
                            bestNum = (obj[j][0])
                            broken = true
                            break
                        }
                    }
                }
                const best = { 1: null, 2: null, 3: null, 4: null, 5: null };
                for (let i = 1; i < 6; i++) {
                    if (obj[i] !== null) {
                        best[i] = obj[i];
                    }
                }

                // Create an array of [key, value] pairs
                const arr = Object.entries(best);

                // Helper function to convert card faces to numeric values
                const convertCard = (card) => {
                    return card === "J" ? 11 : card === "Q" ? 12 : card === "K" ? 13 : card === "A" ? 14 : parseInt(card);
                };

                // Sorting logic
                for (var i = 0; i < arr.length; i++) {
                    for (var j = 0; j < arr.length - i - 1; j++) {
                        if (arr[j][1] !== null && arr[j + 1][1] !== null) {
                            // Compare primary value (arr[j][1][0])
                            if (arr[j][1][0] < arr[j + 1][1][0]) {
                                var temp = arr[j];
                                arr[j] = arr[j + 1];
                                arr[j + 1] = temp;
                            } else if (arr[j][1][0] === arr[j + 1][1][0]) {
                                // If primary values are equal, compare card ranks
                                let swapped = false;
                                for (let k = 0; k < arr[j][1][1].length; k++) {
                                    let card1 = convertCard(arr[j][1][1][k]);
                                    let card2 = convertCard(arr[j + 1][1][1][k]);
                                    if (card1 < card2) {
                                        var temp = arr[j];
                                        arr[j] = arr[j + 1];
                                        arr[j + 1] = temp;
                                        swapped = true;
                                        break;
                                    } else if (card1 > card2) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                const keyOrder = arr.map(item => item[0]);

                const sortedBest = Object.fromEntries(arr);

                return { best: sortedBest, order: keyOrder };


            }
            const best = await bestPlayer()
            let empty = false
            let index = 0
            const skipped = []
            while (!empty && index < 6) {
                const highest = best.order[index]
                for (let i = 0; i < 6; i++) {
                    i !== best ? (stackSizes[highest] = stackSizes[highest] + contributions[i], stackSizes[i] = stackSizes[i] - contributions[i]) : null
                }
                index++
            }
            console.log(contributions, stackSizes)
            //loop through bestPlayer and shiz and subtract from pot and shiz   
            const { data, error } = await supabase
                .from("servers")
                .update({ "round": round, "turn": turn, big_blind: big_Blind, stack_sizes: stackSizes })
            roundRestart()
        }
        let t = big_Blind === 5 ? t = 1 : t = big_Blind + 1
        const { data, error } = await supabase
            .from("servers")
            .update({ "round": 1, "turn": t, "big_blind": big_Blind, "stack_sizes": stackSizes, "contributions": { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } })
            .eq("id", serverNum)
    }
}
