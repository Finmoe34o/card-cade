"use server";

import { createClient } from "@/utils/supabase/server"

export async function activePlayerHandling(playerNum, action) {
    const supabase = await createClient("")

}