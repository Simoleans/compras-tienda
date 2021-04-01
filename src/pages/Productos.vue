<template>
   <div>
      <PriceDolar />
      <div class="q-pa-sm q-mt-lg">
         <q-table
            title="Productos"
            :data="datos"
            :columns="columns"
            row-key="name"
            binary-state-sort
            :filter="search"
         >
         <template v-slot:body="props">
            <q-tr :props="props" :class="{'bg-red-3' : props.row.stock <= 4}">
               <q-td key="desc" :props="props">
                  {{ props.row.name  }}
                  <q-popup-edit v-model="props.row.name" buttons label-set="Actualizar" label-cancel="No" @save="updateProduct({...props.row})">
                     <q-input type="textarea" v-model="props.row.name" dense autofocus counter />
                  </q-popup-edit>
               </q-td>
               <q-td key="stock" :props="props">
                  {{ props.row.stock }}
                  <q-popup-edit v-model="props.row.stock" title="Actualizar stock" label-set="Actualizar" label-cancel="No" buttons @save="updateProduct({...props.row})">
                  <q-input type="number" v-model="props.row.stock" dense autofocus />
                  </q-popup-edit>
               </q-td>
               <q-td key="precio" :props="props">
                  {{ props.row.precio }} $
                  <q-popup-edit v-model="props.row.precio" title="Actualizar Precio" label-set="Actualizar" label-cancel="No" buttons @save="updateProduct({...props.row})">
                     <q-input type="number" step="0.01" prefix="$" v-model="props.row.precio" dense autofocus />
                  </q-popup-edit>
               </q-td>
               <q-td key="precio_bs" :props="props">
                  {{ props.row.precio_bs }}
               </q-td>
               <q-td key="precio_general" :props="props">
                  {{ props.row.precio_general }}
               </q-td>
               <q-td key="eliminar" :props="props">
                  <q-btn round color="negative" icon="delete" @click="deleteProduct(props.row.id)">
                     <q-tooltip content-class="bg-red text-black shadow-4" :offset="[10, 10]">
                        Eliminar Producto
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
            <AddProduct />
         </q-dialog>
      </div>
   </div>
</template>

<script>
import AddProduct from 'src/components/Modals/AddProductComponent.vue'
import PriceDolar from 'src/components/PriceDolar.vue'
import { db } from 'boot/firebase';

export default {
   components : { AddProduct,PriceDolar },
   data () {
      return {
         dialog: false,
         maximizedToggle : true,
         precioDolar : 0,
         search : '',
         columns: [
            {
               name: 'desc',
               required: true,
               label: 'Nombre del Producto',
               align: 'left',
               field: row => row.name,
               format: val => `${val}`,
               sortable: true,
               classes: 'bg-grey-2 ellipsis',
               style: 'max-width: 100px',
               headerClasses: 'bg-primary text-white'
            },
            { name: 'stock', align: 'center', label: 'STOCK', field: 'stock', sortable: true },
            { name: 'precio', label: 'PRECIO U ($)', field: 'precio', sortable: true},
            { name: 'precio_bs', label: 'PRECIO U (Bs)', field: 'precio_bs' },
            { name: 'precio_general', label: 'TOTAL $ / BS', field: 'precio_general' },
            { name: 'eliminar', label: 'ELIMINAR', field: 'eliminar', headerClasses: 'bg-DANGER text-white',classes: 'bg-red-2 ellipsis', },
         ],
         datos: []
      }
   },
   created() {
      this.$root.$on('closeModal', () => {
         this.dialog = false;
      });
      this.$root.$on('saveProduct', () => {
         this.getAllProducts();
      });
      this.$root.$on('precio', (v) => {
         this.precioDolar = v.precio;
      });
   },
   mounted() {
      this.getAllProducts();
   },
   methods : {
      async getAllProducts() {
         this.$q.loading.show()
         const query = await db.collection('productos');
         query.get()
               .then((querySnapshot) => {
                  this.datos = [];
                  querySnapshot.forEach((doc) => {
                     let precio_bolivares = this.formatPrice(this.precioDolar * doc.data().precio);
                     let precio_stock_dolar = doc.data().precio * doc.data().stock;
                     let precio_stock_bs = this.formatPrice(precio_stock_dolar * this.precioDolar);
                        this.datos.push({
                           ...doc.data(),
                           id : doc.id,
                           precio_bs : precio_bolivares,
                           precio_general : this.formatPriceUsd(precio_stock_dolar)+' / '+precio_stock_bs
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
      updateProduct(e) {
         try {
            this.$q.dialog({
               title : '¿Desea Actualizar?',
               message : 'Actualizar Producto',
               cancel : true,
               presistent : true
            }).onOk(async () => {
               this.$q.loading.show()
               const query = await db.collection('productos').doc(e.id).update({...e});
               this.$q.notify({
                  color: 'green-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Producto Actualizado Correctamente'
               })
               this.getAllProducts();
               this.$q.loading.hide();
            })
         
         } catch (error) {
            this.$q.loading.hide()
            this.$q.notify({
               color: 'red-5',
               textColor: 'white',
               icon: 'cloud_done',
               message: error.message
            })
         }
      },
      deleteProduct(id) {
      let seconds = 3

      const dialog = this.$q.dialog({
         title: '¿Desea Eliminar esté producto?',
         message: `Se cerrara en  ${seconds} segundos.`
         }).onOk(() => {
            this.$q.loading.show()
            db.collection('productos').doc(id).delete().then(() => {
               this.$q.notify({
                  color: 'green-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Producto Eliminado Correctamente'
               });
               this.getAllProducts();
               this.$q.loading.hide()
            }).catch((error) => {
               this.$q.notify({
                  color: 'red-5',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: error.message
               })
               this.$q.loading.hide()
            });

         }).onCancel(() => {
         // console.log('Cancel')
         }).onDismiss(() => {
         clearTimeout(timer)
         // console.log('I am triggered on both OK and Cancel')
         })

         const timer = setInterval(() => {
         seconds--

         if (seconds > 0) {
            dialog.update({
               message: `Se cierra en ${seconds} segundo${seconds > 1 ? 's' : ''}.`
            })
         }
         else {
            clearInterval(timer)
            dialog.hide()
         }
         }, 1000)
      },
      formatPrice(price){
         return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'BSF' }).format(price);
      },
      formatPriceUsd(price){
         return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(price);
      }
   },

}
</script>
