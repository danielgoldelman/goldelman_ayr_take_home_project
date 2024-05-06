import { sql } from "@vercel/postgres";

/**
 * Next.js normally caches the response and does not revalidate it until the
 * cache expires, which is commonly 5 seconds.
 */
export const revalidate = 0;

/**
 * Handles the GET request.
 * @param req - The request object.
 * @returns A JSON response containing the count of rows returned from the database.
 */
export async function GET(req: Request) {
  const query = await sql`SELECT * FROM clicktiming`;
  const rowCount = query.rows.length;
  return Response.json({ count: rowCount });
}
