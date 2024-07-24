
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './views/Home'
import SignUp from './views/SignUp'
import SignIn from './views/SignIn'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/' element={<SignIn />}></Route>
      </Routes>
    </Router>
  )
}

export default App
