<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh; padding-top: 32px">
      <main class="content">
        <div style="width: 100%; text-align: left;" v-html="content"></div>
      </main>
      <footer
        style="
          display: flex;
          justify-content: center;
          margin: 16px;
          align-items: center;
          color: #9ca3af;
        "
      >
        <a href="#" target="_blank" rel="noreferrer" style="color: inherit"
          >Use via API
          <img
            src="https://huggingface-projects-llama-2-7b-chat--8wxtt.hf.space/assets/api-logo-5346f193.svg"
            alt="logo"
            style="width: 12px"
        /></a>
        <div style="width: 12px">·</div>
        <a
          href="#"
          class="built-with svelte-1ax1toq"
          target="_blank"
          rel="noreferrer"
          style="color: inherit"
          >Built with Gradio
          <img
            src="https://huggingface-projects-llama-2-7b-chat--8wxtt.hf.space/assets/logo-0a070fcf.svg"
            alt="logo"
            style="width: 12px"
        /></a>
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
      content: "",
    };
  },
  components: {
    navbar,
  },
  mounted() {
    const mdIt = new MarkdownIt();
    let md = JSON.parse(localStorage.getItem("markdown"));
    this.content = mdIt.render(md);
    console.log(this.content);
  },
  beforeDestroy() {},
  methods: {},
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
