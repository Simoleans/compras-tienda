<template>
  <q-layout view="lHh Lpr lFf" >
    <q-header elevated color="red-5">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          MINI MARKET 1923 C.A
        </q-toolbar-title>

        <!-- <div>Quasar v{{ $q.version }}</div> -->
      </q-toolbar>
    </q-header>

    

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Menú
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
<q-footer>
  
      <q-tabs class="text-white">
        <q-route-tab 
            to="/"
            icon="menu"
            label="Inicio" 
          />
          <q-route-tab 
            to="/dolar"
            icon="money"
            label="Precio - $" 
          />
          <q-route-tab 
            to="/productos"
            icon="bookmark"
            label="Productos" 
          />
          <q-route-tab 
            to="/compras"
            icon="add_shopping_cart"
            label="Compras"
          />
      </q-tabs>
    </q-footer>
    <q-page-container>
      <q-page padding style="padding-top: 66px">
          <div class="q-pa-auto">
            <router-view />
          </div>
        </q-page>
    </q-page-container>
  </q-layout>
</template>


<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Inicio',
    // caption: 'quasar.dev',
    icon: 'account_balance',
    link: '/'
  },
  {
    title: 'Dolar Actual',
    icon: 'money',
    link: '/dolar'
  },
  {
    title: 'Productos',
    icon: 'bookmark',
    link: '/productos'
  },
  {
    title: 'Compras',
    icon: 'add_shopping_cart',
    link: '/compras'
  },
  
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  }
}
</script>
