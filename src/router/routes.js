
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Compras.vue') },
      { path: 'dolar', component: () => import('pages/Dolar.vue') },
      { path: 'productos', component: () => import('pages/Productos.vue') },
      { path: 'compras', component: () => import('pages/Compras.vue') },
      { path: 'compra/:id', component: () => import('pages/VerCompra.vue'),props: true }
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
