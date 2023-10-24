<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh; padding-top: 16px">
      <Tabs value="battle" :animated="false">
        <TabPane label="Chatbot Arena(battle)" name="battle">
          <battle></battle>
        </TabPane>
        <!-- <TabPane label="Chatbot Arena(side-by-side)" name="side"><side-by-side></side-by-side></TabPane> -->
        <Button @click="exportData" size="small" slot="extra">Export Data</Button>
        <Button style="margin-left:8px;" @click="clearData" size="small" slot="extra">Clear Data</Button>
      </Tabs>
    </div>
  </div>
</template>

<script>
import navbar from "./Navbar.vue";
import Battle from "@/component/Battle.vue";
import SideBySide from "@/component/SideBySide.vue";

export default {
  data() {
    return {
    };
  },
  components: {
    navbar,
    Battle,
    SideBySide
  },
  async mounted() {

  },
  beforeDestroy() { },
  methods: {
    exportData: function () {
      let voteData = JSON.parse(localStorage.getItem('voteData')) || [];
      if(voteData.length === 0){
        this.$Message.info('no data');
        return;
      }
      let dataStr = JSON.stringify(voteData);
      let blob = new Blob([dataStr], { type: 'application/json' });
      let url = URL.createObjectURL(blob);

      let link = document.createElement('a');
      link.href = url;
      link.download = 'data.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // 
    },
    clearData: function () {
      this.$Modal.confirm({
        title: 'Warning',
        content: '<p>Are you sure to delete data?</p>',
        onOk: () => {
          localStorage.removeItem('voteData');
          this.$Message.success('Data is deleted');
        },
        onCancel: () => {
          // this.$Message.info('Clicked cancel');
        }
      });
    }
  },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
