<template>
    <DragDialog ref="DragDialogRef" width="80%" title="表配置">
        <template slot="content">
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

                <el-table
                    key="fieldName"
                    v-loading="listLoading"
                    :data="data.tableFields"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;"
                >
                    <el-table-column label="序号" type="index" width="75px" align="center"/>
                    <el-table-column label="字段名" align="center">
                        <template slot-scope="{row}">
                            <span>{{ row.fieldName }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="字段类型" align="center">
                        <template slot-scope="{row}">
                            <span>{{ mysqlFieldMap[row.dataType] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="组件类型" align="center">
                        <template slot-scope="{row}">
                            <el-select v-model="row.component">
                                <el-option v-for="item in elementComponentList" :label="item.label" :value="item.value" :key="item.value" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="字典类型" align="center">
                        <template slot-scope="{row}">
                            <el-select v-if="row.component == 'select'" v-model="row.type">
                                <el-option v-for="item in dictTypeList" :label="item.label" :value="item.value" :key="item.value" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="列表" align="center">
                        <template slot-scope="{row}">
                            <el-switch v-model="row.needList" active-value="1" inactive-value="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="查询" align="center">
                        <template slot-scope="{row}">
                            <el-switch v-model="row.needWhere" active-value="1" inactive-value="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="表单" align="center">
                        <template slot-scope="{row}">
                            <el-switch v-model="row.needForm" active-value="1" inactive-value="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="可为空" align="center">
                        <template slot-scope="{row}">
                            <el-switch v-model="row.isNullable" active-value="1" inactive-value="0" />
                        </template>
                    </el-table-column>
                    <el-table-column label="描述" width="150px" align="center">
                        <template slot-scope="{row}">
                            <el-input v-model="row.remarks" />
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </template>
        <template slot="footer">
            <div class="dialog-footer">
                <el-button
                    :loading="listLoading"
                    type="success"
                    @click="saveGeneratorConfig()"
                >
                    保存
                </el-button>
                <el-button @click="hide"> 关闭 </el-button>
            </div>
        </template>
    </DragDialog>

</template>
<script>
    import { copyProperties, changeSelectListToMap, getDictType } from '../../utils/common'
    import api from '../../api/develop'
    import DragDialog from "../../components/DragDialog";

    export default {
        name: "tableFieldConfigTableDialog",
        components: {
            DragDialog,
        },
        data(){
            return {
                data: {
                    tableName: '',
                    moduleName: '',
                    author: '',
                    tableFields: []
                },
                listLoading: false,
                mysqlFieldMap: {},
                elementComponentList: [],
                dictTypeList: []
            }
        },
        methods:{
            show(data){
                this.data = copyProperties(this.data, data)
                this.listLoading = true
                this.$refs.DragDialogRef.show();
                api.getTableFieldList(data.tableName).then(res => {
                    this.data.tableFields = res.data
                    this.listLoading = false
                })
            },
            hide(){
                this.$refs.DragDialogRef.hide();
            },
            saveGeneratorConfig(){
                this.listLoading = true
                api.saveGeneratorConfig(this.data).then(res => {
                    this.$message({
                        message: '配置保存完毕......',
                        type: 'success'
                    })
                    this.listLoading = false
                    this.hide();
                })
            }
        },
        mounted(){
            api.getMysqlFieldSelection().then(res => {
                this.mysqlFieldMap = changeSelectListToMap(res.data)
            })
            api.getElementComponentSelection().then(res => {
                this.elementComponentList = res.data
            })
            getDictType().then(res => this.dictTypeList = res)
        }
    }
</script>
<style scoped>

</style>