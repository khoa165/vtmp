export const API_ENDPOINTS = {
  GET_LINKS: '/links',
  GET_LINKS_COUNT_BY_STATUS: '/links/count-by-status',
  APPROVE_LINK: (id: string) => `/links/${id}/approve`,
  REJECT_LINK: (id: string) => `/links/${id}/reject`,
  TRIGGER_CRON: '/cron/run-immediately',
};
