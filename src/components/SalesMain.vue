<template>
  <div id="wrapper">
    <div id="page-wrapper">
      <div class="panel panel-default">
        <div class="panel-body" id="entry_panel">
          <form id="form1" name="form1" method="post" onSubmit="return false;">
            <div class="table" style="margin-bottom:0px;">
              <table class="table table-bordered slim" style="margin-bottom:0;">
                <tbody>
                  <tr class="title">
                    <th width="8%" class="b1">
                      <strong style="font-size:1.5em;">매출등록</strong>
                    </th>
                    <td width="54%">
                      <div class="d-inline-block">
                        <datetime v-model="model.salesDay"
                                  format="yyyy-MM-dd"
                                  input-id="startDate"
                                  input-class="form-control d-inline-block input-100">
                          <label for="startDate" slot="before">매출일자: </label>
                        </datetime>
                      </div>

                      <div class="d-inline-block ml-1">
                        <CustomerPicker :hot="hot"/>
                      </div>
                      <div class="d-inline-block ml-1">
                        <label>담당자 : </label>
                        <select name="MEMBER_CODE" class="form-control d-inline-block" id="sel_member" style="width:100px;">
                        </select>
                      </div>
                      <div class="d-inline-block ml-1">
                        <label>창고 : </label>
                        <select name="HOUSE_CODE" class="form-control d-inline-block" style="width:100px;">
                          <option value="">창고없음</option>
                        </select>
                      </div>
                      <button type="button" class="btn btn-success" @click="fnHistoryItem();fn_trk('B001');">납품분
                      </button>
                    </td>
                    <th width="4%" class="b1">현잔고</th>
                    <td width="8%" align="right">
                      <span class="bc_view">0</span>
                    </td>
                    <th width="6%" class="b1">거래후잔고</th>
                    <td width="8%" align="right">
                      <span class="bc_view_after">0</span>
                    </td>
                    <th width="4%" class="b1">여신</th>
                    <td width="8%" align="right">
                      <span class="bc_credit">0</span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="hot-wrap">
                <div id="hot-table" styles="height: 300px;"></div>
              </div>


            </div>
          </form>
        </div>
      </div>
    </div>




  </div>
</template>

