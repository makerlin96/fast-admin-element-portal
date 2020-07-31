<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          v-has="'sys:role:add'"
          type="primary"
          @click="openDialog(true)"
        >添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-has="'sys:role:edit'"
          type="primary"
          :disabled="ids.length !== 1"
          @click="openDialog(false)"
        >编辑</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          v-has="'sys:role:del'"
          type="primary"
          :disabled="ids.length < 1"
          @click="deleteHandle"
        >删除</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="16"
        :xl="17"
        style="margin-bottom: 10px"
      >
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
          </div>
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            highlight-current-row
            @selection-change="selectionChangeHandle"
            @current-change="currentChangeHandle"
            @select="selectHandle"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              prop="roleId"
              label="ID"
              width="80"
              align="center"
            />
            <el-table-column prop="roleName" label="角色名称" align="center" />
            <el-table-column prop="type" label="角色类别" align="center" />
            <el-table-column prop="remark" label="备注" align="center" />
            <el-table-column
              prop="createTime"
              label="创建时间"
              align="center"
            />
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配权限" placement="top">
              <span class="role-span">权限分配</span>
            </el-tooltip>
            <el-button
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="submitHandle"
            >保存</el-button>
          </div>
          <el-tree
            ref="rolePermissionsTree"
            show-checkbox
            node-key="id"
            accordion
            :data="permissionsTreeData"
            :props="{label: 'name', children: 'children'}"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="flag ? '新增' : '修改'" :visible.sync="dialogVisible">
      <el-form ref="roleInfo" :model="roleInfo" :rules="formRules">
        <el-form-item label="角色名称" label-width="80px" prop="roleName">
          <el-input v-model="roleInfo.roleName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色类别" label-width="80px" prop="type">
          <el-input v-model="roleInfo.type" autocomplete="off" />
        </el-form-item>
        <el-form-item label="角色备注" label-width="80px" prop="remark">
          <el-input v-model="roleInfo.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHandle">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataList, getPermissions, getInfo, edit, add, del } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      tableLoading: true,
      tableData: [],
      permissionsTreeData: [],
      roleInfo: {},
      dialogVisible: false,
      formRules: {
        roleName: [{ required: true, message: '角色名称不能为空' }],
        type: [{ required: true, message: '角色类别不能为空' }],
        remark: [{ required: true, message: '角色备注不能为空' }]
      },
      flag: true,
      ids: []
    }
  },
  created() {
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData(id) {
      if (!id) {
        getDataList().then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
          }
        }).catch(err => {
          console.log(err)
        }).finally(() => {
          this.tableLoading = false
        })
        getPermissions().then(res => {
          if (res.code === 200) {
            this.permissionsTreeData = res.data
          }
        })
      } else {
        getInfo(id).then(res => {
          this.roleInfo = res.data
          const permissions = this.roleInfo.permissions
          this.$refs['rolePermissionsTree'].setCheckedKeys([])
          if (permissions) {
            setTimeout(() => {
              permissions.forEach(val => {
                this.$refs['rolePermissionsTree'].setChecked(val, true, false)
              })
            }, 200)
          } else {
            this.$refs['rolePermissionsTree'].setCheckedKeys([])
          }
        })
      }
    },
    selectionChangeHandle(selection) {
      this.ids = []
      selection.forEach(item => {
        this.ids.push(item.roleId)
      })
    },
    currentChangeHandle(row) {
      if (row) {
        this.initData(row.roleId)
      }
    },
    selectHandle(row) {
      if (row.length === 1) {
        this.initData(row[0].roleId)
      } else {
        this.$refs['rolePermissionsTree'].setCheckedKeys([])
      }
    },
    submitHandle() {
      if (this.roleInfo.roleId) {
        this.roleInfo.permissions = [
          ...this.$refs['rolePermissionsTree'].getCheckedKeys(),
          ...this.$refs['rolePermissionsTree'].getHalfCheckedKeys()
        ]
        edit(this.roleInfo).then(res => {
          if (res.code === 200) {
            if (res.data >= 1) {
              this.$message.success('更新成功！')
            } else {
              this.$message.success('未更新任何数据')
            }
          }
        })
      } else {
        if (this.dialogVisible === true) {
          this.$refs['roleInfo'].validate(valid => {
            if (valid) {
              add(this.roleInfo).then(res => {
                if (res.code === 200) {
                  this.$message.success('新增成功')
                }
              })
            }
          })
        }
      }
      this.initData()
      this.dialogVisible = false
    },
    openDialog(flag) {
      this.flag = flag
      if (flag) {
        this.roleInfo = {}
      }
      this.dialogVisible = true
    },
    deleteHandle() {
      const text = this.ids.toString()
      this.$confirm(`确认将id为${text}的记录删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(this.ids).then(res => {
          if (res.code === 200) {
            this.$message.success('删除成功！')
          }
          this.initData()
        })
      })
    }
  }
}
</script>

<style scoped></style>
