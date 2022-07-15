import { Router } from 'express'

import authRoutes from './auth.route'
import roleRoutes from './admin/role.route'
import userRoutes from './user.route'

const routes = Router()

routes.use('/v1/api/auth', authRoutes)

routes.use('/v1/api/role', roleRoutes)

routes.use('/v1/api/user', userRoutes)

export default routes
