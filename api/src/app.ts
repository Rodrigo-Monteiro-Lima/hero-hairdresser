import express, { Application } from 'express'
import { UsersRoutes } from './routes/users.routes'
import { errorMiddleware } from './middlewares/error'
import { SchedulesRoutes } from './routes/schedules.routes'

const app:Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const usersRoutes = new UsersRoutes().getRoutes()
const schedulesRoutes = new SchedulesRoutes().getRoutes()

app.use('/users', usersRoutes);
app.use('/schedules', schedulesRoutes);

app.use(errorMiddleware)

export default app