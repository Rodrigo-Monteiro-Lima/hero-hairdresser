import express, { Application } from 'express'
import { UsersRoutes } from './routes/users.routes'
import { errorMiddleware } from './middlewares/error'

const app:Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const usersRoutes = new UsersRoutes().getRoutes()

app.use('/users', usersRoutes)

app.use(errorMiddleware)

export default app