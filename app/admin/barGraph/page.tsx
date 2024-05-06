"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Chart } from "chart.js/auto";
import AdminHeader from "../utils/adminHeader";
import AdminFooter from "../utils/adminFooter";

export default function BarGraph() {
  useEffect(() => {
    /**
     * Sets up the page by fetching global data from the API and updating the global clicks count.
     * @returns {Promise<void>}
     */
    async function setup(): Promise<void> {
      try {
        const response = await fetch("/api/admin");
        const data = await response.json();
        const ctx = document.getElementById("chart") as HTMLCanvasElement;
        chart(ctx, data.usernames);
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setup();
  });

  function usernameListToObject(usernames: string[]): Record<string, number> {
    var obj: Record<string, number> = {};
    usernames.forEach((username) => {
      if (!obj[username]) {
        obj[username] = 1;
      } else {
        obj[username] += 1;
      }
    });
    return obj;
  }

  /**
   * Creates a chart using Chart.js.
   * @param ctx - The canvas element to render the chart.
   * @param usernames - The list of usernames to display on the chart.
   */
  function chart(ctx: HTMLCanvasElement, usernames: string[]) {
    const userCount = usernameListToObject(usernames);
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [...Object.keys(userCount)],
        datasets: [
          {
            label: "# of Clicks",
            data: [...Object.values(userCount)],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Usernames",
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
            title: {
              display: true,
              text: "Number of Clicks",
            },
          },
        },
      },
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <AdminHeader />
      <Link href="/admin" className="border border-black rounded-md p-2 bg-ayr-logo-blue text-white hover:scale-105 hover:bg-green hover:text-black">
        Back to Admin Page
      </Link>
      <canvas id="chart" className="border border-black mt-10 sm:mx-10 md:mx-16 lg:mx-[20%]"></canvas>
      <AdminFooter />
    </main>
  );
}
