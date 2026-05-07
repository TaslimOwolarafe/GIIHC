import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const sb = getSupabaseAdmin();
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim() || null;
    const faculty = (formData.get("faculty") as string)?.trim() || null;
    const imageFile = formData.get("image") as File | null;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    let image_url: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const ext = imageFile.type === "image/png" ? "png" : "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const bytes = await imageFile.arrayBuffer();
      const { data: up, error: upErr } = await sb.storage
        .from("attendee-photos")
        .upload(fileName, bytes, { contentType: imageFile.type, upsert: false });

      if (!upErr && up) {
        const { data: pub } = sb.storage
          .from("attendee-photos")
          .getPublicUrl(fileName);
        image_url = pub.publicUrl;
      }
    }

    const { data, error } = await sb
      .from("attendees")
      .insert([{ name, email, faculty, image_url }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, attendee: data });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sb = getSupabaseAdmin();

    // Supabase caps each request at 1000 rows by default.
    // We paginate in chunks of 1000 until we have everything.
    const PAGE_SIZE = 1000;
    let allAttendees: any[] = [];
    let from = 0;
    let done = false;

    while (!done) {
      const { data, error } = await sb
        .from("attendees")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;

      if (data && data.length > 0) {
        allAttendees = allAttendees.concat(data);
        from += PAGE_SIZE;
        // If we got fewer rows than PAGE_SIZE, we've reached the end
        if (data.length < PAGE_SIZE) done = true;
      } else {
        done = true;
      }
    }

    return NextResponse.json({ attendees: allAttendees });
  } catch {
    return NextResponse.json({ attendees: [] });
  }
}