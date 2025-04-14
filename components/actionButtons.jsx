"use client"

import {useState, useEffect} from "react"
import { sendValuesToServer } from "../app/actions";
import { useRouter } from 'next/navigation';

export default function page({serverObject, playerNum}) {
    const [bet, setBet] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)
    const [load, setLoad] = useState(false)
    const pNum = Number(playerNum)
    const router = useRouter();
    let round = Number(serverObject.round)
    let turn = Number(serverObject.turn)
    let stackSizeDB = serverObject.stack_sizes[playerNum]
    const [stackSize, setStackSize] = useState(Number(stackSizeDB))
    const player_cards = serverObject.player_cards
    const contributions = Number(serverObject.contributions[playerNum])
    let minBet = serverObject.min_bet - contributions
    const numOfPlayers = serverObject.players
    const river = serverObject.river
    const bigBlind = Number(serverObject.big_blind)
    bigBlind === playerNum ? setBet(50) : bigBlind - 1 === playerNum ? setBet(25) : null

    

    useEffect(() => {
      console.log(JSON.stringify(stackSize) === `null`, JSON.stringify(stackSize))
      if (stackSize === undefined || stackSize === null || JSON.stringify(stackSize) === `null`) {
          if (localStorage.getItem("stackSize") === null || Number(localStorage.getItem("stackSize")) <= 0) {
            localStorage.setItem("stackSize", "10000")
          }
          setStackSize(10000)
          setStackSize(Number(localStorage.getItem("stackSize")))
      }
      if((bigBlind === 5 && turn === 1 && round === 5) || (turn === bigBlind + 1 && round === 1)) { 
        localStorage.setItem("stackSize",`${stackSize}`)
      }
      router.refresh()
    }, [serverObject.turn])
    //turn skipping on rounds after first and handling first turn after big blind 
    
    const foldFunct = async() => {
        setBet(0)
        await sendValuesToServer(bet,serverObject,playerNum,stackSize)
        router.refresh()
    }

    const checkCallFunct = async () => {
        contributions - minBet < 0 ? setBet(stackSize - contributions) : setBet(minBet) 
        await sendValuesToServer(bet,serverObject,playerNum,stackSize);
        router.refresh()
    }

    const raiseFunct = async () => {
        await sendValuesToServer(bet,serverObject,playerNum,stackSize)
        router.refresh()
    }

    const leaveFunct = async () => {
      await sendValuesToServer("leave",serverObject,playerNum)
      setTimeout(() => router.push("/"), 100);
    }

    /*if (stackSize === 0) {
      leaveFunct()
    }*/

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

    const cardFetch = (type, num) => {
        let suit
        let card
        if (type === "river") {
          suit = river[(num - 1) * 2]
          card = river[(num * 2) - 1]
        } else {
          const cardNum  = (playerNum - 1) * 5 + ((num - 1) * 2)
          suit = player_cards[cardNum]
          card = player_cards[cardNum + 1]
        }
        return cardFunct(suit, card); 
      }
    const currentStack = stackSize - contributions
    return <>
    <button onClick={leaveFunct} className="w-[10vw] h-[7.5vh] relative left-[1vw] top-[1vh] bg-[#616161] bg-opacity-90 rounded-2xl">Leave</button>
      <div className="w-[100vw] absolute top-[57.5vh] h-[30vh]">
          <div className="text-white w-[5vw] absolute -top-[20vh] left-0">MB{serverObject.min_bet }{" "}T { serverObject.turn }{" "}R{ serverObject.round }{" "}BB {serverObject.big_blind}{" "}{ JSON.stringify(serverObject.stack_sizes)}{JSON.stringify(serverObject.contributions)}</div>
        <div id="your-hand" className="mx-auto w-[120px] h-[100%]">
          <div className="relative -rotate-[10deg] mx-auto -left-[30px] z-10 -top-[10px] w-[80px]">{cardFetch("player_cards",1)}</div>
          <div className="relative rotate-[10deg] mx-auto -top-[130px] z-10 left-[30px] w-[80px]">{cardFetch("player_cards",2)}</div>
          <div className="text-white absolute text-center mx-auto w-[120px] top-[20vh]">{`${currentStack}`}</div>
          <div className={`${Number(playerNum) === turn ? "border-[6px] animate-pulse border-green-400" : "border-[1px]"} bg-gray-600 relative -left-[40px] -top-[290px] z-0 flex flex-col w-[200px] h-[200px] rounded-full border-[1px] border-white`}></div>
          <div className={`bg-lime-400 w-[3vw] h-[3vw] rounded-full text-gray-900 m-auto text-center py-[9px] font-bold absolute left-[53vw] top-[17vh] ${serverObject.big_blind === Number(playerNum) ? "block": "hidden"}`}>BB</div>
          <div className=" text-black absolute top-[29vh] left-[25vw] w-[50vw] h-[20vw]">
              <div className="flex absolute justify-between w-[50vw] h-[20vh]">
              <button onClick={turn === pNum ? foldFunct : null} className="w-[15vw] h-[10vh] bg-[#D32F2F] bg-opacity-70 rounded-2xl">Fold</button>
              <button onClick={turn === pNum ? checkCallFunct : null} className="w-[15vw] h-[10vh] bg-[#388E3C] bg-opacity-70 rounded-2xl">{minBet === 0 ? "check" : "call"}</button>
              <button onClick={() => {bet !== 0 /* only executes when a raise occurs */ ? (raiseFunct(), setMenuOpen(false)) : turn === pNum ? (setMenuOpen(!menuOpen) , !load ? setLoad(true) : null) : null}} className="w-[15vw] bg-opacity-70 h-[10vh] bg-[#1976D2] rounded-2xl z-30">Raise</button>
              <div className={`bg-blue-400 absolute left-[36vw] w-[13vw] rounded-t-2xl ${menuOpen ? "h-[10vh] -top-[10vh] opacity-100 z-20 animate-comeUp" : load ? "h-0 top-0 animate-comeDown" : "h-0 top-0" }`}>
                <div className="flex mx-auto justify-evenly flex-nowrap flex-row">
                  <button onClick={() => {bet > minBet + 50  ? setBet(bet - 50) : setBet(minBet + 50)}} className={`relative pb-3 top-[5vh] rounded-lg border-2  w-[4vw] h-[4vh] border-gray-700 bg-gray-500 ${menuOpen ? "block" : "hidden"}`}>
                    -50
                  </button>
                  <button className={`relative pb-2 top-[5vh] rounded-lg border-2 border-gray-800  w-[4vw] transition-opacity ease-out duration-75 delay-50 ${menuOpen ? " h-[4vh] opacity-100 z-20" : load ? "h-0 top-0 opacity-0" : "opacity-0 h-0 top-0"}`}>
                    {bet > Number(minBet) + 50 ? bet : minBet  +50}
                  </button>
                  <button onClick={() => {stackSize > contributions + 50 + bet ? setBet(bet + 50) : setBet(stackSize - contributions)}} className={`relative pb-3 top-[5vh] rounded-lg border-2  w-[4vw] h-[4vh] border-gray-700 bg-gray-500 ${menuOpen ? "block" : "hidden"}`}>
                    +50
                    <div className="absolute -top-96 left-0">{}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100vw] h-[100vh]">
        <div className=" absolute left-[15vw] top-[65vh]">
          <div className={`${numOfPlayers >= 2 ? "block" : "block"} ${Number(playerNum) < 5 ? turn === Number(playerNum) + 1 ? "border-[6px] animate-pulse border-green-400" : "border-[1px]" : turn  === Number(playerNum) - 4 ? "border-[6px] animate-pulse border-green-500" : "border-[1px]"} bg-gray-600 flex flex-col w-[120px] h-[120px] rounded-full border-[1px] border-white`}></div>
          <div className={`absolute left-[5.5vw] top-[13vh] bg-lime-400 w-[3vw] h-[3vw] rounded-full text-gray-900 m-auto text-center py-[9px] font-bold ${pNum < 5 ? serverObject.big_blind === pNum + 1 ? "block": "hidden": serverObject.big_blind === pNum - 4? "block": "hidden" }`}>BB</div>
        </div>
        <div className="absolute left-[15vw] top-[9vh]">
          <div className={`${numOfPlayers >= 3 ? "block" : "block"} ${Number(playerNum) < 4 ? turn === Number(playerNum) + 2 ? "border-[6px] animate-pulse border-green-400" : "border-[1px]" : turn  === Number(playerNum) - 3 ? "border-[6px] animate-pulse border-green-500" : "border-[1px]"} bg-gray-600 flex flex-col w-[120px] h-[120px] rounded-full border-[1px] border-white`}></div>
          <div className={`absolute left-[5.5vw] top-[13vh] bg-lime-400 w-[3vw] h-[3vw] rounded-full text-gray-900 m-auto text-center py-[9px] font-bold ${pNum < 4 ? serverObject.big_blind === pNum + 2 ? "block": "hidden": serverObject.big_blind === pNum - 3? "block": "hidden" }`}>BB</div>
        </div>
        <div className="absolute right-[15vw] top-[9vh]">
          <div className={`${numOfPlayers >= 4 ? "block" : "block"} ${Number(playerNum) < 3 ? turn === Number(playerNum) + 3 ? "border-[6px] animate-pulse border-green-400" : "border-[1px]" : turn  === Number(playerNum) - 2 ? "border-[6px] animate-pulse border-green-500" : "border-[1px]"} bg-gray-600 flex flex-col w-[120px] h-[120px] rounded-full border-[1px] border-white`}></div>
          <div className={`absolute left-[5.5vw] top-[13vh] bg-lime-400 w-[3vw] h-[3vw] rounded-full text-gray-900 m-auto text-center py-[9px] font-bold ${pNum < 3 ? serverObject.big_blind === pNum + 3 ? "block": "hidden": serverObject.big_blind === pNum - 2? "block": "hidden" }`}>BB</div>
        </div>
        <div className="absolute right-[15vw] top-[65vh]">
          <div className={`${numOfPlayers >= 5 ? "block" : "block"} ${Number(playerNum) < 2 ? turn === Number(playerNum) + 4 ? "border-[6px] animate-pulse border-green-400" : "border-[1px]" : turn  === Number(playerNum) - 1 ? "border-[6px] animate-pulse border-green-500" : "border-[1px]"} bg-gray-600 flex flex-col w-[120px] h-[120px] rounded-full border-[1px] border-white`}></div>
          <div className={`absolute left-[5.5vw] top-[13vh] bg-lime-400 w-[3vw] h-[3vw] rounded-full text-gray-900 m-auto text-center py-[9px] font-bold ${pNum < 2 ? serverObject.big_blind === pNum + 4 ? "block": "hidden": serverObject.big_blind === pNum - 1? "block": "hidden" }`}>BB</div>
        </div>
      </div>
      <div className="flex w-[60vw] absolute left-[20vw] h-[20vh] top-[27.5vh]">
        <div className="text-white mx-auto flex">
          <div className={`mx-1 ${round >= 2 ? "block" : "hidden"}`}>{cardFetch("river",1)}</div>
          <div className={`mx-1 ${round >= 2 ? "block" : "hidden"}`}>{cardFetch("river",2)}</div>
          <div className={`mx-1 ${round >= 2 ? "block" : "hidden"}`}>{cardFetch("river",3)}</div>
          <div className={`mx-1 ${round >= 3 ? "block" : "hidden"}`}>{cardFetch("river",4)}</div>
          <div className={`mx-1 ${round >= 4 ? "block" : "hidden"}`}>{cardFetch("river",5)}</div>
        </div>
      </div>
    </>
}