# README.md

Daniel Goldelman

## Overview

This project is a web application that has a few core goals:

- A user is able to access the website, which has the following core features:
  - A button for the user to click.
  - A number indicating how many times the button has been clicked.
  - This data is stored in a persistent database.
  - This web application is hosted in a public repository with CI/CD.

CI/CD Requirement:

- Application hosted on Vercel
- Uploads the latest application to Vercel upon new code push (from main branch of Github repository)

Accomplished Personalized Requirements:

- Keep track of how many times a unique individual has pressed the button.
- Add monitoring and logging so that admins can audit who has pressed the button and when.
- Dashboard that compares the number of clicks by all usernames in the database.

## Links

- [README.md](#readmemd)
  - [Overview](#overview)
  - [Links](#links)
  - [Specifications](#specifications)
    - [List of Features](#list-of-features)
    - [Technical Details](#technical-details)
    - [APIs](#apis)
    - [Database Schema](#database-schema)
  - [Design Decisions](#design-decisions)
  - [Requirements and Instructions for Reproduction](#requirements-and-instructions-for-reproduction)
    - [Requirements](#requirements)
    - [Instructions for Reproduction (If you have access to the Vercel account used for production build)](#instructions-for-reproduction-if-you-have-access-to-the-vercel-account-used-for-production-build)
    - [Instructions for Reproduction (If you do not have access to the Vercel account used for production build)](#instructions-for-reproduction-if-you-do-not-have-access-to-the-vercel-account-used-for-production-build)
  - [Improving Reliability, Availability, Performance, and Security](#improving-reliability-availability-performance-and-security)
  - [Ideas Towards Implementing Extra Features](#ideas-towards-implementing-extra-features)
  - [Long-Form Description of the UI (By Route)](#long-form-description-of-the-ui-by-route)

## Specifications

### List of Features

- Form for submitting a username
  - Users cannot click the button to edit the database until the username field has been filled out
- Anyone can see how many times the button has been clicked, irrespective of whether or not they are signed in
- Once a user has provided a username, they can see how many times someone with that username has clicked the button
- There exists an admin page, accessible by using the string "admin" as the username on the homepage.
  - Once on the admin page, an admin can choose between two views:
    - Bar Graph:
      - Admins can see how many times each user has clicked the button, ordered by time the username's first click was registered in the database
    - Search:
      - Enter in a username and click "submit"
        - If that username has been used to click the button, users will see:
          - Text describing how many times the username has been used to click the button
          - Scrollable list of when the button was clicked (date and time)
        - If that username has not been used to click the button:
          - Tells the admin that the provided username has not been used to click the button

### Technical Details

- This project was bootstrapped using `create-next-app` from next.js. This method provides options, enumerated here:
  - What is your project named? -> goldelman_ayr_take_home_project
  - Would you like to use TypeScript? -> Yes
  - Would you like to use ESLint? -> Yes
  - Would you like to use Tailwind CSS? -> Yes
  - Would you like to use `src/` directory? -> No
  - Would you like to use App Router? (recommended) -> Yes
  - Would you like to customize the default import alias (@/*)? -> Yes
- Frontend:
  - `React.js` frontend for component-based rendering
  - `next.js` utilized throughout for rendering and routing
  - `dotenv` used for absorbing secrets in `.env` files, not provided publically for protection, and for seeding database
  - `tailwindcss` used for styling
  - `eslint` for linting and formatting
  - `chart.js` for generating the graph in the admin graph page
  - Written in Typescript
  - Client-side rendering
  - Backend queried using `fetch`
- Backend
  - `node` backend used for routing and querying the database
  - `@vercel/postgres` used to create SQL queries to interact with the database
  - Written in Typescript and SQL
  - Server-side functions for secure interaction with the database
- Database
  - Postgres
  - Hosted on Vercel
  - `.env` database secrets hosted alongside within Vercel

### APIs

- `api/global`:
  - _GET(request)_:
    - Parameters From Headers: None
    - Returns: Number of times all usernames have clicked the button
- `api/userGiven`:
  - _GET(request)_:
    - Parameters From Headers:
      - username: string representation of a username
    - Returns: Number of times that username has been used to click the button
  - _POST(request)_:
    - Parameters From Headers:
      - username: string representation of a username
      - time: exact timestamp of when the button was clicked (in milliseconds)
    - Returns: Confirmation message
- `api/admin`:
  - _GET(request)_:
    - Parameters From Headers:
      - username: string representation of a username
    - Returns: Tuple(number of times this username was used to click the button, list of times that the username was used to click the button)

### Database Schema

- `users` table columns:
  - _id_: UUIDv4
  - _username_: string representation of username
  - _time_: timestamp of when the button was clicked

## Design Decisions

- I have experience building websites in Vercel/Next.js, so I decided to use their service for this project. More information on how this affects performance is in the related section.
- All colors begining with `ayr-*` described in `tailwind.config.ts` were taken directly from the AYR website using a color picker Chrome extension.
- Process for updating the frontend with data:
  - `fetch` requests were sent from client-side components to the server
  - Server-side components handle sql queries to the database
    - `vercel/postgress` handles all sql queries, so there is protection against sql injection (information via their docs)
  - Data forwarded to client-side components
  - Frontend updated

## Requirements and Instructions for Reproduction

### Requirements

- node v21.7.1+
- npx v10.5.0+

### Instructions for Reproduction (If you have access to the Vercel account used for production build)

1. Install node v21.7.1
2. Install npx 10.5.0
3. Create an account on Github
4. Install Git or the Github CLI
5. cd into the directory you would like to place this directory into
6. Run `git clone` + {url you are visiting this from}
7. cd into the directory
8. Run `npm install` to install dependancies
9. On Vercel:
   1. Log in
   2. Nagigate to the project related to this repo
   3. Navigate to the storage tab
   4. Navigate to "goldelman-ayr-postgres"
   5. Click on ".env.local" in the list
   6. Copy the snippet
10. Back in the directory
    1. Create a new file named ".env.local"
    2. Paste the secrets obtained in vercel
11. Run `npm run dev` to start a development version of this web app
12. In a web browser, enter "localhost:3000" or "127.0.0.1:3000"

### Instructions for Reproduction (If you do not have access to the Vercel account used for production build)

Replace step 9 with an email to me at <daniel.goldelman@gmail.com>, and I will send you the ".env.local" file

## Improving Reliability, Availability, Performance, and Security

Due to limitations with the Hobby plan of Vercel, the database is only hosted on one server in one location (Washington, DC) and the connection is quite slow since it is rate-limited for non-paying projects. This means that reliability, availability, and performance are all based on current usage of the server, and that this project is low on the priority lists for the Vercel service. This limited implementation also means that there are limits to the amount of data able to be stored or computed monthly. Improved reliability, availability, and performace could easily be achieved by choosing a paying service for hosting the database, or alternatively to move the entire backend (including the APIs and database) to some paid service, Vercel or otherwise.

There is are two obvious security flaws in the current system due to lack of authentication. First, anyone can sign in as any user without a password. Second, anyone can access the admin page, which would normally be much more secure. There are many options for how to introduce authentication (NextAuth, Auth0, Firebase, Okta, etc.), but this was outside of the bounds of the current implementation.

Due to Vercel's efforts, I do not believe there are significant security risks related to SQL injection (mentioned above) or improper access to the database (since all requests operate on the server and are protected and excluded from public repositories).

## Ideas Towards Implementing Extra Features

- _The number of times the button has been clicked automatically updates for multiple users who are accessing the site at the same time, better if live updating._ Response: I would achieve this by setting up an exchange from the server to each client currently accessing the site, sending them an updated value. This would necessitate keeping a list of current users on the site.
- _Create an authentication system where users have to login to press the button._ Response: I would use [NextAuth](https://next-auth.js.org/) to obtain the user's login, which would provide me an ID or email which I would then use as an authentic token, then ask the user for their desired username.
- _Add a dashboard that shows a graph of total clicks over time and/or clicks per minute._ I already have the ability to intake data from the server and then graph it, so adjusting what the graph shows is a fairly straightforward algorithmic process.
  - For total clicks over time, I would break it down by day/hour/minute, based on a dropdown menu. The time is stored as milliseconds from `Date.now()`, and then converted into date-time format using the `Date` functionality from Javascript/Typescript. Funneling each time into buckets is trivial from there.
  - For clicks per minute, the process is similar. I could provide some format of entry form where the user could specify what times they would like to look at, and then filter the millisecond times into buckets.

## Long-Form Description of the UI (By Route)

- / (homepage)
  - Header containing the text "Click Counter", subtext "AYR Take Home Project"
  - Form where a user can enter a username, then click submit (will increase in size on hover)
    - Before Submit button has been clicked:
      - Text that reads: "Enter a username, then click the button!"
      - Red Button that reads: "Click Me". If clicked:
        - Alert shown reading "Enter a username before clicking the button!"
    - If Submit has been clicked without a provided username
      - Dropdown that reads "Please fill out this field", the default action for required elements (on chrome)
    - If Submit has been clicked with a provided username:
      - if the username is "admin":
        - User is routed to "/admin"
      - else:
        - Text that reads: "Hello, {username}!"
        - Text that reads: "Your Clicks: {number of times the provided username has been used to click the button}"
        - Blue Button that reads: "Click Me"
          - When the button is clicked:
            - The button turns Green and the text turns black
            - Number of clicks should update (personal and global)
  - Footer containing the text "Website by Daniel Goldelman"
- /admin (admin page)
  - Header containing the text "Admin Page", subtext "AYR Take Home Project"
  - Blue Button with the text "Go To Bar Graph". When clicked:
    - Will turn Green with Black text
    - Will route to "/admin/barGraph"
  - Blue Button with the text "Go To Search"
    - Will turn Green with Black text
    - Will route to "/admin/barGraph"
  - Blue Button with the text "Back To Homepage"
    - Will turn Green with Black text
    - Will route to "/"
  - Footer containing the text "Website by Daniel Goldelman"
- /admin/barGraph
  - Header containing the text "Admin Page", subtext "AYR Take Home Project"
  - Blue Button with the text "Back To Admin Page"
    - Will turn Green with Black text
    - Will route to "/admin"
  - Graph comparing all usernames' number of clicks, in order of who clicked first
  - Footer containing the text "Website by Daniel Goldelman"
- /admin/search
  - Header containing the text "Admin Page", subtext "AYR Take Home Project"
  - Blue Button with the text "Back To Admin Page"
    - Will turn Green with Black text
    - Will route to "/admin"
  - Form where a user can enter a username, then click submit (will increase in size on hover)
    - If Submit has been clicked without a provided username:
      - Dropdown that reads "Please fill out this field", the default action for required elements (on chrome)
    - If Submit has been clicked with a provided username:
      - If the provided username has clicked the button:
        - Text reading: "User: {username}"
        - Text reading: "Clicks: {number of times this username has been used to click the button}
        - Scrollable list of all the dates and times the button was clicked using this username
          - Format: month/day/year, hour:minute:second {AM|PM}
  - Footer containing the text "Website by Daniel Goldelman"
