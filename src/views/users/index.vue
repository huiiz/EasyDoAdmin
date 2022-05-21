<template>

  <div class="app-container">
    <el-dialog title="生成邀请码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <template>
        <el-radio v-model="to_be_type" label="2">用户管理员</el-radio>
        <el-radio v-model="to_be_type" label="3">文章管理员</el-radio>
      </template>
      <div class="invite">
        <h2 style="display:inline-block">邀请码为：</h2>

        <h3 style="display:inline-block"><i>{{ invite_code }}</i></h3>
      </div>
      <el-button type="primary" @click="createInvite">生成邀请码</el-button>

      <!-- <span slot="footer" class="dialog-footer"> </span> -->
    </el-dialog>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="id" width="80px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="用户名">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>

      <el-table-column width="150px" align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>

      <el-table-column width="200px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{ scope.row.create_datetime }}</span>
        </template>
      </el-table-column>


      <el-table-column class-name="status-col" align="center" label="状态" width="160px">
        <template slot-scope="{row}">
          <el-tag :type="row.manager_type | statusFilter">
            {{ {
                '-3': '申请成为文章管理员',
                '-2': '申请成为用户管理员',
                '0': '普通用户',
                '1': 'BOSS',
                '2': '用户管理员',
                '3': '文章管理员',
              }[row.manager_type + ""]
            }}
          </el-tag>
        </template>
      </el-table-column>



      <el-table-column align="center" label="编辑" width="350px" v-if="role == 'BOSS'">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit"
            @click="dialogVisible = true; invite_uid = scope.row.id"> 生成邀请码 </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" :disabled="scope.row.manager_type >= 0" @click="allow(scope.row.id, scope.row.username)"> 同意 </el-button>
          <el-button type="primary" size="small" icon="el-icon-edit" :disabled="scope.row.manager_type == 0 || scope.row.manager_type == 1" @click="refuse(scope.row.id, scope.row.username)"> {{scope.row.manager_type > 0 ? '撤销权限' : '拒绝'}} </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
      @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, invite, changeType } from '@/api/user'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import store from '@/store'
export default {
  name: 'UserList',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '-3': 'danger',
        '-2': 'danger',
        '0': 'info',
        '1': 'primary',
        '2': 'warning',
        '3': 'success',
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      role: '',
      dialogVisible: false,
      invite_uid: 0,
      to_be_type: '3',
      invite_code: '',
    }
  },
  created() {
    this.getList()
    this.role = store.getters.roles[0]
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.invite_code = '';
      this.to_be_type = '3';
    },
    createInvite() {
      invite({
        uid: this.invite_uid,
        type: this.to_be_type
      }).then(response => {
        this.invite_code = response.data.invite
      })
    },
    allow(uid, username)  {
      changeType({
        allow: '1',
        username
      }, uid).then(response => {
        this.$message('已成为管理员');
      this.getList()

      })
    },
    refuse(uid, username)  {
      changeType({
        allow: '0',
        username
      }, uid).then(response => {
        this.$message('已恢复为普通用户');
        this.getList()

      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
