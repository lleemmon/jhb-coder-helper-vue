<template>
    <DragDialog ref="DragDialogRef" width="60%" title="代码生成">
      <template slot="content">
        <el-form :model="data" label-position="left" label-width="70px" style="width: 80%; margin-left:10%;">
        <el-form-item label="表名">
            <el-input v-model="data.tableName" disabled />
        </el-form-item>
        <el-form-item label="模块名">
            <el-autocomplete
                v-model="data.moduleName"
                :fetch-suggestions="moduleNameQuerySearch"
                clearable
            />
        </el-form-item>
        <el-form-item label="作者">
            <el-input v-model="data.author" />
        </el-form-item>
        <el-form-item label="备注">
            <el-input v-model="data.remarks" type="textarea" />
        </el-form-item>
    </el-form>
      </template>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button @click="hide">关闭</el-button>
          <el-button
            :loading="insertLoading"
            type="primary"
            @click="saveOrUpdate">
            确认
          </el-button>
        </div>
      </template>
    </DragDialog>
  </template>
  
  <script>
  import DragDialog from "../../components/DragDialog";
  import api from '../../api/develop'
  import { copyProperties } from '../../utils/common'

  export default {
    name: "insertFormDialog",
    components: {
      DragDialog,
    },
    data() {
      return {
        insertLoading: false,
        data:{
            id: "",
            tableName: "",
            moduleName: "",
            author:"",
            remarks: ""
        },
        moduleNameAutoCompleteData: []
      };
    },
    methods: {
      show(data) {
        this.data = copyProperties(this.data, data)
        this.$refs.DragDialogRef.show();
      },
      hide(){
        this.$refs.DragDialogRef.hide();
      },
      saveOrUpdate(){
        if(this.data.id){
            this.update();
        }else{
            this.insert();
        }
      },
      insert(){
        this.insertLoading = true
        api.insert(this.data).then(res => {
            // 返回 res.data
            this.insertLoading = false
            this.hide()
            this.$emit('afterInsert', res.data)
            this.$message({
              message: '入库成功......',
              type: 'success'
            })
        })
      },
      update(){
        this.insertLoading = true
        api.update(this.data).then(res => {
            // 返回 res.data
            this.insertLoading = false
            this.hide()
            this.$emit('afterInsert', res.data)
            this.$message({
              message: '修改成功......',
              type: 'success'
            })
        })
      },
      moduleNameQuerySearch(queryString, callback){
        let filterData = this.moduleNameAutoCompleteData
            .filter(item => item.link.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        callback(filterData)
      }
    },
    mounted(){
        api.getAutoCompleteForModule().then(res => {
            this.moduleNameAutoCompleteData = res.data
        })
    }
  };
  </script>
  
  <style scoped>
  </style>
    