import { Request, Response, NextFunction } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Explicit type needed because TypeScript 6 doesn't infer _count from Prisma's GetResult
type PromoWithCount = Prisma.PromoCodeGetPayload<{
    include: { _count: { select: { activations: true } } }
}>
// Create a new promo code
export async function createPromoCode(req: Request, res: Response, next: NextFunction) {
    try {
        const { code, discount, limit, expiresAt } = req.body

        if (!code || !discount || !limit || !expiresAt) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const promo = await prisma.promoCode.create({
            data: {
                code,
                discount,
                limit,
                expiresAt: new Date(expiresAt)
            }
        })

        res.status(201).json(promo)
    } catch (err: any) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Promo code already exists' })
        }
        next(err)
    }
}
// Get all promo codes
export async function getPromoCodes(req: Request, res: Response, next: NextFunction) {
    try {
        const promos = await prisma.promoCode.findMany({
            include: { _count: { select: { activations: true } } }
        })
        res.json(promos)
    } catch (err) {
        next(err)
    }
}
// Get a single promo code
export async function getPromoCode(req: Request, res: Response, next: NextFunction) {
    try {
        const promo: PromoWithCount | null = await prisma.promoCode.findUnique({
            where: { code: req.params.code as string },
            include: { _count: { select: { activations: true } } }
        }) as PromoWithCount | null

        if (!promo) {
            return res.status(404).json({ error: 'Promo code not found' })
        }

        res.json(promo)
    } catch (err) {
        next(err)
    }
}
// Activate a promo code
export async function activatePromoCode(req: Request, res: Response, next: NextFunction) {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error: 'Email is required' })
        }

        const promo: PromoWithCount | null = await prisma.promoCode.findUnique({
            where: { code: req.params.code as string },
            include: { _count: { select: { activations: true } } }
        }) as PromoWithCount | null

        if (!promo) {
            return res.status(404).json({ error: 'Promo code not found' })
        }

        if (new Date() > promo.expiresAt) {
            return res.status(400).json({ error: 'Promo code has expired' })
        }

        // Reject if the code has hit its activation cap
        if (promo._count.activations >= promo.limit) {
            return res.status(400).json({ error: 'Promo code activation limit reached' })
        }

        const activation = await prisma.activation.create({
            data: {
                email,
                promoCodeId: promo.id
            }
        })

        res.status(201).json({
            message: 'Promo code activated successfully',
            discount: promo.discount,
            activation
        })
    } catch (err: any) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Email already activated this promo code' })
        }
        next(err)
    }
}