<template>
  <div>
    <PriceDolar />
    <div class="q-pa-sm q-mt-lg">
        <q-table
          title="Compras"
          :data="datos"
          :columns="columns"
          row-key="name"
          binary-state-sort
          :filter="search"
        >
        <template v-slot:body="props">
          <q-tr :props="props">
              <q-td key="created_at" :props="props">
                {{ props.row.created_at  }}
              </q-td>
              <q-td key="hora" :props="props">
                {{ props.row.hora }}
              </q-td>
              <q-td key="descripcion" :props="props">
                {{ props.row.descripcion }}
              </q-td>
              <q-td key="total" :props="props">
                {{ props.row.total }} $
              </q-td>
              <q-td key="total_bs" :props="props">
                {{ props.row.total_bs }}
              </q-td>
              <q-td key="ver" :props="props">
                <q-btn  :to="'compra/'+props.row.id" round color="primary" icon="visibility">
                  <q-tooltip content-class="bg-amber text-black shadow-4" :offset="[10, 10]">
                    Ver Compra
                  </q-tooltip>
                </q-btn>
              </q-td>
          </q-tr>
          </template>
          <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="search" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
          </q-input>
          </template>
        </q-table>
        <div class="absolute-top text-center q-mt-sm">
          <q-btn  color="primary" round size="24px" icon="add" @click="dialog = true"/>
        </div>
        <q-dialog
          v-model="dialog"
          persistent
          :maximized="maximizedToggle"
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <AddCompra :dolar="precioDolar" />
        </q-dialog>
    </div>
  </div>
</template>

<script>
import AddCompra from 'src/components/Modals/AddCompraComponent.vue'
import PriceDolar from 'src/components/PriceDolar.vue'
import { db } from 'boot/firebase';

export default {
  components : { AddCompra,PriceDolar },
  name: 'Compras',
  data (){
    return {
      dialog: false,
      maximizedToggle : true,
      precioDolar : 0,
      search : '',
      columns: [
          {
            name: 'created_at',
            required: true,
            label: 'Fecha',
            align: 'left',
            field: row => row.created_at,
            format: val => `${val}`,
            sortable: true,
            classes: 'bg-grey-2 ellipsis',
            style: 'max-width: 100px',
            headerClasses: 'bg-primary text-white'
          },
          { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion', sortable: true },
          { name: 'hora', label: 'Hora', field: 'hora', sortable: true},
          { name: 'total', label: 'TOTAL ($)', field: 'total' },
          { name: 'total_bs', label: 'TOTAL BS', field: 'total_bs' },
          { name: 'ver', label: 'Ver', field: 'eliminar', headerClasses: 'bg-primary text-white',classes: 'bg-blue-2 ellipsis', },
      ],
      datos : []
    }
  },
  created() {
      this.$root.$on('precio', (v) => {
          this.precioDolar = v;
      });
        this.$root.$on('closeModal', () => {
          this.dialog = false;
      });
      this.$root.$on('saveCompra', () => {
        this.getAllcompras();
      });
  },
    mounted() {
      this.getAllcompras();
    },
    methods : {
      async getAllcompras() {
          this.$q.loading.show()
          const query = await db.collection('compras');
          query.get()
                .then((querySnapshot) => {
                  this.datos = [];
                  
                  querySnapshot.forEach((doc) => {
                        this.datos.push({
                            ...doc.data(),
                            id : doc.id
                        })
                        this.$q.loading.hide()
                  });
                })
                
                .catch((error) => {
                  this.$q.loading.hide()
                  this.$q.notify({
                        color: 'red-4',
                        textColor: 'white',
                        icon: 'cloud_done',
                        message: error.message
                  })
                });
      },
  }
}
</script>
