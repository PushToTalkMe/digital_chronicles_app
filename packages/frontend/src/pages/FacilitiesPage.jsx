import React, {useState, useEffect, useCallback} from 'react'
import {
  Box,
  Container,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Grow,
  Chip,
  Snackbar,
  Button,
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import {SearchOutlined} from '@mui/icons-material'
import {Link} from 'react-router-dom'

import apiClient from '../apiClient'
import {Loading} from '../components/ui-kit/Loading'

const STATUS_LABELS = {
  WAITING: 'Ожидание',
  IN_PROCESS: 'В работе',
  DONE: 'Завершён'
}

const STATUS_COLORS = {
  WAITING: 'warning',
  IN_PROCESS: 'info',
  DONE: 'success'
}


const isWithinDateRange = (facility, dateFilter) => {
  if (!dateFilter) return true

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(endOfDay.getDate() + 1)

  const facilityDate = new Date(facility.plannedStartAt)

  switch (dateFilter) {
    case 'today':
      return facilityDate >= startOfDay && facilityDate < endOfDay
    case 'tomorrow':
      const tomorrowStart = new Date(startOfDay)
      tomorrowStart.setDate(tomorrowStart.getDate() + 1)
      const tomorrowEnd = new Date(tomorrowStart)
      tomorrowEnd.setDate(tomorrowEnd.getDate() + 1)
      return facilityDate >= tomorrowStart && facilityDate < tomorrowEnd
    case 'week':
      const endOfWeek = new Date(startOfDay)
      endOfWeek.setDate(startOfDay.getDate() + 7)
      return facilityDate >= startOfDay && facilityDate < endOfWeek
    default:
      return true
  }
}

export const FacilitiesPage = () => {
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [sbOpen, setSbOpen] = useState(false)
  const [sbColor, setSbColor] = useState('')
  const [sbMessage, setSbMessage] = useState('')

  const [dOpen, setDOpen] = useState(false)
  const [dContent, setDContent] = useState('')
  const [dApplyText, setDApplyText] = useState('')

  const [fId, setFId] = useState('')

  const loadFacilities = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/facility')
      setFacilities(res.data.data.facilities)
      setError(null)
    } catch (err) {
      setError('Не удалось загрузить объекты')
      console.error('Ошибка загрузки facilities:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFacilities()
  }, [])

  const sendActivate = async () => {
    try {
      setLoading(true)
      await apiClient.post(`/facility/activate/${fId}`)
      await apiClient.get(`/facility/${fId}`)
      setFId('')
    } catch (err) {
      setLoading(false)
      console.error(err)
      loadFacilities()
    } finally {
      setLoading(false)
      loadFacilities()
    }
  }

  const handleActivate = (id) => {
    setDOpen(true)
    setDContent('Активировать объект и начать работы?')
    setDApplyText('Активировать')
    setFId(id)
  }

  const filteredFacilities = facilities.filter(facility => {
    if (statusFilter && facility.status !== statusFilter) return false
    if (!isWithinDateRange(facility, dateFilter)) return false
    if (searchQuery && !facility.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    return true
  })

  const handleStatusChange = (e) => setStatusFilter(e.target.value)
  const handleDateChange = (e) => setDateFilter(e.target.value)
  const handleSearchChange = (e) => setSearchQuery(e.target.value)

  const handleCloseError = () => {
    setError(null)
  }

  const sbHandleClose = () => {
    setSbOpen(false)
  }

  const dCloseHandler = () => {
    setDOpen(false)
  }

  return (
    <>
      <Loading status={loading}/>

      <Dialog
        open={dOpen}
        onClose={dCloseHandler}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dCloseHandler}>Отмена</Button>
          <Button onClick={sendActivate} autoFocus>
            {dApplyText}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        open={sbOpen}
        autoHideDuration={6000}
        onClose={sbHandleClose}
      >

        <Alert
          onClose={sbHandleClose}
          severity={'error'}
          sx={{width: '100%'}}
        >
          {sbMessage}
        </Alert>
      </Snackbar>

      <Grow
        in
      >
        <Paper
          sx={{py: 3, my: 2}}
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
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={'Поиск'}
                  size={'small'}
                />
              </Grid>
              <Grid item>
                <Grid
                  container
                  spacing={1}
                >
                  <Grid item>
                    <FormControl
                      sx={{minWidth: 128}}
                      size={'small'}
                      fullWidth
                    >
                      <InputLabel
                        id={'status-select-label'}
                      >
                        Статус
                      </InputLabel>
                      <Select
                        labelId={'status-select-label'}
                        id={'status-select'}
                        value={statusFilter}
                        label={'Статус'}
                        onChange={handleStatusChange}
                      >
                        <MenuItem value={''}>Все</MenuItem>
                        <MenuItem value={'WAITING'}>Ожидание</MenuItem>
                        <MenuItem value={'IN_PROCESS'}>В работе</MenuItem>
                        <MenuItem value={'DONE'}>Завершён</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl
                      sx={{minWidth: 128}}
                      size={'small'}
                      fullWidth
                    >
                      <InputLabel
                        id={'date-select-label'}
                      >
                        Дата
                      </InputLabel>
                      <Select
                        labelId={'date-select-label'}
                        id={'date-select'}
                        value={dateFilter}
                        label={'Дата'}
                        onChange={handleDateChange}
                      >
                        <MenuItem value={''}>Любая</MenuItem>
                        <MenuItem value={'today'}>Сегодня</MenuItem>
                        <MenuItem value={'tomorrow'}>Завтра</MenuItem>
                        <MenuItem value={'week'}>На неделе</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              {filteredFacilities.length === 0 ? (
                <Grid item>
                  <Typography>Нет объектов по заданным фильтрам</Typography>
                </Grid>
              ) : (
                filteredFacilities.map((facility) => (
                  <React.Fragment key={facility.id}>
                    <Divider variant={'fullWidth'}/>
                    <Grid
                      item
                    >
                      <Link to={`/facility/${facility.id}`} style={{
                        textDecoration: 'none',
                        color: 'inherit'
                      }}>
                        <Grid
                          container
                          spacing={1}
                        >
                          <Grid item>
                            <Box
                              component={'img'}
                              src={'/64x64.svg'}
                              sx={{
                                borderRadius: 2,
                                width: 64,
                              }}
                              alt={'Image error'}
                            >
                            </Box>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              flexDirection={'column'}
                              spacing={1}
                              sx={{minWidth: 0}}
                            >
                              <Grid
                                item
                                sx={{
                                  maxWidth: {
                                    sm: '100%',
                                    xs: 200
                                  },
                                }}
                              >
                                <Typography
                                  fontWeight={'bold'}
                                >
                                  {facility.title}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Chip
                                  label={STATUS_LABELS[facility.status]}
                                  color={STATUS_COLORS[facility.status] || 'default'}
                                  size={'small'}
                                  variant={'outlined'}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Link>
                      {facility.status === 'WAITING' &&
                      <Grid item>
                        <Button
                          variant={'outlined'}
                          size={'small'}
                          sx={{mt: 1}}
                          onClick={() => handleActivate(facility.id)}
                          fullWidth
                        >
                          Активировать
                        </Button>
                      </Grid>
                      }
                    </Grid>
                  </React.Fragment>
                )))}
            </Grid>
          </Container>
        </Paper>
      </Grow>
    </>
  )
}