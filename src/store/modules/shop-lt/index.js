//商品模块下的入口文件
//引入四个模块
import state from './state'
import mutations from './mutations'
import actions from './actions'

export default {
    namespaced: true,//添加局部模块化
    state,
    mutations,
    actions,
}