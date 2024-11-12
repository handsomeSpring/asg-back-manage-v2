//缓存业务搜索条件
export default {
    namespaced: true,
    state: {
        querySearchMap:{
            'bizType':null
        }
    },
    mutations: {
      setQueryCondition(state, { businessName, condition }) {
        state.querySearchMap[businessName] = condition;
      }
    },
    actions: {}
  };