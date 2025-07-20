export const API_ENDPOINTS = {
  USERS: "/users",
  SINGLE_USER: (userId: string | number) => `/users/${userId}`,
  PARTNERS: "/partners",
  SINGLE_PARTNER: (partnerId: string | number) => `/partners/${partnerId}`,
};
