"use client"

import {useState} from "react"

export default function page({minBet, turn, pot, stackSize}) {
    const [bet, setBet] = useState(0)
    const [raise, setRaise] = useState(false)

    const foldFunct = () => {
        
        return turn++
    }

    const checkCallFunct = (minBet) => {
        setBet(minBet)
        return turn++
    }

    const raiseFunct = (betSize) => {
        setRaise(false)
    }


    return <div className="flex absolute left-[25vw] justify-between w-[50vw] h-[20vh]">
        <button onClick={foldFunct} className="w-[15vw] h-[10vw] bg-gray-950 rounded-2xl">Fold</button>
        <button onClick={checkCallFunct} className="w-[15vw] h-[10vw] bg-gray-950 rounded-2xl">{bet === minBet ? "check" : "call"}</button>
        <button onClick={() => {setRaise(true)}} className="w-[15vw] h-[10vw] bg-gray-950 rounded-2xl">Raise</button>
        <div className={`bg-gray-950 absolute left-[30vw] w-[10vw] h-[50vh] rounded-2xl ${menuOpen ? "translate-y-[88.2vh] animate-comeDown" : "translate-y-0 opacity-0 -z-10"}`}>
            <button className="h-[100%] w-[100%]"></button>
        </div>
    </div>
}