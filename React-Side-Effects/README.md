# React Side Effects

This app fetches a programming joke from the JokeAPI when the page loads, shows a loading message while the request is in progress, and lets the user request another joke with a single button.

## Features

- Uses React state and the useEffect hook to fetch data on mount.
- Displays a loading message while waiting for the API response.
- Handles API errors with a friendly fallback message.
- Uses one button and one joke paragraph in the main interface.

## Setup

1. Install dependencies:
   npm install
2. Start the development server:
   npm run dev
3. Run the test suite:
   npm run test

## Usage

- Open the app in the browser.
- The page will automatically load a programming joke.
- Click the button to fetch another joke.
