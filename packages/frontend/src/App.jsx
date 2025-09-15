import React, {Fragment} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import {Container} from '@mui/material'

/**
 * Components
 */
import {TopNavBar} from './components/layout/TopNavBar'
import {BottomNavBar} from './components/layout/BottomNavBar'

/**
 * Pages
 */
import {IndexPage} from './pages/IndexPage'
import {ObjectsPage} from './pages/ObjectsPage'
import {TasksPage} from './pages/TasksPage'
import {ProfilePage} from './pages/ProfilePage'

/**
 * Root React element
 * @return {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <Router>
      <Fragment>
        <TopNavBar/>
        <Container
          sx={{minHeight: '90vh'}}
        >
          <Routes>
            <Route
              path={'/'} element={<IndexPage/>} exact
            />
            <Route
              path={'/objects'} element={<ObjectsPage/>} exact
            />
            <Route
              path={'/tasks'} element={<TasksPage/>} exact
            />
            <Route
              path={'/profile'} element={<ProfilePage/>} exact
            />
          </Routes>
        </Container>
        <BottomNavBar/>
      </Fragment>
    </Router>
  )
}

export default App