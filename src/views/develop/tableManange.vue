<template>
  <div class="app-container">
    <div class="filter-container">
      <el-autocomplete
          style="width: 200px;"
          v-model="listQuery.moduleName"
          placeholder="请输入模块名"
          :fetch-suggestions="moduleNameQuerySearch"
          clearable
      />
      <el-input v-model="listQuery.tableName" placeholder="请输入表名" style="width: 200px;" class="filter-item" @keyup.enter.native="loadData"/>
      <el-select v-model="listQuery.inTable" placeholder="是否存在" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in sf" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.isGeneratorFront" placeholder="前端是否生成" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in sf" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.isGeneratorEnd" placeholder="后端是否生成" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in sf" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-search" @click="loadData">
          查询
      </el-button>
      <el-button v-waves :loading="listLoading" class="filter-item" type="primary" icon="el-icon-back" @click="back">
          返回
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" type="index" width="75px" align="center"/>
      <el-table-column label="模块名" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.moduleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名" width="250px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.tableName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否存在" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ parseCode('sf', row.inTable) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="后端已生成" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ parseCode('sf', row.isGeneratorEnd) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端已生成" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ parseCode('sf', row.isGeneratorFront) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ formatTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button v-if="row.inTable==0" type="primary" size="mini" @click="openInsertFrom(row, $index)">
              入库
          </el-button>
          <el-button v-if="row.inTable==1" type="primary" size="mini" @click="openInsertFrom(row, $index, true)">
              修改
          </el-button>
          <el-button v-if="row.inTable==1" type="info" size="mini" @click="showTableFieldConfigTable(row)">
              配置修改
          </el-button>
          <el-button v-if="row.inTable==1" size="mini" type="success" @click="showCodeGeneratorForm(row, $index)">
              代码生成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <CodeGeneratorDialog ref="CodeGeneratorDialogRef" @afterEndGenerator="afterEndGenerator"
      @afterFrontGenerator="afterFrontGenerator"></CodeGeneratorDialog>
    <insertFormDialog ref="insertFormDialogRef" @afterInsert="afterInsert"></insertFormDialog>
    <tableFieldConfigTableDialog ref="tableFieldConfigTableDialogRef"></tableFieldConfigTableDialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="loadData" />
  </div>
</template>

<script>
import api from '../../api/develop'
import { parseCode, getDictByDictType } from '../../utils/common'
import Pagination from '@/components/Pagination'
import CodeGeneratorDialog from '@/views/develop/codeGeneratorDialog'
import insertFormDialog from './insertFormDialog.vue'
import tableFieldConfigTableDialog from './tableFieldConfigTableDialog'

import waves from '@/directive/waves'
import { parseTime } from '@/utils'

export default {
  name:"tableManange",
  components: { Pagination, CodeGeneratorDialog, insertFormDialog, tableFieldConfigTableDialog },
  directives: { waves },
  data() {
    return {
      tableKey: "tableName",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        tableName: null,
        isGeneratorFront: null,
        isGeneratorEnd: null,
        inTable: null,
        moduleName: null
      },
      list: [],
      total: 0,
      currIndex: 0,
      sf: [],
      moduleNameAutoCompleteData: []
    }
  },  
  mounted() {
    this.reloadData();
    api.getAutoCompleteForModule().then(res => {
        this.moduleNameAutoCompleteData = res.data
    })
    getDictByDictType('sf').then(res => this.sf = res);
  },
  methods: {
    parseCode(dictType, value){
      return parseCode(dictType, value);
    },
    back(){
      this.$router.push({ name: 'develop' })
    },
    reloadData(){
      this.listQuery.page = 1
      this.loadData()
    },
    loadData(){
      this.listLoading = true
      api.getSysGeneratorTableList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.data.records
        this.total = res.data.total
      })
    },
    formatTime(time, format){
      return parseTime(time, format)
    },
    openInsertFrom(row, currIndex){
      this.$refs.insertFormDialogRef.show(row)
      this.currIndex = currIndex;
    },
    showCodeGeneratorForm(row, currIndex){
      this.currIndex = currIndex;
      this.$refs.CodeGeneratorDialogRef.show(row);
    },
    showTableFieldConfigTable(row){
      this.$refs.tableFieldConfigTableDialogRef.show(row)
    },
    afterEndGenerator(data){
      this.$set(this.list, this.currIndex, data)
    },
    afterFrontGenerator(){
      this.reloadData();
    },
    afterInsert(data){
      this.$set(this.list, this.currIndex, data)
    },
    moduleNameQuerySearch(queryString, callback){
        let filterData = this.moduleNameAutoCompleteData
            .filter(item => item.link.toLowerCase().indexOf(queryString.toLowerCase()) != -1)
        callback(filterData)
    }
  }
}
</script>

<style lang="scss" scoped>



</style>

