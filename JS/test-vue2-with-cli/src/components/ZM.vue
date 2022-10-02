<template>
  <div class="hello">
    111
  </div>
</template>

<script>
export default {
  name: 'ZM',
  beforeCreate() {
    console.log('\x1B[32m%s\x1B[0m', 'beforeCreate子组件')
  },
  created() {
    console.log('\x1B[32m%s\x1B[0m', 'created子组件')
  },
  beforeMount() {
    console.log('\x1B[32m%s\x1B[0m', 'beforeMount子组件')
  },
  mounted() {
    console.log('\x1B[32m%s\x1B[0m', 'mounted子组件')
  },
  beforeUpdate() {
    console.log('\x1B[32m%s\x1B[0m', 'beforeUpdate子组件')
  },
  updated() {
    console.log('\x1B[32m%s\x1B[0m', 'updated子组件')
  },
  beforeDestroy() {
    console.log('\x1B[32m%s\x1B[0m', 'beforeDestroy子组件')
  },
  destroyed() {
    console.log('\x1B[32m%s\x1B[0m', 'destroyed子组件')
  },
  activated() {
    console.log('\x1B[32m%s\x1B[0m', 'activated子组件')
  },
  deactivated() {
    console.log('\x1B[32m%s\x1B[0m', 'deactivated子组件')
  },
}
</script>
