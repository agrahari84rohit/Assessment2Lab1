import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import DirectorCard from './pages/DirectorCard'
import DirectorContainer from './pages/DirectorContainer'
import DirectorForm from './pages/DirectorForm'
import DirectorList from './pages/DirectorList'
import Home from './pages/Home'
import MovieCard from './pages/MovieCard'
import MovieForm from './pages/MovieForm'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/directors" element={<DirectorContainer />}>
          <Route index element={<DirectorList />} />
          <Route path="new" element={<DirectorForm />} />
          <Route path=":id" element={<DirectorCard />}>
            <Route path="movies/new" element={<MovieForm />} />
            <Route path="movies/:movieId" element={<MovieCard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
