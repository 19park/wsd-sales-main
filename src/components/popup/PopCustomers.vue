<!--suppress HtmlUnknownAttribute -->
<template>
  <card title="거래처조회" class="mb-0">
    <div class="row">
      <div class="col-12">

      </div>
    </div>
    <div infinite-wrapper id="loader-container">
      <table class="table table-striped">
        <thead>
        <tr>
          <th>거래처코드</th>
          <th>거래처명</th>
          <th>규격</th>
          <th style="text-align:right">단가</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="data in tableData" :key="data.id" @click="fnProdClick(data)" class="cursor">
          <td min-width="80">{{ getValue(data, 'code') }}</td>
          <td min-width="200">{{ getValue(data, 'name') }}</td>
          <td min-width="100">{{ getValue(data, 'standard') }}</td>
          <td min-width="50" align="right">{{ numberWithCommas(getValue(data, 'customerGoodsUnitPrice.unitPrice')) }}</td>
        </tr>
        </tbody>
      </table>
      <infinite-loading force-use-infinite-wrapper="true" @infinite="infiniteHandler" ref="infiniteLoading">
        <span slot="no-more">모든 거래처를 조회했습니다.</span>
        <span slot="no-results">조회결과가 없습니다.</span>
      </infinite-loading>
    </div>
    <div class="mt-3">
      <slot name="footer" v-if="$slots.footer"></slot>
    </div>
  </card>
</template>

<script>
  import Common from '../mixin/common'
  import _get from 'lodash/get'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    name: 'PopCustomers',
    mixins: [Common],
    components: {
      InfiniteLoading
    },
    data () {
      return {
        isInit: false,
        loading: false,
        tableData: [],
        postData: {
          keyword: '',
          offset: 0,
          max: 50,
          total: 0
        }
      }
    },
    methods: {
      fnProdClick (row) {
        this.loading = true
        this.$emit('getdata', row)
      },
      fnGetData () {
        this.tableData = []
        this.postData.page = 1
        this.postData.offset = 0
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      },
      infiniteHandler ($state) {
        // if (this.loadingAdd) return
        // this.loadingAdd = true

        let loader = this.$loading.show({
          // Optional parameters
          container: this.$el,
          canCancel: false,
          // onCancel: this.onCancel,
        });


        setTimeout(function(){
          loader.hide()
          $state.complete()
        }, 1000)
        // const postData = this.postData
        // this.$.get('/api/customerGoods', { params: postData }).then((res) => {
        //   let resCnt = res.data.list.length
        //   if (resCnt < 0) {
        //     $state.complete()
        //   } else {
        //     if (this.loading) this.loading = false
        //
        //     this.tableData = this.tableData.concat(res.data.list)
        //     this.postData.offset = postData.offset + postData.max
        //     if (resCnt < 49) {
        //       $state.complete()
        //     } else {
        //       $state.loaded()
        //     }
        //   }
        //   this.loadingAdd = false
        //   if (!this.isInit) {
        //     this.isInit = true
        //     this.$refs.keyword.$el.children[0].focus()
        //   }
        // }).catch((err) => {
        //   this.getErrorMsg(err)
        //   this.loadingAdd = false
        // })
      },
      getValue (data, key) {
        return _get(data, key)
      }
    }
  }
</script>

<style scoped>
  #loader-container { height: 400px; overflow: auto; }
</style>
