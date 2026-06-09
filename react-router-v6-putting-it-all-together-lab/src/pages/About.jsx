import NavBar from "../components/NavBar"

function About() {
    return (
        <>
            <NavBar />
            <main>
                <h1>About the Movie Directory 🎞️</h1>
                <p>
                This application showcases a list of notable film directors and their
                works. Users can:
                </p>
                <ul>
                <li>Browse a list of directors and their filmographies.</li>
                <li>Add new directors to the database.</li>
                <li>View detailed information about individual movies.</li>
                <li>
                    Add new movies to a director's collection and instantly view the new
                    movie details.
                </li>
                </ul>
                <p>
                The application is built with React and React Router v6, demonstrating
                concepts such as nested routing, dynamic URL parameters, and
                programmatic navigation.
                </p>
            </main>
        </>
    )
  }
  
  export default About
  