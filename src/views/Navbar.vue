<template>
  <div>
    <header class="header">
      <router-link class="navBar" to="/" style="display: flex; align-items: center; justify-content: center"><img
          :src="logo" alt="logo" style="width: 160px" /></router-link>
      <div>
        <router-link class="navBar" to="/">Home</router-link>
        <router-link class="navBar" to="/benchmark">Benchmark</router-link>
        <!-- <router-link class="navBar" to="/resource">Database</router-link> -->
        <Dropdown v-if="userName">
          <div href="javascript:void(0)">
            <Icon type="md-person" />
            {{ userName }}
            <Icon type="ios-arrow-down"></Icon>
          </div>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="logout">logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <router-link v-else class="navBar" to="/login">Login</router-link>
      </div>
    </header>
  </div>
</template>

<script>
export default {

  data() {
    return {
      logo: require("@/assets/logo.jpg"),
      userName: ''
    };
  },
  async mounted() {
    this.loadUserName();
    window.addEventListener('userName', this.loadUserName);
   },
  beforeDestroy() { 
    window.removeEventListener('userName', this.loadUserName);
  },
  methods: {
    loadUserName(){
      this.userName = localStorage.getItem('userName');
    },
    logout() {
      console.log('logout');
      this.$Modal.confirm({
        title: 'info',
        content: '<p>confirm to logout</p>',
        onOk: () => {
          localStorage.removeItem('userName');
          location.reload();
        },
        onCancel: () => {

        }
      });

    }
  }
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
