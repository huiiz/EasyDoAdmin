<template>
  <div class="dashboard-container">
    <div class="dashboard-text">用户名: {{ username }}</div>
    <div class="dashboard-text">身份: <span v-for="role in roles" :key="role">{{ role }}</span></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: '管理面板',
  computed: {
    ...mapGetters([
      'username',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
