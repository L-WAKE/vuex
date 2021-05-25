<template>
  <div id="app">
    <div class="frist">
      <a-input
        placeholder="请输入任务"
        class="my_ipt"
        :value="inputValue"
        @change="e=>{setInputValue(e.target.value)}"
      />
      <a-button type="primary" @click="addItemToList">添加任务</a-button>
      <a-input
        placeholder="请输入关键字"
        class="my_ipt ml"
        :value="findVal"
        @change="e=>{setFindVal(e.target.value)}"
      />
      <a-button type="danger" @click="findToList">查询</a-button>
    </div>
    <a-list bordered :dataSource="infolist" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <a-checkbox :checked="item.done" @change="e => {cbStatusChanged(e, item.id)}">{{item.info}}</a-checkbox>
        <!-- 编辑、删除链接 -->
        <a slot="actions" @click="editItemById(item.id)">编辑</a>
        <a slot="actions" @click="removeItem(item.id)">删除</a>
      </a-list-item>
      <!-- <a-empty /> -->
      <!-- 编辑弹窗 start -->
      <a-modal
        v-model="visible"
        title="编辑"
        ok-text="确认"
        cancel-text="取消"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <a-textarea :value="editValue" @change="e=>{setTareaVal(e.target.value)}" :rows="4" />
      </a-modal>
      <!-- 编辑弹窗 end -->

      <!-- footer区域 -->
      <div slot="footer" class="footer">
        <!-- 未完成的任务个数 -->
        <span>{{unDoneLength}}条剩余</span>
        <!-- 操作按钮 -->
        <a-button-group>
          <a-button
            :type="viewKey === 'all' ? 'primary' : 'default'"
            @click="changeViewKey('all')"
          >全部</a-button>
          <a-button
            :type="viewKey === 'undone' ? 'primary' : 'default'"
            @click="changeViewKey('undone')"
          >未完成</a-button>
          <a-button
            :type="viewKey === 'done' ? 'primary' : 'default'"
            @click="changeViewKey('done')"
          >已完成</a-button>
        </a-button-group>
        <a @click="cleanDone">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: 'app',
  data() {
    return {}
  },
  created() {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['inputValue', 'viewKey', 'visible', 'editValue', 'findVal']),
    ...mapGetters(['unDoneLength', 'infolist'])
  },
  methods: {
    ...mapMutations([
      'handleOk',
      'handleCancel',
      'findToList',
      'removeItem',
      'editItemById',
      'cleanDone',
      'changeViewKey',
      'setInputValue',
      'setTareaVal',
      'setFindVal'
    ]),
    // 向列表中新增 item 项
    addItemToList() {
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('文本框内容不能为空！')
      }
      this.$store.commit('addItem')
    },
    // 监听复选框选中状态变化的事件
    cbStatusChanged(e, id) {
      const param = {
        id: id,
        status: e.target.checked
      }
      this.$store.commit('changeStatus', param)
    }
  }
}
</script>

<style scoped>
#app {
  padding: 10px;
}
::v-deep .ant-checkbox-wrapper {
  max-width: 800px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.frist {
  display: flex;
  align-content: center;
  justify-content: center;
}
.ml {
  margin-left: 50px;
}
.my_ipt {
  width: 390px;
  margin-right: 10px;
}
.dt_list {
  max-width: 1000px;
  margin: 10px auto;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
