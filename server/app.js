require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

const notFoundMiddleware = require('./middlewares/not-found')
const errorHandlerMiddleware = require('./middlewares/error-handler')

app.use(express.static('./public'))
app.use(express.json())

const cookieParser = require('cookie-parser')
app.use(cookieParser(process.env.JWT_SECRET))

const connectDB = require('./db/connect')
const authRouter = require('./routes/auth')
const dashboardRouter = require('./routes/dashboard')
const userRouter = require('./routes/user')

// *** routes
app
  .use('/api/auth', authRouter)
  .use('/api/dashboard', dashboardRouter)
  .use('/api/user', userRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () => {
      console.log(`listening port: ${port}`);
    })
  } catch (err) {
    console.error(err);
  }
}

start()