<template>
    <div>
        <div class="container" style="min-height: 100vh;overflow: auto;">
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
import ChatPx from "@/component/ChatPx.vue";
import Chat from "@/component/Chat.vue";

export default {
    data() {
        return {
            type: 'assistant'
        };
    },
    components: {
        Chat,
        ChatPx
    },
    async mounted() {
        console.log("mounted");
        const queryParameters = this.$route.query;
        if(queryParameters.type == 'assistant' || queryParameters.type == 'search'){
            this.type = queryParameters.type;
        }

    },
    beforeDestroy() { },
    methods: {
        exportData: function () {

            // 
        },
        clearData: function () {

        }
    },
};
</script>

<style scoped>

</style>