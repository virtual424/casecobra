import { storage } from "@/db/firebase";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();

    // if (!user || !user.id) {
    //   throw new Response("Unauthorized", { status: 401 });
    // }

    const formData = await request.formData();

    const file: File | null = formData.get("file") as File | null;
    if (!file) {
      throw new Error("No file to upload");
    }
    const storageRef = ref(storage, file.name);
    await uploadBytes(storageRef, file as File);
    const url = await getDownloadURL(storageRef);

    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ message: e.message });
  }
}
