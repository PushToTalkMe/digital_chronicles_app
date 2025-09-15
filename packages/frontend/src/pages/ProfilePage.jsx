import React from 'react'
import {
  Grid, Paper, Typography, Grow
} from '@mui/material'
import {
  PermIdentityOutlined
} from '@mui/icons-material'

export const ProfilePage = () => {
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
              <PermIdentityOutlined
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
                Профиль
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grow>
    </>
  )
}