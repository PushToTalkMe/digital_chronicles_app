import React from 'react'
import {
  Grid, Paper, Typography, Grow
} from '@mui/material'
import {
  NotificationsOutlined
} from '@mui/icons-material'

export const TasksPage = () => {

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
              <NotificationsOutlined
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
                Задачи
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grow>
    </>
  )
}