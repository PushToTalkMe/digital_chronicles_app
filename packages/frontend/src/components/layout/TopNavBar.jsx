import React, {useState} from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  MenuOutlined,
  PermIdentityOutlined,
  LocationCityOutlined,
  LogoutOutlined,
  NotificationsOutlined
} from '@mui/icons-material'
import {Link as RouterLink, useNavigate, useLocation} from 'react-router-dom'

export const TopNavBar = () => {

  const [drawerStatus, setDrawerStatus] = useState(false)

  const toggleDrawer = (newOpen) => () => {
    setDrawerStatus(newOpen)
  };

  const navigate = useNavigate()

  const LOCATION = useLocation()

  const detectPageTitle = () => {
    const ROUTE_TITLES = {
      '/': 'Объекты',
      '/tasks': 'Задачи',
      '/profile': 'Профиль',
      '/login': 'Digital Chronicles App',
    }
    return ROUTE_TITLES[LOCATION.pathname] || 'Главная'
  }
  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    navigate('/login')
  }
  return (
      <>
        <Drawer open={drawerStatus} onClose={toggleDrawer(false)}>
          <Box
              sx={{width: 250}}
              role={'presentation'}
              onClick={toggleDrawer(false)}
          >
            <List>
              <ListItem
                  key={'objects'}
                  component={RouterLink}
                  to={'/'}
                  disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    <LocationCityOutlined/>
                  </ListItemIcon>
                  <ListItemText
                      primary={'Объекты'}
                      sx={{color: 'initial'}}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem
                  key={'tasks'}
                  component={RouterLink}
                  to={'/tasks'}
                  disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <NotificationsOutlined/>
                  </ListItemIcon>
                  <ListItemText
                      primary={'Задачи'}
                      sx={{color: 'initial'}}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem
                  key={'profile'}
                  component={RouterLink}
                  to={'/profile'}
                  disablePadding
              >
                <ListItemButton>
                  <ListItemIcon>
                    <PermIdentityOutlined/>
                  </ListItemIcon>
                  <ListItemText
                      primary={'Профиль'}
                      sx={{color: 'initial'}}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem key={'logout'} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutOutlined/>
                  </ListItemIcon>
                  <ListItemText
                      primary={'Выход'}
                      sx={{color: 'initial'}}
                      onClick={handleLogout}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
        <AppBar
            position={'static'}
            color={'inherit'}
            elevation={2}
            sx={{
              alignItems: 'center'
            }}
        >
          <Container>
            <Toolbar>
              <IconButton
                  size={'small'}
                  edge={'start'}
                  color={'inherit'}
                  aria-label={'menu'}
                  sx={{
                    mr: 2,
                    display: {
                      sm: 'flex',
                      xs: 'none'
                    }
                  }}
                  onClick={toggleDrawer(true)}
              >
                <MenuOutlined/>
              </IconButton>
              <Typography
                  variant={'h6'}
              >
                {detectPageTitle()}
              </Typography>
            </Toolbar>
          </Container>
        </AppBar>
      </>
  )
}