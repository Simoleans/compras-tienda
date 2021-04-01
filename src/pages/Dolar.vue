<template>
<div>
  <h6>Precio del dolar</h6>
  <q-page padding>
    <q-form
      @submit="handleDolarPrice"
      @reset="onReset"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="price"
        label="Precio del dolar"
        lazy-rules
        type="number"
        step="0.01"
        :rules="[ price => price && price.length > 0 || 'Debe llenar este dato']"
      />
      <div>
        <q-btn label="Guardar" type="submit" color="primary"/>
      </div>
    </q-form>
  </q-page>
</div>

</template>

<script>
import Title from 'src/components/TitleComponent.vue'
import { db } from 'boot/firebase';
import moment from 'moment';
export default {
  name: 'Dolar',
  components : { Title },
  data() {
    return {
      price : '',
      id : ''
    }
  },
  created() {
    this.$q.loading.show()
    this.getDolarPrice();
  },
  methods : {
    async getDolarPrice() {
      try {

        const resp = await db.collection('dolar').get();

        resp.forEach(res => {
          this.price = res.data().price;
          this.id = res.id;
        })
      this.$q.loading.hide()
      } catch (error) {
        console.log(error)
      }
    },
    async handleDolarPrice () {
      try {
        
        this.$q.dialog({
          title : '¿Desea Actualizar el dolar?',
          message : 'Fecha de Actualización - '+moment().format('YYYY-MM-DD, h:mm:ss a'),
          cancel : true,
          presistent : true
        }).onOk(async () => {
          this.$q.loading.show()
          const query = await db.collection('dolar').doc(this.id).update({price : this.price,last_update : moment().format('YYYY-MM-DD, h:mm:ss a')});
          this.$q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Dolar Actualizado Correctamente - '+moment().format('DD-MM-YYYY, h:mm:ss a')
          })
        this.$q.loading.hide()
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
    onReset() {
      this.$q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Submitted'
        })
    }
  }
}
</script>
