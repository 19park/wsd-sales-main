import Vue from 'vue'
import store from './store'
import cookies from './api/cookies'
import App from './App.vue'
import GlobalComponents from './globalComponents'

Vue.use(GlobalComponents)

/**
 * cookies 리스트 확인하여 vuex state 업데이트
 */
Object.keys(cookies).forEach(function(key){
  const objItem = {
    key: key,
    value: localStorage.getItem(cookies[key])
  };
  store.commit('SET_COOKIES', objItem);
});

const agentRegNo = cookies.AGENT_RNO;
if (!localStorage.getItem(agentRegNo)) {
  throw new Error("사업자 정보가 부족합니다.");
}



new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
