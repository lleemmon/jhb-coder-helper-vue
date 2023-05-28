<template>
    <DragDialog ref="DragDialogRef" width="80%" title="字典项列表">
        <template slot="content">
            <div class="app-container">
                <div class="filter-container">
                    <el-input v-model="listQuery.label" placeholder="请输入标签" style="width: 200px;" class="filter-item" @keyup.enter.native="loadData"/>
                    <el-input v-model="listQuery.value" placeholder="请输入值" style="width: 200px;" class="filter-item" @keyup.enter.native="loadData"/>
                    <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="loadData">
                        查询
                    </el-button>
                    <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-plus" @click="showDialog(null)">
                        添加
                    </el-button>
                </div>
                <el-table
                        key="id"
                        v-loading="listLoading"
                        :data="list"
                        border
                        fit
                        highlight-current-row
                        style="width: 100%;"
                >
                    <el-table-column label="序号" type="index" align="center" width="75px"/>
                        <el-table-column label="创建时间" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.createTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="更新时间" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.updateTime }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="标签" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.label }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="值" align="center">
                            <template slot-scope="{row}">
                                <span>{{ row.value }}</span>
                            </template>
                        </el-table-column>
                    <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
                        <template slot-scope="{row}">
                            <el-button type="primary" size="mini" @click="showDialog(row)">
                                修改
                            </el-button>
                            <el-button type="danger" size="mini" @click="handleDelete(row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="loadData" />
                <sysDictItemsFormDialog ref="sysDictItemsFormDialogRef" @reload="reloadData"></sysDictItemsFormDialog>
            </div>
        </template>
    </DragDialog>
</template>

<script>
    import DragDialog from "../../../components/DragDialog";
    import api from '../../../api/develop/sysDictItems'
    import Pagination from '../../../components/Pagination'
    import waves from '../../../directive/waves'
    import sysDictItemsFormDialog from './formDialog.vue'
    import { removeDictTypeFromCache } from '../../../utils/common'

    export default {
        components: { Pagination, sysDictItemsFormDialog, DragDialog },
        directives: { waves },
        data() {
            return {
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    label: null,//标签
                    value: null,//值
                    dictId: null
                },
                list: [],
                total: 0,
                dictType: null
            }
        },
        methods: {
            loadData(){
                this.listLoading = true
                api.page(this.listQuery).then(res => {
                    this.listLoading = false
                    this.list = res.data.records
                    this.total = res.data.total
                })
            },
            reloadData(){
                this.page = 1
                this.loadData()
            },
            show(dictId, dictType){
                this.dictType = dictType
                this.listQuery.dictId = dictId
                this.reloadData()
                this.$refs.DragDialogRef.show()
            },
            hide(){
                this.$refs.DragDialogRef.hide()
            },
            showDialog(row){
                if(!row){
                    row = {dictId: this.listQuery.dictId}
                }
                this.$refs.sysDictItemsFormDialogRef.show(row, this.dictType)
            },
            handleDelete(row){
                console.log(row)
                let loading = null;
                this.$confirm('是否删除该数据?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    loading = this.$loading({
                        lock: true,
                        text: '删除中......',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    return api.delete(row.id);
                }).then(res => {
                    this.$message({
                        message: '保存成功......',
                        type: 'success'
                    })
                    loading.close()
                    this.reloadData()
                    removeDictTypeFromCache(this.dictType)
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>

