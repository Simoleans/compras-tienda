
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'dolar', component: () => import('pages/Dolar.vue') },
      { path: 'productos', component: () => import('pages/Productos.vue') },
      { path: 'compras', component: () => import('pages/Compras.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  },
]

export default routes
