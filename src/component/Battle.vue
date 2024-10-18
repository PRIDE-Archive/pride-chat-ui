<template>
  <div>
    <div class="container" style="min-height: 100vh; padding-top: 8px">
      <div style="text-align: left; ">
        <Form ref="form" :model="record" :rules="rule" label-position="left" :label-width="80" inline>
          <FormItem label="Judge" prop="judge">
            <Input v-model="record.judge" :clearable="false" placeholder="input your name" />
          </FormItem>
        </Form>
      </div>
      <main class="content">
        <div class="chats">
          <div class="chat">
            <div class="chat-label">
              <Icon type="ios-chatboxes-outline" /> Model A
            </div>
            <div class="chat-contents">
              <div class="chat-content" v-for="(item, index) in list" :key="index">
                <div class="chat-query">{{ item.query }}</div>
                <div class="chat-complete">
                  {{ item.result }}
                  <div style="text-align: right" v-if="item.relevant">
                    <span style="font-size: 10px; color: gray; margin-right: 2px;">{{ (item.time_ms/1000).toFixed(2) }}s</span>
                    <a @click="onRelevant(item.relevant)" type="primary" ghost>relevant</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
<!--          <div class="chat">-->
<!--            <div class="chat-label">-->
<!--              <Icon type="ios-chatboxes-outline" /> Model B-->
<!--            </div>-->
<!--            <div class="chat-contents">-->
<!--              <div class="chat-content" v-for="(item, index) in listB" :key="index">-->
<!--                <div class="chat-query">{{ item.query }}</div>-->
<!--                <div class="chat-complete">-->
<!--                  {{ item.result }}-->
<!--                  <div style="text-align: right" v-if="item.relevant">-->
<!--                    <span style="font-size: 10px; color: gray; margin-right: 2px;">{{ (item.time_ms/1000).toFixed(2) }}s</span>-->
<!--                    <a @click="onRelevant(item.relevant)" type="primary" ghost>relevant</a>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

        </div>
        <div style="display: flex;" v-if="record.winner">
          <div style="flex-grow: 1;flex:1;text-align:left;font-weight: bold;font-size:16px;">
            ModelA:{{ record.model }}
          </div>
<!--          <div style="flex-grow: 1;flex:1;text-align:left;font-weight: bold;font-size:16px;">-->
<!--            ModelB:{{ record.model_b }}-->
<!--          </div>-->
        </div>
        <div class="votes" v-if="list.length > 0">
          <button class="vote-btn" @click="onVote('Good')">
            👈 Answer is better
          </button>
          <button class="vote-btn" @click="onVote('bad')">
            👉 Answer is bad
          </button>
          <button class="vote-btn" @click="onVote('ok')">
            🤝 Answer is ok
          </button>
        </div>
<!--        <div class="votes" style="opacity: 0.5" v-if="list.length > 0 && list.length == votePosition">-->
<!--          <button class="vote-btn">-->
<!--            👈 A is better-->
<!--          </button>-->
<!--          <button class="vote-btn">-->
<!--            👉 B is better-->
<!--          </button>-->
<!--          <button class="vote-btn">-->
<!--            🤝 Tie-->
<!--          </button>-->
<!--          <button class="vote-btn">-->
<!--            👎 Both are bad-->
<!--          </button>-->
<!--        </div>-->

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
            <Input :border="false" :autosize="{ minRows: 1, maxRows: 2 }" v-model="query" type="textarea" :rows="1"
              placeholder="Type a message..." />
          </div>

          <div v-if="isLoading" class="submit-btn-loading">Submit</div>
          <div v-else class="submit-btn" @click="onSubmit('form')">Submit</div>
        </div>

        <div class="opterates">
          <button class="opt-btn" @click="onClear">
            <Icon color="#808695" size="20" type="ios-trash" />Clear history
          </button>
        </div>

        <div class="options" style="display: none">
          <div class="options-header">
            <div>Options</div>
          </div>
          <div class="options-content" v-show="false"></div>
        </div>
      </main>
    </div>

  </div>
</template>
  
<script>
import { chat, saveBenchmark } from "@/api/api";
import {resourceURL} from "@/api/request";

