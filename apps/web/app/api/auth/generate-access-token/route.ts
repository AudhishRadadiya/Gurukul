import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      data: {
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjM1NzFkYi1iYmNlLTRiN2UtYTRlMS1lZjgwNGNhYWU3YmIiLCJlbWFpbCI6ImRlbW9AZ21haWwuY29tIiwianRpIjoiZDRjNWE3ZmQtOGUzYy00MDhiLWI0ZmMtNjBjZjdiMTEyNmEzIiwiaWF0IjoxNzQ1NDkzNzY3LCJleHAiOjE3NDU1ODAxNjd9.fve2gHIqw9Nu1yohahWRTdyfhg3H88gpdqz8z0Wlmw8",
      },
      message: "Access token generated successfully",
    },
    { status: 200 }
  );
}
