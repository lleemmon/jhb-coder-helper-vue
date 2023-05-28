<template>
    <el-form :model="data" label-position="left" label-width="70px" style="width: 80%; margin-left:10%;">
        <el-form-item label="表名">
            <el-input v-model="data.tableName" disabled />
        </el-form-item>
        <el-form-item label="模块名">
            <el-input v-model="data.moduleName" disabled />
        </el-form-item>
        <el-form-item label="作者">
            <el-input v-model="data.author" disabled />
        </el-form-item>
        <el-form-item label="是否生成Controller基础接口" label-width="200px">
            <!-- 如果前端已经生成 会建议不要生成Controller基础接口 -->
            <el-switch v-model="data.needCrudController"  active-value="1" inactive-value="0" />
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
                    author: '',
                    needCrudController: '0'
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