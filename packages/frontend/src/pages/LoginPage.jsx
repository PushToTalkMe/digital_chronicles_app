import React, {useState} from 'react'
import {
  Grid, Paper, TextField, Typography, Button, Grow
} from '@mui/material'
import {grey} from '@mui/material/colors'
import {
  ConstructionOutlined
} from '@mui/icons-material'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export const LoginPage = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const loginHandler = async () => {

    try {
      const res = await axios.post('/api/auth/login', {
            login,
            password,
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          }
      );

      localStorage.setItem('accessToken', res.data.data.token)

      setMessage('Успешный вход. Вы будете перенаправлены на главную страницу через 3 секунды...')
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (err) {
      setMessage('Ошибка: ' + (err.response?.data?.message || err.message))
    }
  };

  return (
      <>
        <Grow
            in
        >
          <Paper
              sx={{p: 4, my: 2}}
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
                >
                  Войти
                </Button>
              </Grid>
              <Grid item>
                {message && (
                    <Typography
                        variant={'body2'}
                        color={'text.error'}
                        sx={{mt: 2}}
                    >
                      {message}
                    </Typography>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grow>
      </>
  )
}