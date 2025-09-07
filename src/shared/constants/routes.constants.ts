export const ROUTES = {
  home: '/',
  room: {
    root: '/room',
    id: (id: string) => `/room/${id}`,
  },
} as const;
