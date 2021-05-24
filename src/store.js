import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list: [],
    // 文本框的内容
    inputValue: '',
    // 下一个Id
    nextId: 5,
    viewKey: 'all',
    visible: false,
    editValue: '',
    nowId: '',
    findVal: ''
  },
  mutations: {
    findToList(state) {
      // state.list = state.list.filter(item => item.info.indexOf(state.findVal) !== -1)

      let newArr = []
      let oldList = JSON.parse(JSON.stringify(state.list))
      oldList.forEach(item => {
        if (item.info && item.info.indexOf(state.findVal) !== -1) newArr.push(item)
      })
      if (newArr.length) {
        state.list = newArr
      } else {
        alert("没有找到相关数据")
      }
    },
    setFindVal(state, val) {
      state.findVal = val
    },
    editItemById(state, id) {
      state.nowId = id
      const i = state.list.findIndex(x => x.id === id)
      if (i !== -1) state.editValue = state.list[i].info
      state.visible = true
    },
    handleCancel(state) {
      state.visible = false
    },
    handleOk(state) {
      const i = state.list.findIndex(x => x.id === state.nowId)
      if (i !== -1) state.list[i].info = state.editValue
      state.visible = false
    },
    initList(state, list) {
      state.list = list
    },
    // 为 store 中的 inputValue 赋值
    setInputValue(state, val) {
      state.inputValue = val
    },
    setTareaVal(state, val) {
      state.editValue = val
    },
    // 添加列表项
    addItem(state) {
      const obj = {
        id: state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      state.list.push(obj)
      state.nextId++
      state.inputValue = ''
    },
    // 根据Id删除对应的任务事项
    removeItem(state, id) {
      const i = state.list.findIndex(x => x.id === id)
      // 根据索引，删除对应的元素
      if (i !== -1) state.list.splice(i, 1)
    },
    // 修改列表项的选中状态
    changeStatus(state, param) {
      const i = state.list.findIndex(x => x.id === param.id)
      if (i !== -1) state.list[i].done = param.status
    },
    // 清除已完成的任务
    cleanDone(state) {
      state.list = state.list.filter(x => x.done === false)
    },
    // 修改视图的关键字
    changeViewKey(state, key) {
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      axios.get('/list.json').then(({ data }) => {
        context.commit('initList', data)
      })
    }
  },
  getters: {
    // 统计未完成的任务的条数
    unDoneLength(state) {
      return state.list.filter(x => x.done === false).length
    },
    infolist(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x => !x.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x => x.done)
      }
      return state.list
    }
  }
})
