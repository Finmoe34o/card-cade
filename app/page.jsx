"use client"

import Link from "next/link";
import { useRouter } from 'next/navigation';
import {findServer} from "./actions"
import { useState } from "react";

export default function page() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const serverFunct = async () => {
        setLoading(true)
        const server = await findServer()
        console.log(await server, "ths")
    }

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
            <div className="mt-24">
                <h2 className="text-3xl font-semibold text-gray-200">Play Poker Now</h2>
                <button
                    onClick={serverFunct}   
                    className={`mt-12 inline-block ${loading ? `bg-blue-900` :  `bg-blue-600` } hover:bg-blue-900 transition px-6 py-3 text-lg font-bold text-white rounded-2xl shadow-md`}
                >
                    Find a Table
                </button>
            </div>
        </div>
    );
}
