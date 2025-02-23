import Link from "next/link"

export default function page() {
    return <div className="text-white text-center">
        <nav className="">
            <Link href="/ ">Home</Link>
            <h1 className="text-4xl font-extrabold relative block top-[10vh]">Card Cade</h1>
        </nav>
        <h2 className="text-3xl font-semibold text-gray-200 relative top-[17.5vh]">Play Poker now</h2>
        <button className="w-[15vw] h-[5vh] relative top-[40vh] bg-gray-600 rounded-2xl mx-auto">Find a table</button>
    </div>
}