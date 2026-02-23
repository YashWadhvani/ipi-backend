// services/dashboardServices.js
import { http, apiBase } from './http'

/**
 * Expected response shape (example):
 * {
 *   totals: {
 *     members: 1234,
 *     membersActive: 1100,
 *     chapters: 18,
 *     events: 57,
 *     eventsUpcoming: 9,
 *     registrations7d: 74,
 *     revenueMonth: 265000   // INR, whole rupees
 *   },
 *   upcomingEvents: [
 *     { id, name, startsAt, city: { name, state }, regs: 25 }
 *   ],
 *   recentMembers: [
 *     { id, name, company, city, state, createdAt }
 *   ]
 * }
 */
export const getAdminOverview = async () =>
  http.get(`${apiBase()}/admin/overview`).then(r => r.data)
