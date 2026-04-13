import express from 'express'
import dotenv from 'dotenv'
import promoCodesRouter from './routes/promoCodes'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()
// Boots the Express server
const app = express()
app.use(express.json())

app.use('/promo-codes', promoCodesRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})