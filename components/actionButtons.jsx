"use client"

import {useState} from "react"

export default function page({minBet, turn, pot, stackSize}) {
    const [bet, setBet] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)

    const foldFunct = () => {
        
        return turn++
    }

    const checkCallFunct = (minBet) => {
        setBet(minBet)
        return turn++
    }

    const [mouseY, setMouseY] = useState(0)
    const [mouseDown, setMouseDown] = useState(false)

    const dragFunct = (e) => {
        mouseDown ? setMouseY(e.clientY) : ""
        console.log("jsd")
    }

    return <div className="flex absolute justify-between w-[50vw] h-[20vh]">
        <button onClick={foldFunct} className="w-[15vw] h-[10vh] bg-gray-700 rounded-2xl">Fold{mouseY}</button>
        <button onClick={checkCallFunct} className="w-[15vw] h-[10vh] bg-gray-700 rounded-2xl">{bet === minBet ? "check" : "call"}</button>
        <button onClick={() => {setMenuOpen(!menuOpen)}} className="w-[15vw] h-[10vh] bg-gray-700 rounded-2xl">Raise</button>
        <div className={`bg-gray-600 absolute left-[37.5vw] w-[10vw] rounded-t-2xl ${menuOpen ? "h-[30vh] -top-[30vh] opacity-100 z-20 animate-comeDown" : "opacity-0 h-0 top-0 -z-10"}`}>
            <button id="dragButton" onMouseDown={() => {setMouseDown(true)}} onMouseUp={() => {setMouseDown(false)}}  onMouseMove={dragFunct} className="h-[100%] absolute left-[50%] flex flex-col justify-evenly w-[50%]">
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
            </button>
        </div>
    </div>
}