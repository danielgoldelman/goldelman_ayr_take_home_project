"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "../utils/adminHeader";
import AdminFooter from "../utils/adminFooter";

export default function AdminForm() {
  const [username, setUsername] = useState<string>("");
  const [userClicks, setUserClicks] = useState<number>(0);
  const [times, setTimes] = useState<string[]>([]);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      sessionStorage.clear();
    });
    const user = sessionStorage.getItem("usernameAdmin");
    if (user) {
      setUsername(user);
      const prevClicks = sessionStorage.getItem("userClicksAdmin");
      if (prevClicks) {
        setUserClicks(parseInt(prevClicks));
      }
      const prevTimes = sessionStorage.getItem("timesAdmin");
      if (prevTimes) {
        setTimes(prevTimes.split(","));
      }
    }
  }, []);

  /**
   * Retrieves the number of clicks and times for a given user.
   * @param user - The username of the user.
   * @returns A tuple containing the count of clicks and an array of times.
   */
  async function getUserClicks(user: string) {
    try {
      const response = await fetch("/api/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application",
          username: user,
        },
      });
      const data = await response.json();
      return [data.count, data.times];
    } catch (error) {
      console.error("Error:", error);
      return [0, []];
    }
  }

  /**
   * Handles the form submission for the admin page.
   *
   * @param event - The form submission event.
   * @returns {Promise<void>}
   */
  async function handleAdminSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const username = formData.get("username");
    if (!username) {
      return;
    }
    setUsername(username as string);
    const [numClicks, listTimes] = await getUserClicks(username as string);
    setUserClicks(numClicks);
    setTimes(listTimes);
    sessionStorage.setItem("usernameAdmin", username as string);
    sessionStorage.setItem("userClicksAdmin", numClicks.toString());
    sessionStorage.setItem("timesAdmin", listTimes.join(","));
  }

  function milisecondsToTime(miliseconds: string): string {
    const timeAsNumber = parseInt(miliseconds);
    const date = new Date(timeAsNumber);
    return date.toLocaleString();
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <AdminHeader />
      <Link
        href="/admin"
        className="border border-black rounded-md p-2 bg-ayr-logo-blue text-white hover:scale-105 hover:bg-green hover:text-black"
      >
        Back to Admin Page
      </Link>
      <form onSubmit={handleAdminSubmit} className="mt-10 space-x-2 p-4">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          className="border border-black rounded-md p-1 hover:border-ayr-logo-blue"
          defaultValue={username}
          placeholder="Enter username"
          required
        />
        <button
          type="submit"
          className="rounded-md p-1 text-white bg-ayr-logo-blue hover:scale-105 active:bg-green active:text-black"
        >
          Submit
        </button>
      </form>
      {username ? (
        <div className="text-center">
          <p>User: {username}</p>
          {userClicks !== 0 ? (
            <div>
              <p>Clicks: {userClicks}</p>
              <div className="max-h-40 sm:max-h-80 lg:max-h-96 overflow-y-auto border border-black p-3">
                {times.map((time) => (
                  <p key={time.toString()}>
                    {milisecondsToTime(time)}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <p>This user has not clicked yet!</p>
          )}
        </div>
      ) : null}
      <AdminFooter />
    </main>
  );
}
