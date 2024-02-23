<template>
  <div>
    <div class="container" style="min-height: 100vh;">
      <main class="content">
        <div style="margin: 10px 0; display: flex; align-items: center; justify-content: space-between;">
          <!-- <div style="width:150px">
          </div> -->
          <!-- <div style="text-align: center;">
            <h2>{{ model }}</h2>
          </div> -->
          <!-- <div style="width:150px">
            <Select v-model="model" style="width:150px">
              <Option v-for="item in models" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </div> -->
        </div>

        <div class="chat">
          <div class="chat-label">chatbot</div>
          <div class="chat-contents">
            <div class="chat-content" v-for="(item, index) in list" :key="index">
              <div class="chat-prompt" v-if="item.prompt" v-html="item.prompt"></div>
              <div class="chat-complete">
                <div style="padding-left: 16px;" v-html="item.result"></div>
                <!-- {{ item.result }} -->
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <div style="display: flex; align-items: center; justify-content: start; margin-top:4px;">
                    <div :class="{ 'grayed-out': item.feedback }" style="cursor: pointer;"
                      @click="!item.feedback && onQueryFeedback(item.prompt, item.answer, 'good', index)">
                      <img :src="good" style="width: 18px; height: 18px;" />
                    </div>
                    <div :class="{ 'grayed-out': item.feedback }" style="cursor: pointer;margin: 0 4px;"
                      @click="!item.feedback && onQueryFeedback(item.prompt, item.answer, 'moderate', index)">
                      <img :src="balance" style="width: 18px; height: 18px;" />
                    </div>
                    <div :class="{ 'grayed-out': item.feedback }" style="cursor: pointer;"
                      @click="!item.feedback && onQueryFeedback(item.prompt, item.answer, 'bad', index)">
                      <img :src="bad" style="width: 18px; height: 18px;" />
                    </div>
                  </div>
                  <div v-if="item.relevant">
                    <span style="font-size: 10px; color: gray; margin-right: 2px">{{ (item.timems / 1000).toFixed(2)
                    }}s</span>
                    <a @click="onRelevant(item.relevant, index)" type="primary" ghost>give me more</a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="chat-submit">
          <div style="
              padding: 1px;
              flex-grow: 10;
              border: 1px solid #e5e7eb;
              height: 40px;
              display: flex;
              flex-direction: row;
              align-items: center;
            ">
            <Input :border="false" :autosize="{ minRows: 1, maxRows: 2 }" v-model="prompt" type="textarea" :rows="1"
              placeholder="Type a message..." />
          </div>
          <div v-if="isLoading" class="submit-btn-loading">Submit</div>
          <div v-else class="submit-btn" @click="onSubmit">Submit</div>
        </div>
        <div class="opterates">
          <button class="opt-btn" @click="onRetry()">
            <Icon color="#2b85e4" size="20" type="md-sync" />Resend last
            question
          </button>
          <button class="opt-btn" @click="onClear">
            <Icon color="#808695" size="20" type="ios-trash" />Clear
          </button>
        </div>
        <div style="
            padding: 8px;
            margin-top: 8px;
            color: gray;
            text-align: left;
            font-size: 12px;
          ">
          Disclaimer: This chatbot is designed to assist you with general
          information and basic inquiries. Please note that it is not a
          replacement for our dedicated
          <a href="mailto:pride-support@ebi.ac.uk">helpdesk</a> support or
          official
          <a href="https://www.ebi.ac.uk/pride/markdownpage/documentationpage">documentation</a>. While the chatbot is
          powered by a language model, it may
          occasionally produce responses that are unrelated or incorrect, known
          as LLM hallucinations, due to the inherent limitations of the
          technology. Therefore, we recommend using this tool as a supplementary
          resource and encourage you to consult our helpdesk and official
          documentation for critical or complex inquiries.
        </div>
        <div class="options" style="display: none">
          <div class="options-header">
            <div>Options</div>
          </div>
          <div class="options-content" v-show="showOption"></div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import { chatPx as chat, saveProjectsQueryFeedback, similarProjects } from "@/api/api";
