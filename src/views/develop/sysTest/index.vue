<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="loadData">
          查询
      </el-button>
      <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-plus" @click="showDialog">
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
      <el-table-column label="序号" type="index" align="center"/>
      <el-table-column label="模块名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.moduleName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showDialog(row)">
              修改
          </el-button>
          <el-button type="primary" size="mini" @click="handleDelete(row)">
              删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="loadData" />
    <sysTestFormDialog ref="sysTestFromDialogRef" @reload="reloadData"></sysTestformDialog>
  </div>
</template>

<script>
import api from '../../../api/develop/sysTest' //有模块名
import Pagination from '../../../components/Pagination'//有模块名
import waves from '../../../directive/waves'
import sysTestFormDialog from './formDialog.vue'
import { parseTime } from '../../../utils'

export default {
  name: "sysTest",
  components: { Pagination, sysTestFormDialog },
  directives: { waves },
  data() {
    return {
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      list: [],
      total: 0
    }
  },  
  mounted() {
    this.reloadData()
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
      loadData()
    },
    formatTime(time, format){
      return parseTime(time, format)
    },
    showDialog(row){
      this.$refs.sysTestFromDialogRef.show(row)
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
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

