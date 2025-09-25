import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      data: {
        user: {
          access_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjM1NzFkYi1iYmNlLTRiN2UtYTRlMS1lZjgwNGNhYWU3YmIiLCJlbWFpbCI6ImRlbW9AZ21haWwuY29tIiwianRpIjoiNDdiY2EyMDktZGQxNi00MGNiLWEzZmUtZDlkN2M4MDBiZGU3IiwiaWF0IjoxNzQ1NDkzNzAwLCJleHAiOjE3NDU1ODAxMDB9.rtIFb-Mun9_dKBh1YWzQZFbeC_-B7OlNIMxsLS3z_sA",
          avatar:
            "https://sixtify.s3.amazonaws.com/1741673951634_download (4).jpeg",
          email: "demo@gmail.com",
          id: "f63571db-bbce-4b7e-a4e1-ef804caae7bb",
          name: "Demo Demo",
          refresh_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmNjM1NzFkYi1iYmNlLTRiN2UtYTRlMS1lZjgwNGNhYWU3YmIiLCJlbWFpbCI6ImRlbW9AZ21haWwuY29tIiwianRpIjoiNDdiY2EyMDktZGQxNi00MGNiLWEzZmUtZDlkN2M4MDBiZGU3IiwiaWF0IjoxNzQ1NDkzNzAwLCJleHAiOjE3NDYwOTg1MDB9.SeBbveovK-wgzKoA4YtlHp_EnC71V5HCCDt8qdLyqD8",
        },
      },
      message: "User Login Successfully.",
    },
    { status: 200 }
  );
}
