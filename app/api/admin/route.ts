import { sql } from "@vercel/postgres";

/**
 * Next.js normally caches the response and does not revalidate it until the 
 * cache expires, which is commonly 5 seconds.
 */
export const revalidate = 0;

/**
 * Retrieves the time values associated with a given username from the "users" table.
 * @param request - The incoming request object.
 * @returns A JSON response containing the count of rows and an array of time values.
 */
export async function GET(request: Request) {
  const reqHeaders = request.headers;
  const username = reqHeaders.get("username");
  if (username) {
    const query = await sql`SELECT time FROM clicktiming WHERE username = ${username}`;
    const rows = query.rows;
    const rowCount = rows.length;
    const allTimes = rows.map((row) => row.time);
    return Response.json({ count: rowCount, times: allTimes });
  } else {
    const query = await sql`SELECT username FROM clicktiming`;
    const rows = query.rows;
    const allUsernames = rows.map((row) => row.username);
    return Response.json({ usernames: allUsernames });
  }
}
