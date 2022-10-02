<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  beforeCreate() {
    console.log('\x1B[31m%s\x1B[0m', 'beforeCreate子组件')
  },
  created() {
    console.log('\x1B[31m%s\x1B[0m', 'created子组件')
  },
  beforeMount() {
    console.log('\x1B[31m%s\x1B[0m', 'beforeMount子组件')
  },
  mounted() {
    console.log('\x1B[31m%s\x1B[0m', 'mounted子组件')
  },
  beforeUpdate() {
    console.log('\x1B[31m%s\x1B[0m', 'beforeUpdate子组件')
  },
  updated() {
    console.log('\x1B[31m%s\x1B[0m', 'updated子组件')
  },
  beforeDestroy() {
    console.log('\x1B[31m%s\x1B[0m', 'beforeDestroy子组件')
  },
  destroyed() {
    console.log('\x1B[31m%s\x1B[0m', 'destroyed子组件')
  },
  activated() {
    console.log('\x1B[31m%s\x1B[0m', 'activated子组件')
  },
  deactivated() {
    console.log('\x1B[31m%s\x1B[0m', 'deactivated子组件')
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
