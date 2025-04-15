"use server";

import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server";

export async function POST({ id }) {
    const supabase = await createClient()
    const { data } = await supabase
        .from("servers")
        .select("turn")
        .eq("id", id)
    return NextResponse.json(turn);
}