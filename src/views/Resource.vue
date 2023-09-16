<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh">
      <div style="text-align: left; padding: 8px 16px">
        <Upload
          :action="action"
          :headers="headers"
          :show-upload-list="false"
          name="new_file"
          :on-success="onUploadSuccess"
          :on-error="onUploadFailed"
        >
          <Button icon="ios-cloud-upload-outline">Upload</Button>
        </Upload>
      </div>
      <div style="padding: 8px 16px">
        <Table stripe border :columns="columns" :data="list">
          <template slot-scope="{ index }" slot="index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-around;
              "
            >
              <Button type="success" @click="onDownload(row)">download</Button>
              <Button type="warning" @click="onDelete(row)">delete</Button>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
import { listFile, deleteFile, donwloadFile } from "@/api/api";
import { baseURL } from "@/api/request";
import navbar from "./Navbar.vue";
export default {
  data() {
    return {
      columns: [
        {
          title: "",
          slot: "index",
          width: 100,
        },
        {
          title: "Source",
          key: "source",
        },
        {
          title: "Size",
          key: "size",
          width: 100,
        },
        {
          title: "CreateTime",
          key: "date",
          width: 300,
        },
        {
          title: "Action",
          slot: "action",
          width: 200,
          align: "center",
        },
      ],
      list: [],
      action: "",
      baseURL: baseURL,
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  },
  components: {
    navbar,
  },
  async mounted() {
    this.listAllFiles();
    this.action = baseURL + "/upload";
  },
  beforeDestroy() {},
  methods: {
    listAllFiles: function () {
      this.$Spin.show();
      listFile()
        .then((res) => {
          this.list = res.data;
          console.log(this.list);
        })
        .catch((e) => {
          this.$Message.warning("load models failed");
        })
        .finally(() => {
          this.$Spin.hide();
        });
    },
    onDownload: function (row) {
      console.log(row);
      let url = `${baseURL}/download?filename=${row.source}`;
      console.log(url);
      window.open(url);
    },
    onDelete: async function (row) {
      console.log(row);
      this.$Modal.confirm({
        title: "waring",
        content: "<p>The model will be deleted</p>",
        onOk: () => {
          deleteFile(row.source)
            .then(() => {
              this.listAllFiles();
            })
            .catch((e) => {
              this.$Message.warning("delete model failed");
            });
        },
        onCancel: () => {},
      });
    },
    onUploadSuccess: async function (e) {
      let res = await listFile();
      this.list = res.data;
      this.$Message.success("上传成功");
    },
    onUploadFailed: function (e) {
      console.error(e);
      this.$Message.warning("上传失败");
    },
  },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
