import React, {useState, useEffect, useCallback} from 'react'
import {useParams, useNavigate} from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Grow,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  DialogContent,
  DialogContentText,
  DialogActions,
  Dialog,
  Snackbar,
  Tab, Grid, TextField, Link
} from '@mui/material'
import {TabContext, TabList, TabPanel} from '@mui/lab'
import {styled, useTheme} from '@mui/material/styles'
import {grey, red, green} from '@mui/material/colors'
import apiClient from '../apiClient'
import {
  ChevronLeftOutlined,
  FileUpload,
  Refresh,
  Route
} from '@mui/icons-material'
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

const MEASUREMENT_LABELS = {
  RUNNING_METER: 'м',
  SQUARE_METER: 'м²',
  PIECE: 'шт'
}

export const FacilityDetailPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activating, setActivating] = useState(false)

  const [completedItems, setCompletedItems] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [sbOpen, setSbOpen] = useState(false)
  const [sbColor, setSbColor] = useState('success')
  const [sbMessage, setSbMessage] = useState('')

  const [dOpen, setDOpen] = useState(false)
  const [dContent, setDContent] = useState(null)
  const [dApplyText, setDApplyText] = useState('OK')

  const [submitted, setSubmitted] = useState(false)

  const [currentAction, setCurrentAction] = useState('')

  const [tab, setTabValue] = useState('1')

  const [docData, setDocData] = useState([])

  const [newDocsData, setNewDocsData] = useState({})


  const theme = useTheme()

  const loadFacility = useCallback(async () => {
    try {
      setLoading(true)
      const res = await apiClient.post(`/facility/${id}`)
      console.log(res)
      setFacility(res.data.data)
      setError(null)
    } catch (err) {
      if (err.code === 'ERR_BAD_REQUEST') {
        setError('У Вас нет доступа к этому объекту')
      } else {
        setError('Не удалось загрузить объект')
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  const loadYMap = useCallback(() => {
    ymaps.ready(() => {
      if (document.querySelector('#map')) {
        if (document.querySelector('#map ymaps')) {
          document.querySelectorAll('#map ymaps').forEach((el) => {
            el.remove()
          })
        }
        if (!document.querySelector('#map ymaps')) {
          const OBJECT_MAP = new ymaps.Map('map', {
            center: facility.polygon.coordinates[0][0][0],
            zoom: 14
          })
          let polygon_data
          if (facility.polygon.coordinates[0].length === 1) {
            polygon_data = [facility.polygon.coordinates[0][0]]
          } else {
            const outer_polygon_coords = facility.polygon.coordinates[0][0]
            const inner_polygon_coords = facility.polygon.coordinates[0][1]
            polygon_data = [outer_polygon_coords, inner_polygon_coords]
          }
          let polygon = new ymaps.Polygon(
            polygon_data,
            {
              hintContent: 'Полигон объекта',
              balloonContentHeader: facility.title,
              balloonContentFooter: STATUS_LABELS[facility.status],
            },
            {
              strokeColor: '#121212',
              strokeStyle: 'dash',
              strokeOpacity: 0.75,
              strokeWidth: 1,
              interactivityModel: 'default#transparent',
              fillColor: '#f43688',
              fillOpacity: 0.25,
            }
          )
          OBJECT_MAP.geoObjects.removeAll()
          OBJECT_MAP.geoObjects.add(polygon)
          OBJECT_MAP.setBounds(polygon.geometry.getBounds())
        }
      }
    })
  }, [facility])

  useEffect(() => {
    loadFacility()
  }, [])

  useEffect(() => {
    loadYMap()
  }, [facility])

  if (loading) {
    return (
      <Container sx={{py: 4, display: 'flex', justifyContent: 'center'}}>
        <CircularProgress/>
      </Container>
    )
  }

  if (error || !facility) {
    return (
      <Container sx={{py: 4}}>
        <IconButton
          size={'small'}
          sx={{
            display: {
              xs: 'none',
              sm: 'flex',
            },
            mb: 2,
          }}
          onClick={() => {
            if (!window.history.length) {
              navigate('/')
            } else {
              navigate(-1)
            }
          }}
        >
          <ChevronLeftOutlined/>
        </IconButton>
        <Alert severity={'error'}>{error || 'Объект не найден'}</Alert>
      </Container>
    )
  }

  const rawItems = facility.actOfOpening?.checkList?.items || []

  const flattenedItems = rawItems.flatMap(parent => {
    const parentWithId = {...parent, parentId: null}
    const children = (parent.subitems || []).map(child => ({
      ...child,
      parentId: parent.id
    }))
    return [parentWithId, ...children]
  })

  const items = flattenedItems
  const mainItems = items.filter(item => item.parentId === null)

  const grouped = items.reduce((acc, item) => {
    if (item.parentId !== null) {
      if (!acc[item.parentId]) acc[item.parentId] = []
      acc[item.parentId].push(item)
    }
    return acc
  }, {})

  const allItems = items.map(item => item.id)
  const isAllCompleted = allItems.length > 0 && allItems.every(id => completedItems[id] === true)

  const handleToggle = (id) => {
    setCompletedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const sendAct = async () => {
    try {
      setSubmitting(true)

      const subitems = items.map(item => ({
        id: item.id,
        completed: completedItems[item.id] ? 'YES' : 'NO'
      }))

      await apiClient.post(`/facility/sendActOfOpening/${facility.id}/`, {
        subitems
      })

    } catch (err) {
      console.error(err)
      setDOpen(false)
      loadFacility()
    } finally {
      setSubmitting(false)
      setDOpen(false)
      setSubmitted(true)
      loadFacility()
      setSbMessage('Акт успешно отправлен на подтверждение')
    }
  }

  const approveAct = async () => {
    try {
      setSubmitting(true)

      await apiClient.post(`/facility/approveActOfOpening/${facility.id}/`)

    } catch (err) {
      console.error(err)
      setDOpen(false)
      loadFacility()
    } finally {
      setSubmitting(false)
      setDOpen(false)
      setSubmitted(true)
      loadFacility()
      setSbOpen(true)
      setSbMessage('Акт успешно подтверждён')
    }
  }

  const sbHandleClose = () => {
    setSbOpen(false)
  }

  const handleSubmit = async () => {
    if (!isAllCompleted) return

    setCurrentAction('actSend')
    setDOpen(true)
    setDContent('Отправить акт открытия на подтверждение?')
    setDApplyText('Отправить акт')
  }

  const applyHandler = () => {
    if (currentAction === 'actSend') {
      sendAct()
    }
    if (currentAction === 'actApprove') {
      approveAct()
    }
  }

  const dCloseHandler = () => {
    setDOpen(false)
  }

  const actApprove = () => {

    setCurrentAction('actApprove')
    setDOpen(true)
    setDContent('Вы действительно хотите подтвердить акт открытия?')
    setDApplyText('Подтвердить')
  }

  const tabHandler = (event, newValue) => {
    if (newValue === '1') {
      loadYMap()
    }
    setTabValue(newValue)
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  })

  const showSnackbar = (color = 'success', text) => {
    setSbColor(color)
    setSbMessage(text)
    setSbOpen(true)
  }

  const handleFileChange = async (e, workId) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)
    try {
      setLoading(true)
      const res = await apiClient.post(`/material/send/${workId}`, formData)
      console.log(res)
      const resData = res.data.data
      setLoading(false)
      if (
        resData.cargo === '' &&
        resData.title === '' &&
        resData.weight === ''
      ) {
        showSnackbar(
          'error',
          `Неудалось распознать содержимое документа. Пожалуйста, попробуйте загрузить более качественное изображение`
        )
        return
      }

      const newItem = {
        id: workId,
        title: resData.title,
        cargo: resData.cargo,
        weight: resData.weight,
      }

      setDocData((prev) => [...prev, newItem])

      setNewDocsData((prev) => ({
        ...prev,
        [workId]: {
          title: resData.title,
          cargo: resData.cargo,
          weight: resData.weight,
        },
      }))
    } catch (err) {
      showSnackbar('error', `Возникла непредвиденная ошибка. ${err.response?.data?.error || err.message}`)
      console.error(err)
      loadFacility()
    }
  }

  const docsApprove = async (docId, data) => {
    const res = await apiClient.post(`/material/approve/${docId}`, {
      info: data
    })
    showSnackbar('success', 'Документ подтверждён')
    setDocData([])
    loadFacility()
  }

  const handleDocsApprove = (docId) => {
    const currentData = {
      title: newDocsData[docId]?.title ?? '',
      cargo: newDocsData[docId]?.cargo ?? '',
      weight: newDocsData[docId]?.weight ?? '',
    }
    docsApprove(docId, currentData)
  }

  const readNewDocsData = (docId, field) => (event) => {
    setNewDocsData((prev) => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: event.target.value,
      },
    }))
  }

  return (
    <>
      <Loading status={loading}/>
      <Dialog
        open={dOpen}
        onClose={dCloseHandler}
      >
        <DialogContent>
          <DialogContentText component={'div'}>
            {dContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={dCloseHandler}>Отмена</Button>
          <Button onClick={applyHandler} color={'success'} autoFocus>
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
          severity={sbColor}
          sx={{width: '100%'}}
        >
          {sbMessage}
        </Alert>
      </Snackbar>

      <Grow in>
        <Container sx={{py: 2}}>
          <Paper sx={{p: 2}}>
            <TabContext value={tab}>
              <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList
                  onChange={tabHandler}
                  aria-label={'Вкладки объекта'}
                  scrollButtons={'auto'}
                  variant={'scrollable'}
                >
                  <Tab label={'Общая информация'} value={'1'}/>
                  {facility.listOfWorks.length &&
                  <Tab label={'Входной контроль'} value={'2'}/>
                  }
                  <Tab label={'Инспекционная схема'}/>
                </TabList>
              </Box>
              <TabPanel value={'1'} sx={{p: 0, pt: 2}}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2,
                    alignItems: 'center'
                  }}>
                  <IconButton
                    size={'small'}
                    sx={{
                      display:
                        {
                          xs: 'none',
                          sm: 'flex'
                        }
                    }}
                    onClick={() => {
                      if (!window.history.length) {
                        navigate('/')
                      } else {
                        navigate(-1)
                      }
                    }}
                  >
                    <ChevronLeftOutlined/>
                  </IconButton>
                  <Typography variant={'h5'} fontWeight={'bold'}>
                    {facility.title}
                  </Typography>
                </Box>

                <Box sx={{display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap'}}>
                  <Chip
                    label={STATUS_LABELS[facility.status] || facility.status}
                    color={STATUS_COLORS[facility.status] || 'default'}
                    size={'small'}
                    variant={'outlined'}
                  />
                </Box>
                <Box sx={{display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap'}}>
                  <Chip
                    label={`Создано: ${new Date(facility.createdAt).toLocaleDateString('ru-RU')}`}
                    color={'default'}
                    size={'small'}
                    variant={'outlined'}
                  />
                  <Chip
                    label={`Начало работ: ${new Date(facility.plannedStartAt).toLocaleDateString('ru-RU')}`}
                    color={'warning'}
                    size={'small'}
                    variant={'outlined'}
                  />
                  <Chip
                    label={`Обновлено: ${new Date(facility.updatedAt).toLocaleDateString('ru-RU')}`}
                    color={'success'}
                    size={'small'}
                    variant={'outlined'}
                  />
                </Box>

                <Box
                  sx={{
                    border: 1,
                    p: 1,
                    borderRadius: 4,
                    borderColor: 'divider',
                    backgroundColor: theme.palette.background.default
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: {
                        sm: 512,
                        xs: 256
                      },
                      mb: 2,
                    }}
                    id={'map'}
                  />
                  <Grid
                    container
                    justifyContent={'flex-end'}
                    alignItems={'center'}
                  >
                    <Grid item>
                      <IconButton
                        onClick={loadYMap}
                        color={'primary'}
                      >
                        <Refresh/>
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <IconButton
                        component={Link}
                        target={'_blank'}
                        href={`https://yandex.ru/maps/?rtext=${facility.polygon.coordinates[0][0][0][0]},${facility.polygon.coordinates[0][0][0][1]}`}
                        color={'primary'}
                      >
                        <Route/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>

                {/* Чек-лист */}
                {facility.actOfOpening?.checkList && (
                  <Box>
                    <Divider sx={{my: 2}}/>
                    <Typography
                      variant={'body1'}
                      color={(facility.actOfOpening.status === 'WAITING_APPROVE' || localStorage.getItem('role') !== 'CUSTOMER') ? grey[500] : 'default'}
                      gutterBottom
                    >
                      {facility.actOfOpening.checkList.title}
                    </Typography>

                    <FormControl component={'fieldset'} fullWidth>
                      <FormGroup>
                        {mainItems.map((main) => (
                          <Box key={main.id} sx={{mb: 1}}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={!!completedItems[main.id] || (facility.actOfOpening.status === 'WAITING_APPROVE' || localStorage.getItem('role') !== 'CUSTOMER')}
                                  onChange={() => handleToggle(main.id)}
                                  disabled={(facility.actOfOpening.status === 'WAITING_APPROVE' || localStorage.getItem('role') !== 'CUSTOMER')}
                                />
                              }
                              label={main.text}
                            />
                            {main.description && (
                              <Typography
                                variant={'caption'}
                                sx={{ml: 1}}
                              >
                                {main.description}
                              </Typography>
                            )}

                            {/* Подвопросы */}
                            {(grouped[main.id] || []).map((sub) => (
                              <Box key={sub.id} sx={{ml: 4, mt: 1}}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={!!completedItems[sub.id]}
                                      onChange={() => handleToggle(sub.id)}
                                    />
                                  }
                                  label={sub.text}
                                />
                                {sub.description && (
                                  <Typography variant={'caption'}>
                                    {sub.description}
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </Box>
                        ))}
                      </FormGroup>
                    </FormControl>
                    {/* Кнопка отправки */}
                    {(facility.actOfOpening?.status === 'IN_PROCESS' && localStorage.getItem('role') === 'CUSTOMER') && (
                      <Button
                        variant={'contained'}
                        color={'primary'}
                        onClick={handleSubmit}
                        disabled={!isAllCompleted || submitting || submitted}
                        fullWidth
                        sx={{mt: 2}}
                      >
                        {submitting ? 'Отправка...' : 'Отправить акт открытия'}
                      </Button>
                    )}
                  </Box>
                )}

                {(localStorage.getItem('role') === 'TECHNICAL_CUSTOMER' && facility.actOfOpening?.status === 'DONE') && (
                  <Alert>
                    Акт открытия успешно подтверждён
                  </Alert>
                )}

                {(localStorage.getItem('role') === 'TECHNICAL_CUSTOMER' && facility.actOfOpening?.status === 'IN_PROCESS') && (
                  <Alert severity={'warning'}>
                    Акт открытия не был отправлен на подтверждение
                  </Alert>
                )}

                {(
                  facility.actOfOpening?.status === 'WAITING_APPROVE' &&
                  localStorage.getItem('role') === 'CUSTOMER'
                ) && (
                  <Button
                    variant={'contained'}
                    disabled
                    fullWidth
                    sx={{mt: 2}}
                  >
                    {'Ожидание подтверждения'}
                  </Button>
                )}

                {(
                  facility.actOfOpening?.status === 'WAITING_APPROVE' &&
                  localStorage.getItem('role') === 'TECHNICAL_CUSTOMER'
                ) && (
                  <Button
                    variant={'contained'}
                    color={'success'}
                    sx={{mt: 2}}
                    onClick={actApprove}
                    fullWidth
                  >
                    {'Подтвердить акт'}
                  </Button>
                )}
              </TabPanel>
              {facility.listOfWorks.length &&
              <TabPanel value={'2'}>
                <FormControl component={'fieldset'} fullWidth>
                  <FormGroup>
                    {facility.listOfWorks.map((work) => (
                      <Box key={work.id} sx={{mb: 1}}>
                        <Grid container spacing={1} sx={{pt: 1}}>
                          <Grid item>
                            <Chip
                              label={`Начать: ${new Date(work.startAt).toLocaleDateString('ru-RU')}`}
                              size={'small'}
                              color={'info'}
                              variant={'outlined'}
                            />
                          </Grid>
                          <Grid item>
                            <Chip
                              label={`Завершить к: ${new Date(work.endAt).toLocaleDateString('ru-RU')}`}
                              size={'small'}
                              color={'warning'}
                              variant={'outlined'}
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          sx={{pt: 2}}
                          direction={'column'}
                          spacing={1}
                        >
                          <Grid item>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={work.materials.length}
                                  disabled={work.materials.length}
                                />
                              }
                              label={`${work.title}, ${work.count} ${MEASUREMENT_LABELS[work.measurement]}`}
                            />
                          </Grid>
                          {docData.map((el) => (
                            el.id === work.id ? (
                              <Box
                                key={el.id}
                                sx={{
                                  my: 1,
                                  p: 2,
                                  border: 1,
                                  borderRadius: 2,
                                  borderColor: red[500]
                                }}
                              >
                                <Grid
                                  container
                                  direction={'column'}
                                  spacing={2}
                                >
                                  <Grid item>
                                    <TextField
                                      label={'Заголовок'}
                                      value={newDocsData[el.id]?.title ?? el.title}
                                      onChange={readNewDocsData(el.id, 'title')}
                                      rows={'2'}
                                      multiline
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item>
                                    <TextField
                                      label={'Груз'}
                                      value={newDocsData[el.id]?.cargo ?? el.cargo}
                                      onChange={readNewDocsData(el.id, 'cargo')}
                                      rows={'2'}
                                      multiline
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item>
                                    <TextField
                                      label={'Вес'}
                                      value={newDocsData[el.id]?.weight ?? el.weight}
                                      onChange={readNewDocsData(el.id, 'weight')}
                                      rows={'2'}
                                      multiline
                                      fullWidth
                                    />
                                  </Grid>
                                  <Grid item>
                                    <Button
                                      variant={'outlined'}
                                      color={'success'}
                                      onClick={() => {
                                        handleDocsApprove(el.id)
                                      }}
                                    >
                                      Подтвердить
                                    </Button>
                                  </Grid>
                                </Grid>
                              </Box>
                            ) : null
                          ))}
                          {work.materials.length === 0 && (
                            <Grid item>
                              <Button
                                component={'label'}
                                variant={'outlined'}
                                startIcon={<FileUpload/>}
                                disabled={loading}
                              >
                                Добавить материалы
                                <VisuallyHiddenInput
                                  type={'file'}
                                  onChange={(e) => {
                                    handleFileChange(e, work.id)
                                  }}
                                  accept={'image/*'}
                                />
                              </Button>
                            </Grid>
                          )}
                          {work.materials.length > 0 && (
                            <>
                              {work.materials.map((el, key) => (
                                <Box
                                  key={key}
                                  sx={{
                                    my: 1,
                                    p: 2,
                                    border: 1,
                                    borderRadius: 2,
                                    borderColor: green[500]
                                  }}
                                >
                                  <Grid
                                    container
                                    spacing={2}
                                    direction={'column'}
                                  >
                                    <Grid item>
                                      <Typography>
                                        Наименование: {el.title}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography>
                                        Груз: {el.cargo}
                                      </Typography>
                                    </Grid>
                                    <Grid item>
                                      <Typography>
                                        Вес: {el.weight}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                </Box>
                              ))}
                            </>
                          )}
                        </Grid>
                        <Divider sx={{py: 1}}/>
                      </Box>
                    ))}
                  </FormGroup>
                </FormControl>
              </TabPanel>
              }
            </TabContext>
          </Paper>
        </Container>
      </Grow>
    </>
  )
}