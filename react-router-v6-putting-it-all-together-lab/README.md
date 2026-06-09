# Basic Routes Lab

## Lab Overview
In this lab, you will build a Movie Directory application that displays a list of directors and their movies. The application will allow users to:

* View a list of directors.
* Add a new director.
* Click on a director to see their details and a list of their movies.
* Click on a movie to see its details.
* Add a new movie to a director’s list and be redirected to the new movie’s detail page after submission.


## Your Responsibilities:
All components and data fetching are already set up for you. Your task is to implement client-side routing using React Router v6 by:
1. Installing React Router v6.
2. Setting up routing using BrowserRouter, Routes, and Route.
3. Implementing nested routes so that movies appear under each director’s details.
4. Use the useOutletContect hook to pass data from parent to child routes.
5. Using NavLinks and Links to create user-friendly navigation.
6. Using useNavigate to programmatically navigate after adding a new director or movie.

You'll need to use what you've learned about all three topics:
* React Router v6
* Nested Routing
* Programmatic Navigation

## Setup

Our `src` folder contains the following JavaScript files:

```txt
src/
├── components/
    ├── NavBar.jsx
    ├── NavBar.css
└── pages/
    ├── About.jsx
    ├── DirectorCard.jsx
    ├── DirectorContainer.jsx
    ├── DirectorForm.jsx
    ├── DirectorList.jsx
    ├── Home.jsx
    ├── MovieCard.jsx
    ├── MovieForm.jsx
├── App.jsx
├── index.css
├── main.jsx
```

You'll need to fill out these various files to get your app up and running.

To start up the lab, first run `npm install`, as per usual. Then install react router: `npm install react-router-dom@6`. Then run `npm run server` to start your `json-server` and `npm run dev` to open the application in the browser.

### App.jsx

You'll be adding the routes you create to this component. You'll need to provide the following routes, nested as shown below:

* "/" : Home
* "/about" : About
* "/directors" : DirectorContainer
    * "" : DirectorList
    * "new" : DirectorForm
    * ":id" : DirectorCard
        * "movies/new" : MovieForm
        * "movies/:movieId" : MovieCard

You are welcome to also create an Error route if you wish.

### main.jsx

Our `main.jsx` file is currently just rendering App, an empty component.

## Components

### NavBar

This component needs to render three `NavLink` components. They will be for `/`,
`/directors`, and `/about`. The NavBar component is already imported into the main pages and will only need to be added if you choose to create an ErrorPage.

## Pages

### About

This component should render on the `/about` route. All the code is built for you 
in the component, so no further changes need to be made.

### DirectorCard
This component should render on the `/directors/:id` route and is the parent route 
to all movie routes. You'll need to implement `useOutletContext`, `useParams`, 
and `<Outlet />` in this component to set the correct director and nest the child route 
components with the proper context.

### DirectorContainer
This component should render on the `/directors` route and is the parent route to all 
other director routes. This component contains the state of all directors. You'll need
to give child routes access to the appropriate data and may need to define some functions 
to update state appropriately.

### DirectorForm
This component should render on the `/directors/new` route. Most of the code is built 
out for you, but you will need to implement navigation and state changes on form submission.

### DirectorList
This component should render on the `/directors` route, but nested under DirectorContainer. 
Currently directors is set to null and needs to be updated using the state of its parent 
route. All the rest of the code is built out for you.

### Home

This component should render on the `/` route. It's mostly set up for you but will 
need to be edited to render user-friendly links to the directors and about pages.

### MovieCard

This component should render on the `/directors/:id/movies/:id` route. This component is 
already set up to render the details of one movie. You'll need to figure out how to get 
the specific movie through a mix of useOutletContext and useParams.

### MovieForm
This component should render on the `/directors/:id/movies/new` route. Like the `DirectorForm`, 
you'll need to handle state changes and navigation on form submission. You'll also need 
to update the director, which is currently set to null, using outlet context and params.

### ErrorPage (Optional)

If you choose, you can create a new component within the `pages` folder for our
`ErrorPage`. This page should display our `NavBar` component, along with a
user-friendly 
message like "Oops! Looks like something went wrong."

## Resources

- [React Router](https://reactrouter.com/en/main)
