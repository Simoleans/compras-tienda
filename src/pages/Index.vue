
<template>
  <div>
    <Title text="Inicio" />
    <ProductChart />
  </div>
</template>

<script>
import Title from 'src/components/TitleComponent.vue'
import ProductChart from 'src/components/ProductChartComponent.vue'
export default {
  name: 'PageIndex',
  components : { Title,ProductChart },
  data () {
    return {
      text : '',
      dense : ''
    }
  }
}
</script>
