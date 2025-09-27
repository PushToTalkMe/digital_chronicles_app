import React from 'react'
import {AppBar, Toolbar, Typography} from '@mui/material'
import {useLocation} from 'react-router-dom'

export const TopNavBar = () => {
  const LOCATION = useLocation()
  const detectPageTitle = () => {
    const ROUTE_TITLES = {
      '/': 'Digital Chronicles app',
      '/objects': 'Объекты',
      '/tasks': 'Задачи',
      '/profile': 'Профиль',
    }
    return ROUTE_TITLES[LOCATION.pathname] || 'Главная'
  }
  return (
    <>
      <AppBar
        position={'static'}
        color={'inherit'}
        elevation={2}
        sx={{alignItems: 'center'}}
      >
        <Toolbar>
          <Typography
            variant={'h6'}
          >
            {detectPageTitle()}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}