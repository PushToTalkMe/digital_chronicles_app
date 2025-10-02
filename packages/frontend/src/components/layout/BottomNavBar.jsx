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
import {Link as RouterLink, useNavigate} from 'react-router-dom'

export const BottomNavBar = () => {
  const [bnValue, setBNValue] = useState(0)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
      <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            display: {
              sm: 'none',
              xs: 'block'
            }
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
              onClick={handleLogout}
              label={'Выход'}
              icon={<LogoutOutlined/>}
          />
        </BottomNavigation>
      </Paper>
  )
}