<template>
  <div>
    <navbar />
    <div class="container" style="min-height: 100vh">

      <div style="display: flex; align-items: center;justify-content: space-between; ">
        <div style="text-align: left; padding: 8px 16px; display:flex; ">
          <Button @click="onUploadFile" icon="ios-cloud-upload-outline" type="success">Upload File</Button>
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
    <Modal v-model="uploadModel" title="Upload File" ok-text="close" cancel-text="" :closable="false"
      :mask-closable="false">
      <div v-if="uploadStatus == 2">
        <Alert type="success">Upload Successfully</Alert>
      </div>
      <div v-else-if="uploadStatus == 3">
        <Alert type="error">Upload Failed</Alert>
      </div>
      <Upload v-else ref="upload" type="drag" v-model="files" :action="action" :headers="headers"
        :show-upload-list="false" :format="exts" name="files" :webkitdirectory="false" :before-upload="onBeforeUpload"
        :on-format-error="handleFormatError" :on-success="onUploadSuccess" :on-error="onUploadFailed"
        :on-progress="onProgress">
        <div style="padding: 20px 0" v-if="uploadStatus == 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>Click or drag files here to upload</p>
        </div>
        <div style="padding: 20px 0" v-if="uploadStatus == 1">
          <p style="margin-top:8px;"><Progress style="width: 100%;" :percent="percent" /></p>
        </div>

      </Upload>

      <div slot="footer">
        <Button type="info" :loading="uploadStatus == 1" @click="uploadModel = false">Close</Button>
      </div>

    </Modal>
  </div>
</template>

<script>
import { listFile, deleteFile, clearFiles } from "@/api/api";
import { baseURL, resourceURL } from "@/api/request";
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
      resourceURL: resourceURL,
      headers: { "Access-Control-Allow-Origin": "*" },
      percent: 0,
      uploadModel: false,
      exts: ['zip'],
      uploadStatus: 0, // 0 init, 1 uploading, 2 success, 3 error
    };
  },
  components: {
    navbar,
  },
  async mounted() {
    this.listAllFiles();
    this.action = resourceURL + "/upload";
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
    getExtension: function (fileName) {
      const arr = fileName.split('.');
      return arr[arr.length - 1];
    },
    onUploadFile: function () {
      this.uploadStatus = 0;
      this.percent = 0;
      this.uploadModel = true;
    },
    onBeforeUpload: function (e) {
      this.percent = 0;
      let name = e.name;
      let ext = this.getExtension(name);
      console.log(name, ext, !this.exts.includes(ext));
      if (!this.exts.includes(ext)) {
        console.log("failed");
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format must of ' + this.exts.join(',') + ' it\'s ignored automatically'
        });
        return false;
      }
      this.uploadStatus = 1;
      return true;
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
      // this.$Message.success("Upload Successfully");
      this.uploadStatus = 2;
    },
    onUploadFailed: function (e) {
      console.error(e);
      // this.$Message.warning("Upload Failed");
      this.uploadStatus = 3;
    },
    onProgress(event, file, fileList) {
      console.log(event, file, fileList)
      this.percent = event.percent;
    }
  },
};
</script>

<style scoped>
@import "@/assets/style.css";
</style>
