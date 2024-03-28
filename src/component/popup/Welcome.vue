<template>
    <div>
        <div class="content">
            <img :src="prideLogo" style="width: 280px; height: auto;" alt="" />
            <h1 style="margin-top: 32px;">Welcome to Pride</h1>
            <div style="margin-top: 16px;">Search our Knowledge Base or start a chat. We're here to help you 24*7.</div>
            <div style="margin-top: 16px; opacity: 0.68;">We could add some more description here...</div>
        </div>
        <div>
            <div class="send-btn" @click="onSubmit">
                <Icon type="ios-send" size="30" />
                <h3>New Conversation</h3>
            </div>
        </div>
    </div>
</template>

<script>
import MarkdownIt from "markdown-it";
import { chat, saveProjectsQueryFeedback } from "@/api/api";

export default {
    name: "welcome",
    data() {
        return {
            prideLogo:require("@/assets/PRIDE_logo.png"),
            
        };
    },
    components: {
    },
    async mounted() { },
    beforeDestroy() { },
    methods: {
        onSubmit: async function () {
            this.$emit('onChat');
        },

    },
};
</script>

<style scoped>
.content {
    /* background-color: rgba(91, 192, 180, 0.68); */
    padding: 32px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 18px;
    color: rgba(91, 192, 180, 1);

}

.send-btn {
    background-color: rgba(91, 192, 180, 1);
    color: white;
    margin: 20px ;
    display: flex;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;

    padding: 4px 16px;
}

.send-btn:hover {
    background-color: rgba(91, 192, 180, 0.9);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.send-btn:active {
    background-color: rgba(91, 192, 180, 0.8);
    transform: translateY(1px);
}

</style>