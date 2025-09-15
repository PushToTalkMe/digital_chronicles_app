import React from 'react'
import {
  Grid, Paper, TextField, Typography, Button, Grow
} from '@mui/material'
import {grey} from '@mui/material/colors'
import {
  ConstructionOutlined
} from '@mui/icons-material'

export const IndexPage = () => {

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
                placeholder={'Ваш логин'}
                fullWidth
              />
            </Grid>
            <Grid
              item
            >
              <TextField
                label={'Пароль'}
                placeholder={'Ваш пароль'}
                fullWidth
              />
            </Grid>
            <Grid
              item
            >
              <Button
                variant={'contained'}
                fullWidth
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