import { sql } from "@vercel/postgres";

/**
 * Handles the GET request for user information.
 * @param request - The request object containing the headers, includes username.
 * @returns A JSON response with the count of users matching the provided username.
 */
export async function GET(request: Request) {
  const reqHeaders = request.headers;
  const username = reqHeaders.get("username");
  const query =
    await sql`SELECT COUNT(*) FROM clicktiming WHERE username=${username}`;
  const rowCount = query.rows[0]["count"];
  return Response.json({ count: rowCount });
}

export async function POST(request: Request) {
  const req = await request.json();
  const username = req.username;
  const time = req.time;
  try {
    await sql`INSERT INTO clicktiming (id, username, time) VALUES (uuid_generate_v4(), ${username}, ${time})`;
    return Response.json({ message: "Success" });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ message: "Error" });
  }
}
