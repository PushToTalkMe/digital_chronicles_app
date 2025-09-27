import React, {Fragment, useState, useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import './App.css'
import {Container, Box, ThemeProvider, useMediaQuery} from '@mui/material'
import {grey, common, red, purple} from '@mui/material/colors';

/**
 * Components
 */
import {TopNavBar} from './components/layout/TopNavBar'
import {BottomNavBar} from './components/layout/BottomNavBar'

/**
 * Pages
 */
import {LoginPage} from './pages/LoginPage'
import {ObjectsPage} from './pages/ObjectsPage'
import {TasksPage} from './pages/TasksPage'
import {ProfilePage} from './pages/ProfilePage'
import {createTheme} from '@mui/material/styles'
import {ThemeButton} from './components/ui-kit/ThemeButton'

import {Context} from './context'

/**
 * Root React element
 * @return {JSX.Element}
 * @constructor
 */
function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const savedTheme = localStorage.getItem('theme')

  const updateMetaThemeColor = (color) => {
    let metaThemeColor = document.querySelector('meta[name=\'theme-color\']')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta')
      metaThemeColor.name = 'theme-color'
      document.head.appendChild(metaThemeColor)
    }
    metaThemeColor.content = color
  }
  const toDarkTheme = () => {
    updateMetaThemeColor(grey[900])
    setDarkThemeStatus(true)
  }
  const toLightTheme = () => {
    updateMetaThemeColor(grey[50])
    setDarkThemeStatus(false)
  }

  useEffect(() => {
    if (savedTheme === 'light') {
      toLightTheme()
    }
    if (savedTheme === 'dark') {
      toDarkTheme()
    }
  }, [savedTheme])

  const [darkThemeStatus, setDarkThemeStatus] = useState(
    savedTheme === 'dark' || (savedTheme === null && prefersDarkMode),
  )

  const lightTheme = createTheme({
    cssVariables: true,
    palette: {
      background: {
        default: grey[50],
        paper: common.white,
      },
      primary: {
        main: red[500],
      },
      secondary: {
        main: purple.A400,
      },
      error: {
        main: red[500],
      },
    },
  })

  const darkTheme = createTheme({
    cssVariables: true,
    palette: {
      mode: 'dark',
      background: {
        default: grey[900],
        paper: grey[900],
      },
      primary: {
        main: red[500],
      },
      secondary: {
        main: purple.A400,
      },
      error: {
        main: red[500],
      },
    },
  })

  const theme = darkThemeStatus ? darkTheme : lightTheme
  // const theme = darkTheme

  return (
    <Router>
      <Fragment>
        <Context.Provider
          value={{
            toDarkTheme,
            toLightTheme,
            darkThemeStatus,
          }}
        >
          <ThemeProvider theme={theme}>
            <Box
              sx={{
                bgcolor: (theme) => theme.palette.background.default,
                minHeight: '100vh',
              }}
            >
              <TopNavBar/>
              <Container
                sx={{minHeight: '90vh'}}
              >
                <Routes>
                  <Route
                    path={'/login'} element={<LoginPage/>} exact
                  />
                  <Route
                    path={'/'} element={<ObjectsPage/>} exact
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
              <ThemeButton/>
            </Box>
          </ThemeProvider>
        </Context.Provider>
      </Fragment>
    </Router>
  )
}

export default App