import { Router } from 'express'
import {
    createPromoCode,
    getPromoCodes,
    getPromoCode,
    activatePromoCode
} from '../controllers/promoCodes'

const router = Router()

// CRUD + activation routes for promo codes
router.post('/', createPromoCode)
router.get('/', getPromoCodes)
router.get('/:code', getPromoCode)
router.post('/:code/activate', activatePromoCode)

export default router