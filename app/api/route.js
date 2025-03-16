import { cookies } from "next/headers";

export async function GET(req) {
    const cookieStore = cookies();
    if (!stackSize) {
        cookieStore.set("stackSize", 10000) // Set cookie
    }
    return Response.json({ stackSize });
}