export default {
  data() {
    return {
      query: "",
      prequery: "",

      list: [],
      models: [
        "Llama-3.2-3B-Instruct"
      ],
      isLoading: 0,
      votePosition: 0,
      record: {
        "model": "Llama-3.2-3B-Instruct",
       // "model_b": "",
       // "winner": "",
        "judge": "",
        "turn": 1,
        "anony": true,
        "language": "English",
        "tstamp": 1681813816.2522,
        "question": "",
        "answer": "",
       // "model_b_answer": "",
        "time": "",
        "feedback": ""
      },
      rule: {
        judge: [
          { required: true, message: 'Please fill in the judge', trigger: 'blur' }
        ]
      }
    };
  },

  async mounted() {
    this.generateModel();
  },
  beforeDestroy() { },
  methods: {
    generateModel: function () {
      let shuffled = this.models.sort(() => 0.5 - Math.random());
      this.record.model_a = shuffled[0];
      this.record.model_b = shuffled[1];
      this.record.winner = "";
      this.record.judge = "";
      this.turn = 0;
    },
    onRetry: async function () {
      console.log("onRetry");
      if (!this.prequery) {
        return;
      }
      this.$Spin.show();
      // Create a new item with a result property
      const newItem = {result: "", query: this.prequery};
      this.list.push(newItem); // Add the new item to the list
      this.isLoading = true; // Show loading indicator

      await chat(this.query, newItem, (result) => {
        this.$Spin.hide();
        this.$set(newItem, 'result', result); // Use $set for reactivity
      }).then((finalResult) => {
        if (finalResult) {
          newItem.query = this.query, // Keep the query associated with the result
              newItem.answer = finalResult.result; // Save the answer in the new item
          newItem.relevant = finalResult.relevant; // Relevance information
          newItem.time_ms = finalResult.time_ms; // Time in milliseconds

          this.record.question = this.query;
          this.record.answer = finalResult.result;
          this.record.time = finalResult.time_ms;
        }

      }).catch (e => {
        console.error(e);
        if (!e.response) {
          this.$Message.error({ content: "response is empty", duration: 20, closable: true });
        } else {
          this.$Message.error(e.message + " " + e.code);
          this.$Message.error({ content: e.message + " " + e.code, duration: 20, closable: true });
        }
      }).finally ( () => {
        this.$Spin.hide();
        this.isLoading = false;
      });
    },
    onClear: function () {
      console.log('clear');
      this.list = [];
      //this.listB = [];
      this.votePosition = 0;
      this.query = '';
      this.generateModel();
    },

    doSubmit: async function () {

      this.$Spin.show();
      // Create a new item with a result property
      const newItem = {result: "", query: this.query};
      this.list.push(newItem); // Add the new item to the list
      this.isLoading = true; // Show loading indicator

      await chat(this.query, newItem, (result) => {
        this.$Spin.hide();
        this.$set(newItem, 'result', result); // Use $set for reactivity
      }).then((finalResult) => {
        if (finalResult) {
          newItem.query = this.query, // Keep the query associated with the result
              newItem.answer = finalResult.result; // Save the answer in the new item
          newItem.relevant = finalResult.relevant; // Relevance information
          newItem.time_ms = finalResult.time_ms; // Time in milliseconds

          this.record.question = this.query;
          this.record.answer = finalResult.result;
          this.record.time = finalResult.time_ms;
        }

      }).catch (e => {
        console.error(e);
        if (!e.response) {
          this.$Message.error({ content: "response is empty", duration: 20, closable: true });
        } else {
          this.$Message.error(e.message + " " + e.code);
          this.$Message.error({ content: e.message + " " + e.code, duration: 20, closable: true });
        }
      }).finally ( () => {
        this.prequery = this.query;
        this.query = "";
        this.$Spin.hide();
        this.isLoading = false;
      });


    },
    onSubmit: async function (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) {
          // this.$Message.error('Fail!');
          return;
        }
        if (!this.query) {
          this.$Message.error("please type a message");
          return;
        }
        // if (!this.record.model_a) {
        //   this.$Message.warning("please choice model");
        //   return;
        // }
        // if (!this.record.model_b) {
        //   this.$Message.warning("please choice model");
        //   return;
        // }
        this.doSubmit();
      })
    },
    onRelevant: function (relevant) {
      console.log(relevant);
      localStorage.setItem("markdown", (relevant));
      window.open("relevant");
    },
    getCurrentData() {
      let date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var year = date.getFullYear();
      var month = date.getMonth() + 1; // getMonth() is zero-based
      var day = date.getDate();

      hours = hours.toString().padStart(2, '0');
      minutes = minutes.toString().padStart(2, '0');
      month = month.toString().padStart(2, '0');
      day = day.toString().padStart(2, '0');

      let strTime = hours + ':' + minutes + ' ' + year + '-' + month + '-' + day;
      return strTime;
    },
    onVote: function (feedback) {
      this.record.feedback = feedback;
      this.record.turn = this.list.length;
      this.record.tstamp = this.getCurrentData();
      this.votePosition = this.list.length;
      console.log(JSON.stringify(this.record));
      let voteData = JSON.parse(localStorage.getItem('voteData')) || [];
      voteData.push(this.record);
      localStorage.setItem('voteData', JSON.stringify(voteData));

      // let data = {
      //   model_a: this.record.model_a, model_b: this.record.model_b,
      //   query: this.record.question,
      //   judge: this.record.judge,
      //   winner: this.record.winner,
      //   time_a: this.record.model_a_timing,
      //   time_b: this.record.model_b_timing,
      //   answer_a: this.record.model_a_answer,
      //   answer_b: this.record.model_b_answer
      // };
      let data = {
        model: this.record.model,
        query: this.record.question,
        judge: this.record.judge,
        feedback: this.record.feedback,
        time: this.record.time,
        answer: this.record.answer
      };
      console.log(data);
      saveBenchmark(data).then(res => {
        this.$Message.success("Save successfully");
      }).catch(e => {
        this.$Message.error("Save failed");
      })

    }
  },
};
</script>
  
<style scoped>
@import "@/assets/style.css";

.chats {
  display: flex;
}

.chat {
  flex: 1;
}

.votes {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  width: 100%;
  row-gap: 16px;
  column-gap: 16px;

}


.vote-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  color: #424a57;
  background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb);
}
</style>
  