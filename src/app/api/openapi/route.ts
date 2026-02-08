import { openApiDocument } from "@/shared/openapi/document";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(openApiDocument);
}