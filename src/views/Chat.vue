<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh; padding-top: 32px">
      <main class="content">
        <div style="margin: 10px 0">
          <RadioGroup v-model="model" @on-change="onModel">
            <Radio
              :label="item"
              :value="item"
              border
              v-for="(item, index) in models"
              :key="item"
            ></Radio>
          </RadioGroup>
        </div>

        <div class="chat">
          <div class="chat-label">chatbot</div>
          <div class="chat-contents">
            <div
              class="chat-content"
              v-for="(item, index) in list"
              :key="index"
            >
              <div class="chat-prompt">{{ item.prompt }}</div>
              <div class="chat-complate">
                {{ item.result }}
                <div style="text-align: right" v-if="item.relevant">
                  <span style="font-size: 10px; color: gray; margin-right: 2px"
                    >{{ (item.timems / 1000).toFixed(2) }}s</span
                  >
                  <a @click="onRelevant(item.relevant)" type="primary" ghost
                    >relevant</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chat-submit">
          <div
            style="
              padding: 1px;
              flex-grow: 10;
              border: 1px solid #e5e7eb;
              height: 40px;
              display: flex;
              flex-direction: row;
              align-items: center;
            "
          >
            <Input
              :border="false"
              :autosize="{ minRows: 1, maxRows: 2 }"
              v-model="prompt"
              type="textarea"
              :rows="1"
              placeholder="Type a message..."
            />
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
        <div
          style="
            padding: 8px;
            margin-top: 8px;
            color: gray;
            text-align: left;
            font-size: 12px;
          "
        >
          Disclaimer: This chatbot is designed to assist you with general
          information and basic inquiries. Please note that it is not a
          replacement for our dedicated
          <a href="mailto:pride-support@ebi.ac.uk">helpdesk</a> support or
          official
          <a href="https://www.ebi.ac.uk/pride/markdownpage/documentationpage"
            >documentation</a
          >. While the chatbot is powered by a language model, it may
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
import { chat } from "@/api/api";
import navbar from "./Navbar.vue";

export default {
  data() {
    return {
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
  async mounted() {},
  beforeDestroy() {},
  methods: {
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
          this.list.push(
            Object.assign(res.data, {
              prompt: this.prePrompt,
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
          this.list.push(
            Object.assign(res.data, {
              prompt: this.prompt,
              relevant: res.data["relevant-chunk"],
              timems: res.data["timems"],
            })
          );
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
    onRelevant: function (relevant) {
      console.log(relevant);
      localStorage.setItem("markdown", JSON.stringify(relevant));
      window.open("relevant");
    },
  },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
