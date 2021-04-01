<template>
  <div>
    <h6 v-if="loading == true">Cargando precio del dolar...</h6>
    <h6 v-else>
      Dolar : {{ formatPrice(precioDolar) }} || Última Act : {{ lastUpdateDolar }}
    </h6>
  </div>
</template>

<script>
import { db } from 'boot/firebase';
export default {
  name: 'PriceDolar',
  data () {
    return {
      precioDolar : '',
      lastUpdateDolar : '',
      loading : true
    }
  },
  mounted() {
    this.getDolarPrice();
  },
  methods : {
    async getDolarPrice() {
      try {
          
          const resp = await db.collection('dolar').get();

          resp.forEach(res => {
            this.precioDolar = res.data().price;
            this.lastUpdateDolar = res.data().last_update;
          })
          this.$root.$emit('precio', {precio : this.precioDolar, update : this.lastUpdateDolar});
          this.loading = false;
          this.$q.loading.hide()
          } catch (error) {
            this.precioDolar = 0;
            this.$q.notify({
                  color: 'red-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Error en traer precio del dolar - '+error.message
            })
          }
      },
    formatPrice(price){
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'BSF' }).format(price);
    }
  }
}
</script>
