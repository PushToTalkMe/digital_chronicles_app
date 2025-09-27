import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material'
import {
  PermIdentityOutlined,
  LocationCityOutlined,
  LogoutOutlined,
  NotificationsOutlined
} from '@mui/icons-material'
import React, {useState} from 'react'
import {Link as RouterLink} from 'react-router-dom'

export const BottomNavBar = () => {
  const [bnValue, setBNValue] = useState(0)

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <BottomNavigation
        showLabels
        value={bnValue}
        onChange={(event, newValue) => {
          setBNValue(newValue)
        }}
        sx={{background: 'none'}}
      >
        <BottomNavigationAction
          component={RouterLink}
          to={'/'}
          label={'Объекты'}
          icon={<LocationCityOutlined/>}
        />
        <BottomNavigationAction
          component={RouterLink}
          to={'/tasks'}
          label={'Задачи'}
          icon={<NotificationsOutlined/>}
        />
        <BottomNavigationAction
          component={RouterLink}
          to={'/profile'}
          label={'Профиль'}
          icon={<PermIdentityOutlined/>}
        />
        <BottomNavigationAction
          component={RouterLink}
          to={'/logout'}
          label={'Выход'}
          icon={<LogoutOutlined/>}
        />
      </BottomNavigation>
    </Paper>
  )
}