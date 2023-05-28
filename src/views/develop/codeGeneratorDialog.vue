<template>
  <DragDialog ref="DragDialogRef" width="60%" title="代码生成">
    <template slot="content">
      <PanelGroup
        v-show="formIndex == 1"
        ref="panelGroupRef"
        :option="panelOption"
        :span="12"
      ></PanelGroup>
      <div v-show="formIndex == 2">
        <EndForm ref="endFormRef"></EndForm>
      </div>
      <div v-show="formIndex == 3">
        <FrontForm ref="frontFormRef"></FrontForm>
      </div>
    </template>
    <template slot="footer">
      <div class="dialog-footer">
        <el-button
          v-show="formIndex != 1"
          type="primary"
          @click="formIndex = 1"
        >
          返回
        </el-button>
        <el-button
          v-show="formIndex != 1"
          :loading="getGeneratorLoading()"
          type="success"
          @click="codeGenerator"
        >
          生成代码
        </el-button>
        <el-button @click="hide"> 关闭 </el-button>
      </div>
    </template>
  </DragDialog>
</template>

<script>
import DragDialog from "../../components/DragDialog";
import api from '../../api/develop'
import { copyProperties } from '../../utils/common'

export default {
  name: "codeGeneratorDialog",
  components: {
    DragDialog,
  },
  beforeCreate: function () {
    this.$options.components.PanelGroup = require("../../components/PanelGroup").default;
    this.$options.components.EndForm = require("./EndForm").default;
    this.$options.components.FrontForm = require("./FrontForm").default;
  },
  data() {
    return {
      endGeneratorLoading: false,
      frontGeneratorLoading: false,
      frontTableLoading: false,
      data:{
        id: "",
        tableName: "",
        moduleName: "",
        author: "",
        needCrudController: false
      },
      formIndex: 1, //1 主页面 //2 后端页面 //3 前端页面
      panelOption: [
        {
          iconClass: "bug",
          content: "后端代码生成",
          onclick: () => {
            this.$refs.endFormRef.setData(this.data);
            this.formIndex = 2;
          },
        },
        {
          iconClass: "tab",
          content: "前端代码生成",
          onclick: () => {
            this.$refs.frontFormRef.setData(this.data);
            this.formIndex = 3;
          },
        },
      ],
    };
  },
  components: { DragDialog },
  name: "App",
  methods: {
    show(data) {
      this.data = copyProperties(this.data, data);
      this.formIndex = 1
      this.$refs.DragDialogRef.show();
    },
    hide(){
      this.$refs.DragDialogRef.hide();
    },
    codeGenerator() {
      if(this.formIndex == 2){
        this.endGenerator()
      }else if(this.formIndex == 3){
        this.frontGenerator()
      }
    },
    endGenerator(){
      this.$message({
        message: '代码生成中,请稍后......',
        type: 'warning'
      })
      this.endGeneratorLoading = true
      api.endGenerator(this.$refs.endFormRef.getFormData()).then(res => {
        this.endGeneratorLoading = false
        this.$message({
          message: '代码生成完毕......',
          type: 'success'
        })
        this.formIndex = 1
        this.hide()
        this.$emit('afterEndGenerator', res.data)
      })
    },
    frontGenerator(){
      this.$message({
        message: '代码生成中,请稍后......',
        type: 'warning'
      })
      this.frontGeneratorLoading = true
      api.frontGenerator(this.$refs.frontFormRef.getFormData()).then(res => {
        this.frontGeneratorLoading = false
        this.$message({
          message: '代码生成完毕......',
          type: 'success'
        })
        this.formIndex = 1
        this.hide()
        this.$emit('afterFrontGenerator')
      })
    },
    getGeneratorLoading(){
      if(this.formIndex == 2){
        return this.endGeneratorLoading;
      }else if(this.formIndex == 3){
        return this.frontGeneratorLoading || this.frontTableLoading;
      }
    }
  },
};
</script>

<style scoped>
</style>
  