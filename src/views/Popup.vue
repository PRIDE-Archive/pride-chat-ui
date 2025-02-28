<template>
    <div>
        <welcome v-if="isWelcome" @onChat="onChat"></welcome>
        <div v-else class="popup-container" style="min-height: 100vh;overflow: auto;">
            <div class="popup-header">
                <Icon type="ios-arrow-back" color="white" size="30" @click="isWelcome = true" />
            </div>
            <Alert banner closable type="warning">
                <div style="color: gray; text-align:justify; font-size: 12px;">
                    Disclaimer: This chatbot is designed to assist you with general
                    information and basic inquiries. Please note that it is not a
                    replacement for our dedicated
                    <a href="mailto:pride-support@ebi.ac.uk">helpdesk</a> support or
                    official
                    <a href="https://www.ebi.ac.uk/pride/markdownpage/documentationpage">documentation</a>. While the
                    chatbot is
                    powered by a language model, it may
                    occasionally produce responses that are unrelated or incorrect, known
                    as LLM hallucinations, due to the inherent limitations of the
                    technology. Therefore, we recommend using this tool as a supplementary
                    resource and encourage you to consult our helpdesk and official
                    documentation for critical or complex inquiries.
                </div>
            </Alert>
            <Tabs :value="type" :animated="true">
                <TabPane label="PRIDE Assistant" name="assistant">
                    <chat></chat>
                </TabPane>
<!--                <TabPane label="Dataset Search" name="search">-->
<!--                    <chat-px></chat-px>-->
<!--                </TabPane>-->
                <!-- <TabPane label="Chatbot Arena(side-by-side)" name="side"><side-by-side></side-by-side></TabPane> -->
                <!-- <Button @click="exportData" size="small" slot="extra">Export Data</Button> -->
            </Tabs>
        </div>

    </div>
</template>

<script>
import ChatPx from "@/component/popup/ChatPx.vue";
import Chat from "@/component/popup/Chat.vue";
import Welcome from "@/component/popup/Welcome.vue";

export default {
    data() {
        return {
            type: 'assistant',
            isWelcome: true,
        };
    },
    components: {
        Chat,
        ChatPx,
        Welcome
    },
    async mounted() {
        console.log("mounted");
        const queryParameters = this.$route.query;
        if (queryParameters.type == 'assistant' || queryParameters.type == 'search') {
            this.type = queryParameters.type;
        }

    },
    beforeDestroy() { },
    methods: {
        onChat: function () {
            this.isWelcome = false;
        },
        clearData: function () {

        }
    },
};
</script>

<style scoped>
.popup-header {
    height: 50px;
    background-color: #5BC0BE;
    color: white;
    display: flex;
    align-items: center;
    padding-left: 16px;
    cursor: pointer;
}

/deep/ .ivu-tabs-nav .ivu-tabs-tab-active {
    color: #5BC0BE !important;
}

/deep/ .ivu-tabs-ink-bar {
    background-color: #5BC0BE !important;
}
</style>
