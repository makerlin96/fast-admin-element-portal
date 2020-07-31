<template>
  <el-dialog
    :title="!id ? '编辑' : '新增'"
    :visible.sync="dialogFormVisible"
    width="580px"
    close-on-click-modal
  >
    <el-form ref="form" :inline="true" :model="form" size="small" label-width="80px">
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="form.menuType" size="mini" style="width: 450px">
          <el-radio-button label="1">目录</el-radio-button>
          <el-radio-button label="2">菜单</el-radio-button>
          <el-radio-button label="3">按钮</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.menuType.toString() !== '3'" label="菜单图标" prop="icon">
        <el-popover
          placement="bottom-start"
          width="450"
          trigger="click"
          @show="$refs['iconSelect'].reset()"
        >
          <icon-select ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.icon" style="width: 450px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item v-show="form.menuType.toString() !== '3'" label="外链菜单" prop="isFrame">
        <el-radio-group v-model="form.isFrame" size="mini">
          <el-radio-button label="1">是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="form.menuType.toString() !== '3'" label="是否隐藏" prop="hidden">
        <el-radio-group v-model="form.hidden" size="mini">
          <el-radio-button label="true">是</el-radio-button>
          <el-radio-button label="false">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status" size="mini">
          <el-radio-button label="0">启用</el-radio-button>
          <el-radio-button label="1">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.menuType.toString() !== '3'" label="菜单标题">
        <el-input v-model="form.name" :style="form.menuType.toString() === '1' ? 'width: 450px' : 'width:178px;'" />
      </el-form-item>
      <el-form-item v-if="form.menuType.toString() === '3'" label="按钮名称">
        <el-input v-model="form.name" style="width: 178px;" />
      </el-form-item>
      <el-form-item v-show="form.menuType.toString() !== '0'" label="权限标识" prop="permission">
        <el-input v-model="form.perms" :disabled="form.isFrame === '1'" placeholder="权限标识" style="width: 178px;" />
      </el-form-item>
      <el-form-item v-if="form.menuType.toString() !== '3'" label="路由地址" prop="path">
        <el-input v-model="form.path" placeholder="路由地址" style="width: 178px;" />
      </el-form-item>
      <el-form-item label="菜单排序" prop="menuSort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 178px;" />
      </el-form-item>
      <el-form-item v-show="!form.isFrame && form.menuType.toString() === '3'" label="组件名称" prop="component">
        <el-input v-model="form.component" style="width: 178px;" placeholder="匹配组件内Name字段" />
      </el-form-item>
      <el-form-item v-show="!form.isFrame && form.menuType.toString() === '2'" label="组件路径" prop="component">
        <el-input v-model="form.component" style="width: 178px;" placeholder="组件路径" />
      </el-form-item>
      <el-form-item label="上级类目" prop="pid">
        <tree-select
          v-model="form.parentId"
          :options="menus"
          :normalizer="normalizer"
          style="width: 450px;"
          placeholder="选择上级类目"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import IconSelect from '@/components/IconSelect'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMenuDataList, add, edit, getMenuById } from '@/api/menu'

export default {
  name: 'AddOrUpdate',
  components: {
    IconSelect,
    TreeSelect
  },
  data() {
    return {
      form: {
        id: null,
        menuType: 1,
        icon: '',
        isFrame: 0,
        hidden: false,
        name: '',
        perms: '',
        path: '',
        sort: 10,
        component: '',
        parentId: 0,
        status: 0
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      id: {},
      menus: []
    }
  },
  watch: {
    dialogFormVisible(val) {
      // if (val) {
      //   this.init(this.id)
      // }
    }
  },
  methods: {
    init(id) {
      this.dialogFormVisible = true
      // console.log(id === undefined)
      console.log(id)
      if (id !== undefined) {
        getMenuById(id).then(res => {
          if (res.code === 200) {
            this.form = res.data
          }
        }).catch(err => {
          console.log(err)
        })
      }
      this.loadMenus()
    },
    selected(name) {
      this.form.icon = name
    },
    loadMenus() {
      getMenuDataList().then(res => {
        this.menus = []
        const tree = { id: 0, name: '主目录', children: [] }
        tree.children = this.handleTree(res.data, 'id')
        this.menus.push(tree)
      })
    },
    // 转换数据结构
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    dataFormSubmit() {
      // this.dialogFormVisible = false
      console.log(this.form.id)
      if (this.form.id) {
        edit(this.form).then(res => {
          if (res.code === 200) {
            this.dialogFormVisible = false
            this.$emit('refreshDataList')
            this.$message.success(res.msg)
          }
        })
      } else {
        add(this.form).then(res => {
          if (res.code === 200) {
            this.dialogFormVisible = false
            this.$emit('refreshDataList')
            this.$message.success(res.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