<script>
  import Vue from 'vue'
  import Datetime from 'vue-datetime'
  import 'vue-datetime/dist/vue-datetime.css'
  import Common from './mixin/common'

  import { Settings } from 'luxon'
  Settings.defaultLocale = 'ko'

  import Handsontable from 'handsontable-pro'
  import CustomerPicker from "./inputs/CustomerPicker.vue"

  Vue.use(Datetime)

  export default {
    name: "SalesMain",
    components: {CustomerPicker},
    mixins: [Common],
    data() {
      return {
        hot: null,
        selectedRowIndex: null,
        model: {
          salesDay: this.getFullCurrentDate(),
          salesMainItemList: []
        },
        hotOptions: {
          salesMainSchema: {
            id: undefined,
            div: {
              sales: '매출',
              event: undefined
            },
            product: {
              id: undefined,
              code: undefined,
              name: undefined,
              standard: undefined,
              div: undefined,
              tax_div: undefined,
              order: undefined,
              amount: {
                sales: undefined,
                inbox: undefined,
                stock: undefined
              }
            },
            amount: {
              box: undefined,
              item: undefined,
              total: undefined,
              service: undefined
            },
            ppu: {
              receive: undefined,
              sales: undefined,
              before: undefined,
              mm: undefined
            },
            price: {
              receive: undefined,
              sales: undefined,
              dc: undefined,
              tax: undefined,
              supply: undefined,
              total: undefined,
              profit: undefined
            },
            percent: {
              dc: undefined,
              profit: undefined
            },
            memo: undefined,
            isOld: false
          },
          colWidths: [
            90, 180, 120, 70, 70, 80, 90, 100, 70, 100, 90, 100, 70, 100, 50, 90, 130, 50
          ],
          // TODO 수량 계란에 따라 판/알로도 처리
          colHeaders: [
            '상품추가', '품명(단가이력조회)', '[입수수량]규격', 'BOX수량', 'EA수량', '합계수량',
            '단가', '금액', 'DC', '공급가', '부가세', '판매금액', '서비스', '비고', '행사', '거래구분▼', '이익', '삭제'
          ],
          columns: [
            // {data: 'brokerOrderItem.order', type: 'checkbox', className: 'htCenter htMiddle'},
            {data: 'product.code', type: 'text', readOnly: true},
            {data: 'product.name', type: 'text', readOnly: true},
            {data: 'product.standard', type: 'text', readOnly: true},
            {data: 'amount.box', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'amount.item', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'amount.total', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'ppu.before', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'price.sales', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'price.dc', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'price.tax', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'price.supply', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'price.total', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'amount.service', type: 'numeric', numericFormat: {pattern: '0,0[00]'}, readOnly: true},
            {data: 'memo', type: 'text', readOnly: true},
            {data: 'div.event', type: 'checkbox', className: 'htCenter htMiddle'},
            // TODO 불량반품은 설정에 따라
            {data: 'div.sales', type: 'dropdown', source: ["매출","정상반품","불량반품"]},
            {data: '이익', type: 'text'},
            {data: '삭제', type: 'text'},
          ]
        }
      }
    },
    mounted() {
      this.fnCreateTable()
    },
    methods: {
      removeElement(id) {
        const elem = document.getElementById(id)
        return elem.parentNode.removeChild(elem)
      },
      fnCreateTable () {
        let HotTable = document.getElementById('hot-table')
        this.hot = new Handsontable(HotTable, {
          data: this.model.salesMainItemList,
          dataSchema: this.hotOptions.salesMainSchema,
          selectionMode: 'single',
          autoWrapRow: true,
          // fixedColumnsLeft: 3,
          // stretchH: 'all',
          startRows: 1,
          minSpareRows: 1,
          rowHeaders: true,
          colHeaders: this.hotOptions.colHeaders,
          colWidths: this.hotOptions.colWidths,
          columns: this.hotOptions.columns,
          hiddenColumns: {
            //columns: [6,7],
            indicators: true
          },
          contextMenu: {
            items: {
              "row_above": {name: '위에 줄 추가'},
              "row_below": {name: '아래에 줄 추가'}
            }//['row_above', 'row_below']
          },
          manualColumnResize: true,
          enterBeginsEditing: false,
          enterMoves: () => {
            const MAX_COL = this.hot.getCellMeta(0, 0).columns.length - 1
            if (this.hot.getSelected() >= MAX_COL) {
              return {row: 1, col: -MAX_COL}
            } else {
              return {row: 0, col: 1}
            }
          },
          afterSelectionEnd: (row, col) => {
            const SUPPLIER_NAME_COL = this.hot.propToCol('goods.supplier.name')
            const IS_ORDERED = this.hot.getDataAtRowProp(row, 'brokerOrderItem.exist')

            if (col === SUPPLIER_NAME_COL && !IS_ORDERED) {
              this.customerGoods = this.hot.getDataAtRowProp(row, 'customerGoods')
              if (!_get(this.customerGoods, 'id', undefined)) {
                return
              }
              this.selectedRowIndex = row // 팝업전 클릭한 위치 보관
              this.hot.deselectCell()
              // this.$modal.show('pop-goods')
            }
          },
          afterChange: (changes, source) => {
            if (!changes) return
            if (source === 'excel') return
            if (changes[0][2] === changes[0][3]) return

            /** CELL TYPE 숫자형인지 체크하여
             * 숫자형식에 맞지 않으면 0으로 셋팅
             * 0보다 작을때 RED COLOR 적용 */
            // this.checkAndSetNumeric(hot, changes)
            // this.setMinimumQty(changes[0][0])
            this.$nextTick(() => this.hot.render())
          },
          // afterScrollVertically: () => hot.render()
        })

        // TODO 라이센스 문구 제거
        this.removeElement('hot-display-license-info')
      }



    }
  }
</script>

<style scoped>
  .btn { vertical-align: top; }
  .b1 { background: #EEE; font-weight: bold; text-align:center; }

  .slim>tbody>tr>th,.slim>tbody>tr>td { padding:1px 6px; }
  .table td, .table th { vertical-align: middle; }
  .bc_view, .bc_view_after, .bc_credit { font-size: 1.4em; color: red; }

  #wrapper { width:100%; }
  #wrapper #page-wrapper { height: 100%; width:100%; margin: 0px; padding: 0; position: absolute; min-width:1400px; }

  #wrapper #entry_panel { padding:5px; }
</style>
