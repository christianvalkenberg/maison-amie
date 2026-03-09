import { z } from 'zod';

// Kameربoeking
export const bookingSchema = z.object({
  roomId: z.string().uuid('Ongeldig kamer ID'),
  checkIn: z.string().refine((d) => !isNaN(Date.parse(d)) && new Date(d) >= new Date(new Date().toDateString()), {
    message: 'Ongeldige of verleden datum voor aankomst',
  }),
  checkOut: z.string().refine((d) => !isNaN(Date.parse(d)), {
    message: 'Ongeldige datum voor vertrek',
  }),
  name: z.string().min(1).max(100),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().max(30).optional(),
  guests: z.number().int().min(1).max(20).optional(),
  message: z.string().max(2000).optional(),
}).refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
  message: 'Vertrekdatum moet na aankomstdatum liggen',
});

// Activiteitenboeking
export const activityBookingSchema = z.object({
  slotId: z.string().uuid('Ongeldig slot ID'),
  name: z.string().min(1).max(100),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().max(30).optional(),
  participants: z.number().int().min(1).max(50).optional(),
});

// Contactformulier
export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().max(30).optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
});

// Admin login
export const adminLoginSchema = z.object({
  password: z.string().min(1).max(100),
});
