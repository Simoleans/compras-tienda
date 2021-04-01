<template>
    <q-card class="bg-white text-black">
        <q-bar>
            <q-space />
            <q-btn dense flat icon="close" v-close-popup>
                <q-tooltip content-class="bg-primary text-primary">Cerrar</q-tooltip>
            </q-btn>
        </q-bar>

        <q-card-section>
            <div class="text-h6">Crear Compra</div>
            <h6>Dolar : {{ formatPrice(dolar.precio) }} || Última Act : {{ dolar.update }}</h6>
        </q-card-section>

        <q-card-section class="q-pa-md">
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
                </q-td>
                <q-td key="stock" :props="props" >
                    {{ props.row.stock }}
                </q-td>
                <q-td key="precio" :props="props">
                    {{ props.row.precio }} $
                </q-td>
                <q-td key="precio_bs" :props="props">
                    {{ props.row.precio_bs }}
                </q-td>
                <q-td key="precio_general" :props="props">
                    {{ props.row.precio_general }}
                </q-td>
                <q-td key="eliminar" :props="props">
                    <q-btn round color="primary" icon="add_circle" :disabled="props.row.stock == 0" @click="addProductInvoice({...props.row})" />
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
          <hr>
          <q-list bordered class="rounded-borders" v-bind:class="{ 'bg-red-3' : noItems}" style="max-width: 100%">
              <q-item-label header>Productos <span class="float-right text-weight-bold text-h5 text-black">{{ totalCompra }}$ / {{ formatPrice(precioBs) }}</span></q-item-label>
              <q-item v-for="(item,k) in items" :key="k">
                <q-item-section avatar top>
                  <q-icon name="add_shopping_cart" color="black" size="34px" />
                </q-item-section>

                <q-item-section top>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">{{ item.name }}</span>
                    <span class="text-grey-8"> - {{ item.precio }}$</span>
                  </q-item-label>
                </q-item-section>

                <q-item-section top side>
                  <q-item-label lines="1">
                    <q-input
                      filled
                      v-model="item.cantidad"
                      label="Cantidad"
                      lazy-rules
                      type="number"
                      required
                      readonly
                      min="1"
                      :max="item.stock"
                      style="max-width: 100px"
                      />
                  </q-item-label>
                </q-item-section>

                <q-item-section top side>
                  <div class="text-blue-8 q-gutter-xs">
                    <q-btn class="gt-xs" size="12px" flat dense round icon="indeterminate_check_box" @click="subCantidad(item.id,item.precio,k)" />
                  </div>
                </q-item-section>
              </q-item>
          </q-list>
          <q-form
          class="q-mt-lg"
          @submit="handleSave"
          >
              <q-input
                  filled
                  v-model="dataForm.description"
                  label="Descripcion de la compra"
                  lazy-rules
                  type="text"
                  required
                  >
                    <template v-slot:prepend>
                        <q-icon name="bookmark" />
                    </template>
              </q-input>
              <div class="q-mt-lg">
                  <q-btn label="Guardar" type="submit" color="primary"/>
                  <q-btn label="Limpiar" type="reset" color="primary" @click="resetForm" flat class="q-ml-sm" />
              </div>
          </q-form>
            
        </q-card-section>
    </q-card>
</template>

<script>
import { db } from 'boot/firebase';
import moment from 'moment';

