<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh">

      <div style="display: flex; align-items: center;justify-content: space-between; ">
        <div style="text-align: left; padding: 8px 16px; display:flex; ">
          <Upload ref="upload" v-model="files" :action="action" :headers="headers" :show-upload-list="false"
            :format="['md']" accept="*.md" name="files" multiple :webkitdirectory="true" :before-upload="onBeforeUpload"
            :on-format-error="handleFormatError" :on-success="onUploadSuccess" :on-error="onUploadFailed"
            :on-progress="test">
            <Button icon="ios-cloud-upload-outline">Upload Folder</Button>
          </Upload>
          <Upload ref="upload" v-model="files" style="margin-left:8px;" :action="action" :headers="headers"
            :show-upload-list="false" :format="['md']" accept="*.md" name="files" :webkitdirectory="false"
            :before-upload="onBeforeUpload" :on-format-error="handleFormatError" :on-success="onUploadSuccess"
            :on-error="onUploadFailed" :on-progress="test">
            <Button icon="ios-cloud-upload-outline">Upload File</Button>
          </Upload>
          <Button style="margin-left:8px;" @click="onDeleteAll" type="warning">Delete All</Button>
        </div>
        <div>
          <router-link class="navBar " to="/visualize"><Button type="success">Visualize</Button></router-link>
        </div>
      </div>
      <div style="padding: 8px 16px">
        <Table stripe border :columns="columns" :data="list">
          <template slot-scope="{ index }" slot="index">
            <span>{{ index + 1 }}</span>
          </template>
          <template slot="action" slot-scope="{ row }">
            <div style="
                display: flex;
                align-items: center;
                justify-content: space-around;
              ">
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
import { listFile, deleteFile, donwloadFile, clearFiles } from "@/api/api";
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
      files: [],
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
  beforeDestroy() { },
  methods: {
    listAllFiles: function () {
      this.$Spin.show();
      listFile()
        .then((res) => {
          this.list = res.data;
          this.$Message.success("Load Successfully");
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
              this.$Message.success("Delete Successfully");
              this.listAllFiles();
            })
            .catch((e) => {
              this.$Message.warning("delete model failed");
            });
        },
        onCancel: () => { },
      });
    },
    onDeleteAll: function (e) {
      this.$Modal.confirm({
        title: "waring",
        content: "<p>The all model will be deleted</p>",
        onOk: () => {
          clearFiles()
            .then(() => {
              this.listAllFiles();
            })
            .catch((e) => {
              this.$Message.warning("delete model failed");
            });
        },
        onCancel: () => { },
      });

    },
    onBeforeUpload: function (e) {
      console.log('onBeforeUpload', e);
      console.log('files:', this.$refs.upload.fileList);
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' it\'s ignored automatically'
      });
    },
    onUploadSuccess: async function (response, file, fileList) {
      console.log('onUploadSuccess:', response, file, fileList);
      console.log('files:', this.$refs.upload.fileList);
      let res = await listFile();
      this.list = res.data;
      this.$Message.success("Upload Successfully");
    },
    onUploadFailed: function (e) {
      console.error(e);
      this.$Message.warning("Upload Failed");
    },
    test(event, file, fileList) {
      // console.log('aaa',fileList)
    }
  },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
