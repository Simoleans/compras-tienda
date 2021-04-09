<template>
<div>
  <canvas id="example"></canvas>
   <pre>{{ datos }}</pre>
</div>
</template>

<script>
import { db } from 'boot/firebase';
import Chart from 'chart.js';
export default {
  name: 'ProductChart',
  data () {
    return {
      datos : [],
      labels : [],
    }
  },
    mounted() {
      this.getAllProducts();
      console.log('ssss',this.datos)
      const ctx = document.getElementById('example');
       new Chart(ctx, {
        type: 'line',
        data: {
          labels : this.labels,
          datasets : this.datos,
        },
        options: {
    responsive: true,
    lineTension: 1,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            padding: 25
          }
        }
      ]
    }
  },
      });
    },
    methods : {
      async getAllProducts() {
          this.$q.loading.show()
          const query = await db.collection('productos');
          query.get()
                .then((querySnapshot) => {
                  this.datos = [];
                  
                  querySnapshot.forEach((doc) => {
                    // console.log(doc.id)
                      // let precio_bolivares = this.formatPrice(this.precioDolar * doc.data().precio);
                      // let precio_stock_dolar = doc.data().precio * doc.data().stock;
                      // let precio_stock_bs = this.formatPrice(precio_stock_dolar * this.precioDolar);
                        this.datos.push(doc.data().stock)
                        this.labels.push(doc.data().name)
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
      }
    }
}
</script>
