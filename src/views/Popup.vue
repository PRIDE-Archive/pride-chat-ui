<template>
    <div>
        <welcome v-if="isWelcome" @onChat="onChat"></welcome>
        <div v-else class="popup-container" style="min-height: 100vh;overflow: auto;">
            <div class="popup-header">
                <Icon type="ios-arrow-back" color="white" size="30" @click="isWelcome = true" />
            </div>
            <Tabs :value="type" :animated="true">
                <TabPane label="PRIDE Assistant" name="assistant">
                    <chat></chat>
                </TabPane>
                <TabPane label="Dataset Search" name="search">
                    <chat-px></chat-px>
                </TabPane>
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
            isWelcome: false,
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

 /deep/ .ivu-tabs-nav .ivu-tabs-tab-active{
    color: #5BC0BE !important;
}
/deep/ .ivu-tabs-ink-bar{
    background-color: #5BC0BE !important;
}

</style>
