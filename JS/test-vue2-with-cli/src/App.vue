<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <keep-alive>
      <HelloWorld v-if="show" msg="Welcome to Your Vue.js App"/>
    </keep-alive>
    <ZM v-if="show"/>
    <ZM v-if="show"/>

    <button @click="show = !show">1111111</button>

    <ul ref="u">
      <li v-for="item in ulList" :key="item">
        {{item}}
      </li>
    </ul>
    <button @click="add">222</button>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
// import ZM from './components/ZM.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    ZM: () => import('./components/ZM.vue')
  },
  data() {
    return {
      show: false,
      ulList: [1,2,3]
    }
  },
  methods: {
    add() {
      this.ulList.push(4)
      this.ulList.push(5)
      this.ulList.push(6)

      this.$nextTick(() => {
        let ulDom = this.$refs.u
        console.log(ulDom.childNodes.length)
      })
    },
  },
  beforeCreate() {
    console.log('beforeCreate')
    console.log(this.show)
  },
  created() {
    console.log('created')
    console.log(this.show)
  },
  beforeMount() {
    console.log('beforeMount')
    console.log(this.$el)
  },
  mounted() {
    console.log('mounted')
    console.log(this.$el)
  },
  beforeUpdate() {
    console.log('beforeUpdate')
  },
  updated() {
    console.log('updated')
  },
  beforeDestroy() {
    console.log('beforeDestroy')
  },
  destroyed() {
    console.log('destroyed')
  },
  activated() {
    console.log('activated')
  },
  deactivated() {
    console.log('deactivated')
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
