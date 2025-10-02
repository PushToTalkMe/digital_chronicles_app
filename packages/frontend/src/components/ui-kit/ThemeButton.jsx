import React, {useContext} from 'react'

import {
  Fab,
  Grow,
} from '@mui/material'

import {Context} from '../../context'

import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'

/**
 * ThemeButton
 * @return {JSX.Element}
 */
export const ThemeButton = () => {
  const {
    toDarkTheme,
    toLightTheme,
    darkThemeStatus
  } = useContext(Context)

  const changeTheme = () => {
    if (darkThemeStatus) {
      toLightTheme()
      localStorage.setItem('theme', 'light')
    } else {
      toDarkTheme()
      localStorage.setItem('theme', 'dark')
    }
  };

  return (
      <div>
        <Grow in>
          <Fab
              color={'primary'}
              aria-label={'theme'}
              sx={{
                position: 'fixed',
                bottom: {
                  sm: 16,
                  xs: 8 * 10,
                },
                right: 16
              }
              }
              onClick={changeTheme}
          >
            {darkThemeStatus ? <LightModeIcon/> : <DarkModeIcon/>}
          </Fab>
        </Grow>
      </div>
  );
};