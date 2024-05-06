const { db } = require("@vercel/postgres");
const { clicktiming } = require("./placeholders.js");

async function seedclicktiming(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "clicktiming" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS clicktiming (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        time TEXT NOT NULL
      );
    `;

    console.log(`Created "clicktiming" table`);

    // Insert data into the "clicktiming" table
    const insertedclicktiming = await Promise.all(
      clicktiming.map(async (single) => {
        return client.sql`
        INSERT INTO clicktiming (id, username, time)
        VALUES (${single.id}, ${single.username}, ${single.time})
        ON CONFLICT (id) DO NOTHING;
      `;
      })
    );

    console.log(`Seeded ${insertedclicktiming.length} clicktiming`);

    return {
      createTable,
      clicktiming: insertedclicktiming,
    };
  } catch (error) {
    console.error("Error seeding clicktiming:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedclicktiming(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err
  );
});
