<template>
  <div class="dashboard-editor-container">
    <PanelGroup ref="panelGroupRef" :option="panelOption"></PanelGroup>
  </div>
</template>

<script>
import PanelGroup from '../../components/PanelGroup.vue'

export default {
  components: {
    PanelGroup
  },
  data() {
    return {
      panelOption: [{
        iconClass: "table",
        content: "数据表管理",
        onclick: () => { this.$router.push({ name: 'tableManange' })  }
      }, {
        iconClass: "education",
        content: "字典管理",
        onclick: () => { this.$router.push({ name: 'sysDict' }) }
      }]
    }
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    position: relative;
  }
// .line{
//   text-align: center;
// }
</style>

