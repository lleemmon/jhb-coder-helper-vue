<template>
    <el-form :model="data" label-position="left" label-width="70px" style="width: 90%; margin-left:5%;">
        <el-form-item label="表名">
            <el-input v-model="data.tableName" disabled />
        </el-form-item>
        <el-form-item label="模块名">
            <el-input v-model="data.moduleName" disabled />
        </el-form-item>
        <el-form-item label="作者">
            <el-input v-model="data.author" disabled />
        </el-form-item>
    </el-form>
</template>
<script>
    import { copyProperties } from '../../utils/common'

    export default {
        data(){
            return {
                data: {
                    tableName: '',
                    moduleName: '',
                    author: ''
                }
            }
        },
        methods:{
            setData(data){
                this.data = copyProperties(this.data, data)
            },
            getFormData(){
                return this.data
            }
        }
    }
</script>
<style scoped>

</style>