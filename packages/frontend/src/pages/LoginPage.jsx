import React, {useState} from 'react'
import {
  Grid, Paper, TextField, Typography, Button, Grow, Snackbar, Alert
} from '@mui/material'
import {grey} from '@mui/material/colors'
import {
  ConstructionOutlined
} from '@mui/icons-material'
import apiClient from '../apiClient'
import {useNavigate} from 'react-router-dom'

export const LoginPage = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [sbOpen, sbSetOpen] = useState(false)
  const [sbColor, setSbColor] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const loginHandler = async () => {
    if (!login || !password) {
      setMessage('Введите логин и пароль')
      return
    }
    try {
      setLoading(true)
      const res = await apiClient.post('/auth/login', {
          login,
          password,
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      localStorage.setItem('accessToken', res.data.data.token)
      localStorage.setItem('role', res.data.data.user.role)

      setLoading(false)
      setSbColor('success')
      setMessage('Успешный вход')
      sbSetOpen(true)
      navigate('/')
    } catch (err) {
      setLoading(false)
      setSbColor('error')
      setMessage('Ошибка: ' + (err.response?.data?.message || err.message))
      sbSetOpen(true)
    }
  };

  const handleCloseError = () => {
    sbSetOpen(false)
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={sbOpen}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >

        <Alert
          onClose={handleCloseError}
          severity={sbColor}
          sx={{width: '100%'}}
        >
          {message}
        </Alert>
      </Snackbar>
      <Grow
        in
      >
        <Paper
          sx={{p: 4, my: 2, pb: 8}}
        >
          <Grid
            container
            justifyContent={'center'}
            alignItems={'center'}
            flexDirection={'column'}
            spacing={2}
          >
            <Grid
              item
            >
              <ConstructionOutlined
                color={'primary'}
                fontSize={'large'}
              />
            </Grid>
            <Grid
              item
            >
              <Typography
                variant={'h5'}
                align={'center'}
              >
                Войдите в свой аккаунт
              </Typography>
              <Typography
                variant={'caption'}
                align={'center'}
                color={grey[500]}
              >
                Для управления строительными работами
              </Typography>
            </Grid>
            <Grid
              item
            >
              <TextField
                label={'Логин'}
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder={'Ваш логин'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loginHandler().then(() => false)
                }}
                fullWidth
                required
              />
            </Grid>
            <Grid
              item
            >
              <TextField
                label={'Пароль'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={'Ваш пароль'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') loginHandler().then(() => false)
                }}
                type={'password'}
                fullWidth
                required
              />
            </Grid>
            <Grid
              item
            >
              <Button
                variant={'contained'}
                fullWidth
                onClick={loginHandler}
                loading={loading}
              >
                Войти
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grow>
    </>
  )
}