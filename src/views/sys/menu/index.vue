<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          v-has="'sys:menu:add'"
          type="primary"
          @click="addOrUpdateHandle()"
        >
          添加
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-has="'sys:menu:edit'"
          type="success"
          :disabled="ids.length !==1"
          @click="addOrUpdateHandle(ids[0])"
        >
          修改
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-has="'sys:menu:del'"
          type="danger"
          :disabled="ids.length < 1"
          @click="delHandle"
        >
          删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      :data="tableData"
      row-key="id"
      highlight-current-row
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="name" label="名称" header-align="center" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope" align="center">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" header-align="center" align="center" />
      <el-table-column prop="path" label="路由地址" header-align="center" align="center" />
      <el-table-column prop="perms" label="权限标识" header-align="center" align="center" />
      <el-table-column prop="component" label="组件路径" align="center" />
      <el-table-column prop="isFrame" label="是否外链" align="center">
        <template slot-scope="scope" align="center">
          <el-tag v-if="scope.row.isFrame" type="success">是</el-tag>
          <el-tag v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope" align="center">
          <el-tag v-if="scope.row.status" type="danger">禁用</el-tag>
          <el-tag v-else type="success">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否隐藏" align="center">
        <template slot-scope="scope" align="center">
          <el-tag v-if="scope.row.hidden === 'true'" type="danger">隐藏</el-tag>
          <el-tag v-else type="success">显示</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="是否隐藏" align="center">
        <template slot-scope="scope" align="center">
          <el-tag v-if="scope.row.menuType === 1" type="success">目录</el-tag>
          <el-tag v-else-if="scope.row.menuType === 2" type="primary">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 3" type="warning">按钮</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getMenuDataList, del } from '@/api/menu'
import addOrUpdate from './add-or-update'
export default {
  name: 'Menu',
  components: {
    addOrUpdate
  },
  data() {
    return {
      loading: true,
      tableData: [],
      ids: [],
      addOrUpdateVisible: false
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getMenuDataList().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    selectionChangeHandle(selection) {
      if (selection) {
        const tmp = []
        selection.forEach(val => {
          tmp.push(val.id)
          this.ids = tmp
        })
      }
    },
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    delHandle() {
      const idList = []
      this.ids.forEach(val => {
        idList.push(val.id)
      })
      del(idList).then(res => {
        if (res.code === 200) {
          let txt = ''
          res.data.forEach(val => { txt = val + ',' })
          this.$message.success(`删除id为${txt}的记录成功！`)
          this.initData()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
