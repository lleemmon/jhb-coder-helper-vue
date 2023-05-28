<template>
    <DragDialog ref="DragDialogRef" width="60%" title="表单">
        <template slot="content">
            <el-form ref="formRef" :model="data" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
                <el-form-item label="描述" prop="descRibe" required>
                    <el-input v-model="data.descRibe" />
                </el-form-item>
                <el-form-item label="字典类型" prop="type" required>
                    <el-input v-model="data.type" />
                </el-form-item>
            </el-form>
        </template>
        <template slot="footer">
            <div class="dialog-footer">
                <el-button
                    :loading="loading"
                    type="success"
                    @click="submitForm"
                >
                    保存
                </el-button>
                <el-button @click="hide"> 关闭 </el-button>
            </div>
        </template>
    </DragDialog>
</template>

<script>
    import DragDialog from "../../../components/DragDialog";
    import api from '../../../api/develop/sysDict'
    import { copyProperties, removeDictTypeFromCache, removeDictList } from '../../../utils/common'

    export default {
        name: "formDialog",
        components: {
            DragDialog,
        },
        data() {
            return {
                loading: false,
                isUpdate: false,
                data:{
                    id: null,
                    descRibe: null,//描述
                    type: null,//字典类型
                },
                oriType: null //打开页面时的type
            };
        },
        methods: {
            show(data) {
                if(data){
                    this.data = copyProperties(this.data, data)
                    this.type = data.type
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
            submitForm() {
                this.$refs.formRef.validate((valid) => {
                    if (valid) {
                        this.saveOrUpdate();
                    } else {
                        this.$message({
                            message: '表单验证不通过......',
                            type: 'error'
                        })
                        return false;
                    }
                });
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
                    this.hide()
                    this.$emit('reload')
                    if(this.isUpdate){
                        removeDictTypeFromCache(this.type);
                    }
                    removeDictList();
                })
            }
        }
    };
</script>

<style scoped>

</style>