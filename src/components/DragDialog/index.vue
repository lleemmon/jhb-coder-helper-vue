<template>
  <div class="components-container">
    <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" 
      :title="title" @dragDialog="handleDrag" :width="width" align-center>
      <slot name="content"></slot>
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

export default {
  name: 'DragDialog',
  directives: { elDragDialog },
  props: {
    width: {
      type: String,
      default: "50%"
    },
    title: {
      type: String,
      default: "可拖拽弹出层"
    }
  },
  data() {
    return {
      dialogTableVisible: false
    }
  },
  methods: {
    // v-el-drag-dialog onDrag callback function
    handleDrag() {
      // this.$refs.select.blur()
    },
    show(){
      this.dialogTableVisible = true
    },
    hide(){
      this.dialogTableVisible = false
    }
  }
}
</script>
