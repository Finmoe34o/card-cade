import Link from "next/link"

export default function page() {
    return <div className="text-white text-center">
        <nav className="flex flex-row flex-nowrap h-[14vh] justify-evenly w-[100vw] border-b-2 border-gray-600">
            <Link className="inline" href="/">
                <h1 className="text-4xl inline mx-auto top-[3vh] font-extrabold relative">Card Cade</h1>    
            </Link>
        </nav>
        <h2 className="text-3xl font-semibold text-gray-200 relative top-[18.5vh]">Play Poker now</h2>
        <button className="w-[15vw] h-[5vh] relative top-[38vh] bg-gray-600 rounded-2xl mx-auto">Find a table</button>
    </div>
}