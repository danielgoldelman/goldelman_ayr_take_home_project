"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Footer from "./utils/footer";
import HomeHeader from "./utils/homeHeader";

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [userClicks, setUserClicks] = useState<number>(0);
  const [totalClicks, setTotalClicks] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    /**
     * Sets up the page by fetching global data and initializing user data.
     *
     * @returns {Promise<void>}
     */
    async function setup(): Promise<void> {
      try {
        const response = await fetch("/api/global", { cache: "no-cache" });
        const data = await response.json();
        setTotalClicks(data.count as number);
      } catch (error) {
        console.error("Error:", error);
      }

      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername) {
        setUsername(storedUsername);
        const prevUserClicks = parseInt(
          sessionStorage.getItem("userClicks") ?? "0"
        );
        setUserClicks(prevUserClicks);
      }
    }

    setup();
  }, []);

  /**
   * Retrieves the number of clicks for a given user.
   * @param user - The username of the user.
   * @returns A Promise that resolves to the number of clicks for the user.
   */
  async function getUserClicks(user: string): Promise<number> {
    try {
      const response = await fetch("/api/userGiven", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          username: user,
          cache: "no-cache",
        },
      });
      const data = await response.json();
      return Promise.resolve(data.count as number);
    } catch (error) {
      console.error("Error:", error);
      return 0;
    }
  }

  /**
   * Handles the form submission event.
   *
   * @param event - The form submission event.
   * @returns {Promise<void>}
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const uname = formData.get("username") as string;
    if (uname === "admin") {
      router.push("/admin");
      return;
    } else if (uname === "") {
      alert("Please enter a username!");
      return;
    }
    setUsername(uname);
    sessionStorage.setItem("username", uname);
    const numUserClicks = await getUserClicks(uname);
    // console.log(numUserClicks)
    setUserClicks(numUserClicks);
    sessionStorage.setItem("userClicks", numUserClicks.toString());
  }

  /**
   * Handles the click event and performs the necessary actions.
   * @returns {Promise<void>} A promise that resolves when the click event is handled.
   */
  async function handleClick() {
    const body = JSON.stringify({ username: username, time: Date.now() });
    try {
      // get the number of clicks for the user
      await fetch("/api/userGiven", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      // type cast userClicks to number when applicable
      if (typeof userClicks === "string") {
        const numUserClicks = parseInt(userClicks);
        setUserClicks(numUserClicks + 1);
        sessionStorage.setItem("userClicks", (numUserClicks + 1).toString());
      } else {
        setUserClicks(userClicks + 1);
        sessionStorage.setItem("userClicks", (userClicks + 1).toString());
      }
      // increment the total number of clicks
      setTotalClicks(totalClicks + 1);
      sessionStorage.setItem("totalClicks", (totalClicks + 1).toString());
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /**
   * Handles the case when no username is set.
   * Logs a message to the console and displays an alert to the user.
   */
  function handleNoUsername() {
    // console.log("username not set");
    alert("Enter a username before clicking the button!");
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <HomeHeader />
      <div className="text-center">
        <form onSubmit={handleSubmit} className="space-x-2 p-4">
          <label className="">Username:</label>
          <input
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

        <div>
          {username ? (
            <div>
              <h1 className="">Hello, {username}!</h1>
              <h1>Your Clicks: {userClicks.toString()}</h1>
            </div>
          ) : (
            <div>
              <h1>Enter a username, then click the button!</h1>
              <br />
            </div>
          )}
        </div>

        <div className="pt-10">
          {username ? (
            <button
              onClick={handleClick}
              className="border border-black rounded-md p-2 bg-ayr-logo-blue text-white active:bg-green active:text-black mb-10"
            >
              Click Me
            </button>
          ) : (
            <button
              onClick={handleNoUsername}
              className="border border-black rounded-md p-2 bg-ayr-red"
            >
              Click Me
            </button>
          )}

          <h1>Total Number of Clicks: {totalClicks}</h1>
        </div>
      </div>
      <Footer />
    </main>
  );
}
