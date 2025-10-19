import express from 'express'
import event_registrationController from '../controllers/event_registration.controller.js'
import AuthMiddleware from '../middlewares/auth.middleware.js'

const EventRegistrationRoutes = express.Router()

EventRegistrationRoutes.get('/', event_registrationController.listEventRegistrations)
EventRegistrationRoutes.post('/', AuthMiddleware(), event_registrationController.registerForEvent)
EventRegistrationRoutes.get('/my-events', AuthMiddleware(), event_registrationController.getMyEvents)
EventRegistrationRoutes.patch('/:id', event_registrationController.checkInToEvent)
EventRegistrationRoutes.delete('/:id', AuthMiddleware(), event_registrationController.cancelEventRegistration)

export default EventRegistrationRoutes