import navbar from "./Navbar.vue";

export default {
  name: "chatPx",
  data() {
    return {
      good: require("@/assets/good.png"),
      bad: require("@/assets/bad.png"),
      balance: require("../assets/balance.png"),
      prompt: "",
      prePrompt: "",
      list: [],
      model: "llama2-13b-chat",
      models: [
        // "llama2-chat",
        "llama2-13b-chat",
        "chatglm2-6b",
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
    navbar,
  },
  async mounted() { },
  beforeDestroy() { },
  methods: {
    onQueryFeedback: function (prompt, result, feedback, index) {
      saveProjectsQueryFeedback(prompt, result, feedback).then((res) => {
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
    onRetry: async function () {
      console.log("onRetry");
      if (!this.prePrompt) {
        return;
      }
      this.$Spin.show();
      chat(this.prePrompt)
        .then((res) => {
          const mdIt = new MarkdownIt();
          this.list.push(
            Object.assign(res.data, {
              prompt: this.prePrompt,
              feedback: false,
              answer: res.data.result,
              result: mdIt.render(this.PXDIdentifiers(res.data.result)),
              relevant: res.data["relevant-chunk"],
              timems: res.data["timems"],
            })
          );
        })
        .catch((e) => {
          this.$Message.warning("chat failed");
        })
        .finally(() => {
          this.$Spin.hide();
        });
    },
    onClear: function () {
      this.list = [];
    },
    onSubmit: async function () {

      //       let result = `Based on the information provided, there are several datasets related to brain cancer available from the Mathias Mann group. Here are a few examples:

      // PXD006607: "Proteomic analysis of human Medulloblastoma reveals distinct activated pathways between subgroups"
      // PXD000548: "Proteome analyses of the human Anterior Temporal Lobe and Corpus Callosum"
      // PXD005445: "Characterization of the human Anterior Temporal Lobe and Corpus Callosum"
      // PXD004684: "CEGS Proteomics: A multiregional proteomic survey of the postnatal human brain"
      // These datasets are available on the ProteomeXchange database and can be accessed through the database's search function.

      // Please note that the datasets are related to brain cancer and not lung cancer, as you mentioned in your question. If you are looking for lung cancer datasets, you may want to search for other databases or resources.`
      //       console.log(this.PXDIdentifiers(result));

      if (!this.prompt) {
        return;
      }
      if (!this.model) {
        this.$Message.warning("please choice model");
        return;
      }

      this.$Spin.show();

      chat(this.prompt, this.model)
        .then((res) => {
          const mdIt = new MarkdownIt();
          this.list.push({
            prompt: this.prompt,
            feedback: false,
            isMore: false,
            answer: res.data.result,
            result: mdIt.render(this.PXDIdentifiers(res.data.result)),
            relevant: res.data["relevant-chunk"],
            timems: res.data["timems"]

          });
          this.prePrompt = this.prompt;
          this.prompt = "";
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
      similarProjects(relevant).then((res) => {
        this.list[index].isMore = true;
        console.log(res.data);

        if (!res || !res.data || !res.data.length) {
          return;
        }

        let result = "";
        res.data.forEach((element, index) => {
          console.log(index, element);
          let content = `${index + 1}.Accession: ${this.PXDIdentifiers(element.accession)}\n` +
            `\tTitle: ${element.title}\n\n\n`
          console.log(content);
          result += content;
        });
        // const mdIt = new MarkdownIt();
        // this.list.push({
        //     feedback: true,
        //     isMore: true,
        //     result: mdIt.render(result),

        //   });
        localStorage.setItem("markdown", JSON.stringify(result));
        window.open("relevant");
      });
      // this.$Message.info("coming soon");

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
