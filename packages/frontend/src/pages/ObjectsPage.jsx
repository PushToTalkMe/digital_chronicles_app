import React, {useState} from 'react'
import {
  Box, Container, Divider, FormControl, Grid, InputAdornment, InputLabel,
  MenuItem, Paper, Select, TextField, Typography, Grow
} from '@mui/material'
import {SearchOutlined} from '@mui/icons-material'

const OBJECTS = [
  {
    id: 1,
    name: 'Название объекта',
    status: 'Статус объекта',
    img: 'https://placehold.co/72x72'
  },
  {
    id: 2,
    name: 'Название объекта 2',
    status: 'Статус объекта 2',
    img: 'https://placehold.co/72x72'
  },
  {
    id: 3,
    name: 'Название объекта 3',
    status: 'Статус объекта 3',
    img: 'https://placehold.co/72x72'
  },
  {
    id: 4,
    name: 'Название объекта 4',
    status: 'Статус объекта 4',
    img: 'https://placehold.co/72x72'
  },
  {
    id: 5,
    name: 'Название объекта 5',
    status: 'Статус объекта 5',
    img: 'https://placehold.co/72x72'
  },
];

export const ObjectsPage = () => {
  const [status, setStatus] = useState('')
  const [date, setDate] = useState('')

  const handleStatusChange = (event) => {
    setStatus(event.target.value)
  }

  const handleDateChange = (event) => {
    setDate(event.target.value)
  }

  return (
    <>
      <Grow
        in
      >
        <Paper
          sx={{py: 4, my: 2}}
        >
          <Container>
            <Grid
              container
              flexDirection={'column'}
              spacing={2}
            >
              <Grid
                item
              >
                <TextField
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position={'start'}>
                          <SearchOutlined/>
                        </InputAdornment>
                      )
                    }
                  }}
                  fullWidth
                  placeholder={'Поиск'}
                />
              </Grid>
              <Grid item>
                <Grid
                  container
                  spacing={1}
                >
                  <Grid item>
                    <FormControl sx={{minWidth: 128}} size={'small'} fullWidth>
                      <InputLabel
                        id={'status-select-label'}
                      >
                        Статус
                      </InputLabel>
                      <Select
                        labelId={'status-select-label'}
                        id={'status-select'}
                        value={status}
                        label={'Статус'}
                        onChange={handleStatusChange}
                      >
                        <MenuItem value={10}>Готов</MenuItem>
                        <MenuItem value={20}>В работе</MenuItem>
                        <MenuItem value={30}>На проверке</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl sx={{minWidth: 128}} size={'small'} fullWidth>
                      <InputLabel
                        id={'date-select-label'}
                      >
                        Дата
                      </InputLabel>
                      <Select
                        labelId={'date-select-label'}
                        id={'date-select'}
                        value={date}
                        label={'Дата'}
                        onChange={handleDateChange}
                      >
                        <MenuItem value={10}>Сегодня</MenuItem>
                        <MenuItem value={20}>Завтра</MenuItem>
                        <MenuItem value={30}>На неделе</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {
                OBJECTS.map((el) => (
                  <>
                    <Divider variant={'fullWidth'}/>
                    <Grid
                      item
                    >
                      <Grid
                        container
                        spacing={1}
                      >
                        <Grid item>
                          <Box
                            component={'img'}
                            src={el.img}
                            sx={{
                              borderRadius: 2,
                              width: 64,
                            }}
                          >

                          </Box>
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            flexDirection={'column'}
                          >
                            <Grid item>
                              <Typography fontWeight={'bold'}>
                                {el.name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant={'body2'}>
                                {el.status}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ))}
            </Grid>
          </Container>
        </Paper>
      </Grow>
    </>
  )
}