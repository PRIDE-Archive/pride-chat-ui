<template>
  <div>
    <header class="header">
      <router-link
        class="navBar"
        to="/"
        style="display: flex; align-items: center; justify-content: center"
        ><img :src="logo" alt="logo" style="width: 160px"
      /></router-link>
      <div>
        <router-link class="navBar" to="/">Home</router-link>
        <router-link class="navBar" to="/benchmark">Benchmark</router-link>
        <!-- <router-link class="navBar" to="/resource">Database</router-link> -->
      </div>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      logo: require("@/assets/logo.jpg"),
    };
  },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
