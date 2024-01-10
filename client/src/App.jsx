import './App.css'

import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import Register from './Register'
import React from 'react'
import Login from './Login'
import UserContext from './UserContext'
import axios from 'axios'
import Home from './Home'

function App() {

  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    axios.get('http://todo-app.local/backend/user', {withCredentials: true})
      .then(response => {
        setEmail(response.data.email);
      });
  }, []);

  function logout() {
    axios.post('http://todo-app.local/backend/logout', {}, {withCredentials: true})
      .then(() => setEmail(''));
  }

  return (
    <React.Fragment>
        <UserContext.Provider value={{email, setEmail}}>
          <div className="w-96">
            <BrowserRouter>

              <nav className='flex justify-around'>
                <Link to='/'>Home</Link>
                {!email && (
                  <>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>Register</Link>
                  </>
                )}
                {email && (
                  <a onClick={e => {e.preventDefault(); logout();}}>Log out</a>
                )}
              </nav>

              <hr className="my-2" />

              <main className='shadow-2xl mt-4 rounded-lg px-8 py-4 bg-zinc-900'>
                <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/register' element={<Register />} />
                  <Route exact path='/login' element={<Login />} />
                </Routes>
              </main>


            </BrowserRouter>
          </div>
        </UserContext.Provider>
    </React.Fragment>
  )
}

export default App
