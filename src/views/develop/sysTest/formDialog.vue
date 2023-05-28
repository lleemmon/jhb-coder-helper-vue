<template>
    <DragDialog ref="DragDialogRef" width="60%" title="表单">
      <template slot="content">
        <el-form ref="data" :model="data" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
            <el-form-item label="Date" prop="timestamp">
                <el-date-picker v-model="data.timestamp" type="datetime" placeholder="Please pick a date" />
            </el-form-item>
            <el-form-item label="Title" prop="title">
                <el-input v-model="data.title" />
            </el-form-item>
        </el-form>
      </template>
      <template slot="footer">
        <div class="dialog-footer">
          <el-button
            :loading="loading"
            type="success"
            @click="saveOrUpdate"
          >
            保存
          </el-button>
          <el-button @click="hide"> 关闭 </el-button>
        </div>
      </template>
    </DragDialog>
  </template>
  
  <script>
  import DragDialog from "../../components/DragDialog";//无模块
  import api from '../../api/develop/sysTest'//无模块
  import { copyProperties } from '../../utils/common'//无模块
  // import DragDialog from "../../../components/DragDialog";//有模块
  // import api from '../../../api/develop/sysTest'//有模块
  // import { copyProperties } from '../../../utils/common'//有模块
  
  export default {
    name: "sysTestFromDialog",
    components: {
      DragDialog,
    },
    data() {
      return {
        loading: false,
        isUpdate: false,
        data:{

        }
      };
    },
    methods: {
      show(data) {
        if(data){
          this.data = copyProperties(this.data, data)
          if(this.data.id){
            this.loading = true
            this.isUpdate = true
          }else{
            this.isUpdate = false
          }
        }else{
          this.isUpdate = false
        } 
        if(this.isUpdate){
            api.get(this.data.id).then(res => {
                this.data = res.data
                this.loading = false
            })
        }
        this.$refs.DragDialogRef.show();
      },
      hide(){
        this.$refs.DragDialogRef.hide();
      },
      insert(){
        this.loading = true
        return api.insert(this.data)
      },
      update(){
        this.loading = true
        return api.update(this.data)
      },
      saveOrUpdate(){
        let method = null;
        if(this.isUpdate){
            method = this.update();
        }else{
            method = this.insert();
        }
        method.then(res => {
            this.$message({
                message: '保存成功......',
                type: 'success'
            })
            this.loading = false
            hide()
            this.$emit('reload')
        })
      }
    }
  };
  </script>
  
  <style scoped>

  </style>
    