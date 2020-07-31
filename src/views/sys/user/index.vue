<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button>添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button>编辑</el-button>
      </el-form-item>
      <el-form-item>
        <el-button>删除</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="listQuery">
      <el-form-item>
        <el-input v-model="listQuery.username" placeholder="请输入用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.realName" placeholder="请输入姓名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initData">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="tableLoading" :data="tableData" size="mini">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="userId" label="ID" width="80" sortable align="center" />
      <el-table-column prop="username" label="用户名" sortable align="center" />
      <el-table-column prop="realName" label="姓名" sortable align="center" />
      <el-table-column prop="mobile" label="联系电话" align="center" />
      <el-table-column prop="lastLoginTime" label="最后登录时间" align="center">
        <template slot-scope="scope" align="center">
          {{ formatDateTime(scope.row.lastLoginTime) }}
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :page.sync="listQuery.page" :limit.sync="listQuery.limit" :total="total" @pagination="initData" />
  </div>
</template>

<script>
import { getDataList } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        username: '',
        realName: '',
        startDate: '',
        endDate: '',
        page: 1,
        limit: 10
      },
      tableData: [],
      tableLoading: true,
      total: 0
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      getDataList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
