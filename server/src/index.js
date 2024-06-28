import api from './routes.js'
import express from 'express'
import cors from 'cors'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use(api)

app.listen(port, () => {
    console.log('✅ BlondeFy online')
})