export default {
    name: 'AddCompraComponent',
    props : ['dolar'],
    data () {
        return {
            dataForm : {
                description : 'Ninguna',
            },
            maximizedToggle: false,
            search : '',
            totalCompra : 0,
            precioBs : 0,
            noItems : false,
            items : [],
            exists: null,
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
              { name: 'stock', align: 'center', label: 'STOCK', field: 'stock', sortable: true,headerClasses: 'bg-red-5 text-white',classes: 'bg-green-2 ellipsis' },
              { name: 'precio', label: 'PRECIO U ($)', field: 'precio', sortable: true},
              { name: 'precio_bs', label: 'PRECIO U (Bs)', field: 'precio_bs' },
              { name: 'precio_general', label: 'TOTAL $ / BS', field: 'precio_general' },
              { name: 'eliminar', label: 'ELIMINAR', field: 'eliminar', headerClasses: 'bg-danger text-white',classes: 'bg-green-2 ellipsis' },
            ],
            datos: [],
            itemSum : []
        }
    },
    mounted() {
      this.getAllProducts();
    },
    watch : {
      items : {
          deep : true,
        
          handler(d) {
            let sumaC = d.reduce((a, {cantidad,precio}) => parseFloat(precio) * parseFloat(cantidad), 0);
          }

      },
      itemSum : {
        deep : true,

        handler(d) {
          let suma = d.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
          this.totalCompra = suma.toFixed(2);
          this.precioBs = this.totalCompra * this.dolar.precio;
        }
      }
    },
    methods : {
      async getAllProducts() {
        this.$q.loading.show()
        const query = await db.collection('productos');
        query.get()
              .then((querySnapshot) => {
                this.datos = [];
                querySnapshot.forEach((doc) => {
                    let precio_bolivares = this.formatPrice(this.dolar.precio * doc.data().precio);
                    let precio_stock_dolar = doc.data().precio * doc.data().stock;
                    let precio_stock_bs = this.formatPrice(precio_stock_dolar * this.dolar.precio);
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
      async handleSave() {
        this.$q.loading.show()
          if(this.itemSum.length <= 0) {
            this.noItems = true;
            this.$q.notify({
                color: 'red-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Debe seleccionar un producto'
            });
            this.$q.loading.hide()
            return false;
          }else{
            
            let compraProductos = [];

            this.items.forEach(async (item) => {
              compraProductos.push({
                    product : item.name,
                    price_unit : item.precio,
                    cant : item.cantidad,
              });
              const query = await db.collection('productos').doc(item.id).update({stock : item.stock - item.cantidad});
            });

            try {
                db.collection("compras").add({
                      created_at : moment().format('YYYY-MM-DD'),
                      hora : moment().format('h:mm:ss a'),
                      total: this.totalCompra,
                      total_bs : this.formatPrice(this.precioBs),
                      descripcion : this.dataForm.description,
                      ...compraProductos
                  })
                  .then(async () => {
                      this.$q.notify({
                          color: 'green-4',
                          textColor: 'white',
                          icon: 'cloud_done',
                          message: 'Compra Realizada Correctamente - '+moment().format('DD-MM-YYYY, h:mm:ss a')
                      })
                      
                      this.maximizedToggle = true;
                      this.$q.loading.hide();
                      this.$root.$emit('closeModal');
                      this.$root.$emit('saveCompra');
                  })
                  .catch((error) => {
                      this.$q.notify({
                          color: 'red-4',
                          textColor: 'white',
                          icon: 'cloud_done',
                          message: error.message
                      });
                      this.$q.loading.hide()
                  });
              } catch (error) {
                this.$q.notify({
                    color: 'red-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: error.message
                });
                this.$q.loading.hide()
              }
          }
        },
        addProductInvoice(d) {
          this.noItems = false;
          this.checkIfExists(d.id)
          if (!this.exists) {
            this.itemSum.push(d.precio); // se ejecuta cuando un producto entra en la lista la primera vez, para que sea reactivo el precio
            this.items.push({...d,cantidad: 1});
          }else{
            this.sumCantidad(d.id,d)
            
          }
        },
        checkIfExists(itemId) {
          this.exists = this.items.some((item) => {
            return item.id === itemId
          })
        },
        sumCantidad(itemId,d) {
          
          this.exists = this.items.some((item) => {
            if(item.cantidad >= d.stock) // si llega al maximo de stock no sube mas el contador de cantidad
            {
              this.$q.notify({
                  color: 'red-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Este producto supero el stock'
              })
              return false;
            }
            if(item.id === itemId){
              this.itemSum.push(d.precio); // en tal caso, agregalo (si aun tiene stock)
              return item.cantidad++
            }
          })
        },
        subCantidad(itemId,precio,k) {
          this.itemCantRemove(this.itemSum,precio)// Delete item to product
          this.exists = this.items.some((item) => {
            if(item.id === itemId){
              if(item.cantidad == 1){
                this.removeField(k)
              }else{
                return item.cantidad--
              }
              
            }
          })
        },
        itemCantRemove(arr, value) {  // eliminar item del array de sumas
          arr.splice(this.itemSum.indexOf(value), 1);
        },
        removeField(index) {
          this.items.splice(index, 1);
        },
        formatPrice(price){
          return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'BSF' }).format(price);
        },
        formatPriceUsd(price){
          return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(price);
        },
        resetForm() {
            this.dataForm.precio = '';
            this.dataForm.stock = '';
            this.dataForm.producto = '';
        }
    }
}
</script>
