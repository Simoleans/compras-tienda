
<template>
  <div>
    <Title text="Inicio" />
  </div>
</template>

<script>
import Title from 'src/components/TitleComponent.vue'
export default {
  name: 'PageIndex',
  components : { Title },
  data () {
    return {
      text : '',
      dense : ''
    }
  }
}
</script>
