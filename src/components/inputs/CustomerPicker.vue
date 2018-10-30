<template>
  <div class="box">
    <label>거래처 : </label>
    <input type="text" name="CUSTOMER_NAME" class="form-control d-inline-block input-80" value=""
           @keyup.enter="fnChkSearch" @click="fnChkSearch"
           readonly="true">
    <button type="button" class="btn btn-success ml5" @click="fnChkSearch">거래처</button>

    <modal name="pop-customers"
           width="800"
           height="auto"
           :scrollable="true"
           :clickToClose="false">
      <PopCustomers @getdata="cbAddCustomers">
        <div slot="footer" class="text-right">
          <button class="btn btn-primary"
                  @click="$modal.hide('pop-customers')">닫기</button>
        </div>
      </PopCustomers>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VModal from 'vue-js-modal'
  // 거래처 검색 팝업
  import PopCustomers from '../popup/PopCustomers.vue'

  // 뷰모달 컴포넌트 동적 사용 설정
  Vue.use(VModal, {dynamic: true})

  export default {
    name: "CustomerPicker",
    components: {
      PopCustomers
    },
    props:['hot'],
    data() {
      return {

      }
    },
    methods: {
      fnChkSearch () {
        this.$modal.show('pop-customers')
      },
      /**
       * 거래처 팝업에서 선택된 정보를 hansOnTable 에 row 추가
       */
      cbAddCustomers: function (data) {
        // 빈줄을 제거
        if (hot.getSettings().minSpareRows > 0 && hot.countRows() > 0) {
          hot.getSourceData().pop()
        }
        hot.getSourceData().push(customerOrderItem)
        hot.loadData(hot.getSourceData())
        // hot.render()

        // 거래처물품 팝업 숨김
        this.$modal.hide('pop-customers')

        this.$nextTick(() => {
          // 셀 스타일 적용
          this.checkRow()
          // 수량입력 cell 로 이동
          hot.selectCell(this.fnGetHandsOnTableActualRowCount() - 1, hot.propToCol('amount'))
          // console.log(hot.getSourceData())
          // console.log(this.model.customerOrderItemList)
        })
      }

    }
  }
</script>

<style scoped>

</style>
