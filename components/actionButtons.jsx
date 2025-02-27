"use client"

import {useState, useEffect} from "react"
import { sendValuesToServer } from "../app/actions";
import { useRouter } from "next/navigation";

export default function page({minBet, turn, pot, stackSize, serverNum, playerNum,round}) {
    const [bet, setBet] = useState(0)
    const [betSize, setBetSize] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)
    const [load, setLoad] = useState(false)
    const pNum = Number(playerNum)
    const router = useRouter()
    
    const foldFunct = async() => {
        await sendValuesToServer(0,serverNum,playerNum,round)

    }

    const checkCallFunct = async () => {
        await sendValuesToServer(minBet,serverNum,playerNum,round);
    }

    const raiseFunct = async () => {
        setBet(betSize);
        setBetSize(-1)
        await sendValuesToServer(bet,serverNum,playerNum,round)
    }

    const [mouseY, setMouseY] = useState(0)
    const [mouseDown, setMouseDown] = useState(false)

    const dragFunct = (e) => {
        mouseDown && e.clientY - 385 > 28 ? (setMouseY(e.clientY - 385), setBetSize((Math.floor((216 - mouseY) / 1.88) / 100)) * stackSize) : mouseDown && e.clientY - 385 <= 28 ? (setMouseY(28), setBetSize(stackSize)) : ""
    }
    return <div className="flex absolute justify-between w-[50vw] h-[20vh]">
        <button onClick={turn === pNum ? foldFunct : null} className="w-[15vw] h-[10vh] bg-gray-700 rounded-2xl">Fold</button>
        <button onClick={turn === pNum ? checkCallFunct : null} className="w-[15vw] h-[10vh] bg-gray-700 rounded-2xl">{bet === minBet ? "check" : "call"}</button>
        <button onClick={() => {betSize !== 0 ? (raiseFunct(), setMenuOpen(false)) : turn === pNum ? (setMenuOpen(!menuOpen) , !load ? setLoad(true) : null) : null}} className="w-[15vw] h-[10vh] bg-gray-700 rounded-2xl">Raise</button>
        <div className={`bg-gray-600 absolute left-[37.5vw] w-[10vw] rounded-t-2xl ${menuOpen ? "h-[30vh] -top-[30vh] opacity-100 z-20 animate-comeUp" : load ? "h-0 top-0 animate-comeDown" : "h-0 top-0" }`}>
            <button id="dragButton" onMouseDown={() => {setMouseDown(true)}} onMouseUp={() => {setMouseDown(false)}}  onMouseMove={dragFunct} className={`h-[100%] absolute left-[50%] flex flex-col justify-evenly w-[50%] ${menuOpen ? "block" : "hidden"}`}>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div className="w-[80%] mx-auto h-[3px] rounded-3xl bg-black"></div>
                <div style={mouseY !== 0 ? mouseY > 0 ? {top: mouseY } : {top: "0"} : {bottom: 0, opacity: 0}} className="absolute bottom-0 w-[100%] mx-auto h-[3px] rounded-3xl bg-red-500"></div>
            </button>
        </div>
    </div>
}