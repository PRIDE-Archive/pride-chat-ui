<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh; padding-top: 32px">
      <main class="content">
        <h1 style="margin-bottom: 16px;">Relevant Documents</h1>
        <div v-if="htmlContent" style="width: 100%; text-align: left; font-size: 16px;line-height: 32px;" v-html="htmlContent"></div>
        <div v-else style="width: 100%; text-align: left; font-size: 16px;line-height: 32px;" >
          {{ mdContent }}
        </div>
      </main>
      <footer style="
          display: flex;
          justify-content: center;
          margin: 16px;
          align-items: center;
          color: #9ca3af;
        ">
        <a href="#" target="_blank" rel="noreferrer" style="color: inherit">Use via API
          <img src="https://huggingface-projects-llama-2-7b-chat--8wxtt.hf.space/assets/api-logo-5346f193.svg" alt="logo"
            style="width: 12px" /></a>
        <div style="width: 12px">·</div>
        <a href="#" class="built-with svelte-1ax1toq" target="_blank" rel="noreferrer" style="color: inherit">Built with
          Gradio
          <img src="https://huggingface-projects-llama-2-7b-chat--8wxtt.hf.space/assets/logo-0a070fcf.svg" alt="logo"
            style="width: 12px" /></a>
      </footer>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import navbar from "./Navbar.vue";
export default {
  data() {
    return {
      md: "## title",
      mdContent: "",
      htmlContent: "",
      isMd: false
    };
  },
  components: {
    navbar,
  },
  mounted() {
    try {
      const mdIt = new MarkdownIt();
      this.mdContent = JSON.parse(localStorage.getItem("markdown"));
      if(!this.mdContent){
        console.error('no markdown');
        return;
      }
      console.log(this.mdContent);
      this.htmlContent = mdIt.render(this.mdContent);
      // console.log(this.content);
    } catch (e) {
      console.error(e);
    }


  },
  beforeDestroy() { },
  methods: {},
};
</script>

<style >
hr {
  margin: 18px 0;
}
</style>
