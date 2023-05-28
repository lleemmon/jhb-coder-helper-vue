<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input v-model="listQuery.type" placeholder="请输入字典类型" style="width: 200px;" class="filter-item" @keyup.enter.native="loadData"/>
            <el-input v-model="listQuery.descRibe" placeholder="请输入字典描述" style="width: 200px;" class="filter-item" @keyup.enter.native="loadData"/>
            <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="loadData">
                查询
            </el-button>
            <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-plus" @click="showDialog(null)">
                添加
            </el-button>
            <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-back" @click="back">
                返回
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
                <el-table-column label="描述" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.descRibe }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="字典类型" align="center">
                    <template slot-scope="{row}">
                        <span>{{ row.type }}</span>
                    </template>
                </el-table-column>
            <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="showDialog(row)">
                        修改
                    </el-button>
                    <el-button type="success" size="mini" @click="showDictItems(row)">
                        字典项管理
                    </el-button>
                    <el-button type="danger" size="mini" @click="handleDelete(row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="loadData" />
        <sysDictFormDialog ref="sysDictFormDialogRef" @reload="reloadData"></sysDictFormDialog>
        <sysDictItemsDialog ref="sysDictItemsDialogRef"></sysDictItemsDialog>
    </div>
</template>

<script>
    import api from '../../../api/develop/sysDict'
    import Pagination from '../../../components/Pagination'
    import waves from '../../../directive/waves'
    import sysDictFormDialog from './formDialog.vue'
    import sysDictItemsDialog from '../sysDictItems/sysDictItemsDialog.vue'
    import { removeDictList } from '../../../utils/common'

    export default {
        components: { Pagination, sysDictFormDialog, sysDictItemsDialog },
        directives: { waves },
        data() {
            return {
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    type: null,//字典类型
                    descRibe: null//字典描述
                },
                list: [],
                total: 0
            }
        },
        mounted() {
            this.reloadData()
        },
        methods: {
            back(){
                this.$router.push({ name: 'develop' })
            },
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
            showDialog(row){
                this.$refs.sysDictFormDialogRef.show(row)
            },
            showDictItems(row){
                this.$refs.sysDictItemsDialogRef.show(row.id, row.type)
            },
            handleDelete(row){
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
                    removeDictList();
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>

