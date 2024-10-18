<template>
  <div>
    <div class="container">
      <main class="content">
        <div class="chat" style="flex: 1 1 350px;">
          <div class="chat-label" style="border: none; padding: 0px;">
            <Select v-model="model" style="width:150px">
              <Option v-for="item in models" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </div>
          <div class="chat-contents">
            <div class="chat-content" v-for="(item, index) in list" :key="index">
              <div class="chat-query" v-if="item.query" v-html="item.query"></div>
              <div class="chat-complete">
                <div style="padding-left: 16px;" v-html="item.result"></div>
                <!-- {{ item.result }} -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; justify-content: start; margin-top:4px;">
                    <div :class="{ 'grayed-out': item.feedback }" style="cursor: pointer;"
                      @click="!item.feedback && onQueryFeedback(item.query, item.answer, 'good', index)">
                      <img :src="good" style="width: 18px; height: 18px;" />
                    </div>
                    <div :class="{ 'grayed-out': item.feedback }" style="cursor: pointer;margin: 0 4px;"
                      @click="!item.feedback && onQueryFeedback(item.query, item.answer, 'moderate', index)">
                      <img :src="balance" style="width: 18px; height: 18px;" />
                    </div>
                    <div :class="{ 'grayed-out': item.feedback }" style="cursor: pointer;"
                      @click="!item.feedback && onQueryFeedback(item.query, item.answer, 'bad', index)">
                      <img :src="bad" style="width: 18px; height: 18px;" />
                    </div>
                  </div>
                  <div v-if="item.relevant">
                    <span style="font-size: 10px; color: gray; margin-right: 2px">{{ (item.time_ms / 1000).toFixed(2)
                      }}s</span>
                    <a @click="onRelevant(item.relevant, index)" type="primary" ghost>give me more</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="chat-submit">
          <div style="padding: 1px;flex-grow: 10;border: 1px solid #e5e7eb;height: 40px;display: flex;flex-direction: row;align-items: center;">
            <Input :border="false" :autosize="{ minRows: 1, maxRows: 2 }" v-model="query" type="textarea" :rows="1"
              placeholder="Type a message..." />
          </div>
          <div v-if="isLoading" class="submit-btn-loading" style="width: 50px;"><Icon type="ios-send" size="30" /></div>
          <div v-else class="submit-btn" @click="onSubmit" style="width: 50px;"><Icon type="ios-send" size="30" /></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import { chatPx as chat, saveProjectsQueryFeedback, similarProjects } from "@/api/api";
// import navbar from "./Navbar.vue";

export default {
  name: "chatPx",
  data() {
    return {
      good: require("@/assets/good.png"),
      bad: require("@/assets/bad.png"),
      balance: require("@/assets/balance.png"),
      query: "",
      prequery: "",
      list: [],
      model: "Llama-3.2-3B-GGUF",
      models: [
        // "llama2-chat",
        "llama2-13b-chat",
        "Llama-3.2-3B-GGUF",
        // "chatglm3-6b",
        // "open-hermes",
        // "GPT4ALL",
        // "mpt-7b",
        // "baichuan-7b",
        // "vicuna-13b",
      ],
      isLoading: false,
      showOption: true,

      maxTokens: 1024,
      temperature: 1,
      topP: 0.95,
      topK: 50,
    };
  },
  components: {
    // navbar,
  },
  async mounted() {

  },
  beforeDestroy() { },
  methods: {
    onQueryFeedback: function (query, result, feedback, index) {
      saveProjectsQueryFeedback(query, result, feedback, 'pride_projects_search', this.model).then((res) => {
        this.$Message.success("Feedback Success");
        this.list[index].feedback = true;
      })
    },
    PXDIdentifiers: function (text) {
      const baseUrl = 'https://www.ebi.ac.uk/pride/archive/projects/';
      const regex = /PXD\d{6}/g;
      return text.replace(regex, (matchStr, p1) => {
        const link = `${baseUrl}${matchStr}`;
        return `[${matchStr}](${link})`;
      });
    },

    onModel: function (model) {
      console.log(model);
    },
    onSubmit: async function () {
      if (!this.query) {
        return;
      }
      if (!this.model) {
        this.$Message.warning("please choice model");
        return;
      }

      this.$Spin.show();

      chat(this.query, this.model)
        .then((res) => {
          const mdIt = new MarkdownIt();
          this.list.push({
            query: this.query,
            feedback: false,
            isMore: false,
            answer: res.data.result,
            result: mdIt.render(this.PXDIdentifiers(res.data.result)),
            relevant: res.data["relevant-chunk"],
            time_ms: res.data["time_ms"]

          });
          this.prequery = this.query;
          this.query = "";
          console.log(this.list);
        })
        .catch((e) => {
          this.$Message.warning("chat failed");
        })
        .finally(() => {
          this.$Spin.hide();
        });
    },
    onRelevant: function (relevant, index) {
      console.log(relevant);
      this.$Spin.show();
      similarProjects(relevant)
        .then((res) => {
          this.list[index].isMore = true;
          console.log(res.data);
          if (!res || !res.data || !res.data.length) {
            return;
          }

          let recommended = relevant.split(",");
          let result = "";
          let seq = 1;
          result += `## LLM Recommend:
`;
          res.data.forEach((element) => {
            if (recommended.includes(element.accession)) {
              let content = `${seq}.&ensp;${this.PXDIdentifiers(element.accession)}: ${element.title}

`;
              seq++;
              result += content;
            }

          });

          result += `## Additional Datasets:
`;
          res.data.forEach((element) => {
            if (!recommended.includes(element.accession)) {
              let content = `${seq}.&ensp;${this.PXDIdentifiers(element.accession)}: ${element.title}

`;
              seq++;
              result += content;
            }

          });


          const mdIt = new MarkdownIt();
          let content = mdIt.render(result);
          parent.postMessage({ type: "relevant", content: content }, "*");

        })
        .catch((e) => {
          console.error(e);
          this.$Message.warning("query failed");
        })
        .finally(() => {
          this.$Spin.hide();
        });

    },
  },
};
</script>

<style scoped>
@import "@/assets/style.css";

.grayed-out {
  opacity: 0.5;
  cursor: not-allowed;
}

.grayed-out img {
  filter: grayscale(100%);
  pointer-events: none;
}
</style>
