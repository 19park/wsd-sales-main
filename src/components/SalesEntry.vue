<template>
    <div class="panel-body">
        <div class="box">
            <table class="table table-bordered slim mb-0">
                <tbody>
                <tr class="title">
                    <!--<th width="7%" class="b1">-->
                    <!--<strong style="font-size:1.6em;letter-spacing: -0.025rem;">매출등록</strong>-->
                    <!--</th>-->
                    <td width="62%">
                    <DatePicker id="salesDay"
                                label="매출일자 :"
                                :model="model"
                                :disableType="getDisableType"
                                wrap-classes="d-inline-block"/>

                    <CustomerPicker :model="model.customer"
                                    wrap-classes="d-inline-block ml-2"/>
                    <EmployeePicker :model="model.member"
                                    ref="select-member"
                                    :disabled="true"
                                    wrap-classes="d-inline-block ml-2"/>
                    <WarehousePicker :model="model.warehouse"
                                     ref="select-warehouse"
                                     wrap-classes="d-inline-block ml-2"
                                     @nextAct="doGoodsSearch"/>

                    <!-- TODO 트레킹? //-->
                    <button type="button" class="btn btn-success" @click="doGoodsSearch(true)">납품분
                    </button>
                </td>
                    <th width="4%" class="b1">현잔고</th>
                    <td width="8%" align="right">
                        <span class="bc_view">{{getCustomerBc}}</span>
                    </td>
                    <th width="6%" class="b1">거래후잔고</th>
                    <td width="8%" align="right">
                        <span class="bc_view_after">{{getCustomerAfterBc}}</span>
                    </td>
                    <th width="4%" class="b1">여신</th>
                    <td width="8%" align="right">
                        <span class="bc_credit">{{getCustomerCreditBc}}</span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div id="hot-wrap">
            <div id="hot-table"></div>
            <div id="handle"></div>
        </div>

        <div class="box">
            <table class="table table-bordered slim">
                <tbody>
                <tr>
                    <th width="10%" class="b1">수금구분</th>
                    <td width="40%">
                        <CollectDivPicker :model="model.collect"/>
                    </td>
                    <th width="10%" class="b1">금액</th>
                    <td width="40%">
                        <CollectPricePicker :model="model.collect.price"/>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="table table-bordered slim">
                <tbody>
                <tr>
                    <th width="10%" class="b1">매출메모</th>
                    <td width="40%">
                        <input type="text" name="SALES_COMMENT" class="form-control input-l">
                    </td>
                    <td width="50%">
                        <span id="ent-area" class="cf">
                            <button @click="doSubmit()" class="btn btn-primary">
                                <font-awesome-icon icon="save"/>&nbsp;저장하기(F8)
                            </button>
                            <button @click="doSubmit('P')"
                                    class="btn btn-print">저장 후 명세서 인쇄
                            </button>

                            <button @click="$router.go(0)" class="btn btn-add">
                                <font-awesome-icon icon="plus-circle"/>&nbsp;새로등록
                            </button>
                        </span>
                        <span id="mod-area" class="cf">
                            <!-- TODO 초기화 또는 리로딩으로 신규처리 추가 //-->
                            <button class="btn btn-add">
                                <font-awesome-icon icon="plus-circle"/>&nbsp;신규등록
                            </button>
                            <button id="btn_del"
                                    class="btn btn-danger">
                                <font-awesome-icon icon="trash-alt"/>&nbsp;삭제하기
                            </button>
                            <button id="btn_upt"
                                    class="btn btn-primary">
                                <font-awesome-icon icon="edit"/>&nbsp;수정저장
                            </button>
                            <button id="btn_prt"
                                    class="btn btn-print">거래명세표 인쇄
                            </button>

                            <button id="btn_info" class="float-right">
                                <font-awesome-icon icon="info-circle"/>
                            </button>
                        </span>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <!-- 일반 상품추가 팝업 //-->
        <b-modal id="pop-goods-multi-picker"
                 :lazy="true"
                 size="lg"
                 body-class="p-0"
                 hide-footer
                 hide-header>
            <PopGoodsMultiPicker :salesDay="model.salesDay"
                                 :customerCode="model.customer.CUSTOMER_CODE"
                                 :memberCode="model.member.code"
                                 :warehouseCode="model.warehouse.code"
                                 :isDup="isGoodsPopDup"
                                 @get-data="cbAddGoods">
                <template slot="footer" class="text-right">
                    <button class="btn btn-primary"
                            @click="$root.$emit('bv::hide::modal','pop-goods-multi-picker')">닫기
                    </button>
                </template>
            </PopGoodsMultiPicker>
        </b-modal>

    </div>
</template>

<script>
    import alert from './mixin/alert'
    import Common from './mixin/common'

    import Handsontable from 'handsontable-pro'
    import numeral from 'numeral'
    import _get from 'lodash/get'
    import _merge from 'lodash/merge'
    import _cloneDeep from 'lodash/cloneDeep'

    // 조건조회 관련
    import CustomerPicker from "./inputs/CustomerPicker.vue"
    import EmployeePicker from "./inputs/EmployeePicker.vue"
    import WarehousePicker from "./inputs/WarehousePicker.vue"

    // 수금관련 컴포넌트
    import CollectDivPicker from "./inputs/CollectDivPicker.vue"
    import CollectPricePicker from "./inputs/CollectPricePicker.vue"

    // 상품 검색 팝업
    import PopGoodsMultiPicker from './popup/PopGoodsMultiPicker.vue'
    import DatePicker from './inputs/DatePicker.vue'

    export default {
        name: "SalesEntry",
        components: {
            WarehousePicker,
            EmployeePicker,
            CustomerPicker,

            CollectDivPicker,
            CollectPricePicker,

            PopGoodsMultiPicker,
            DatePicker
        },
        mixins: [Common, alert],
        watch: {
            // 거래처 선택했을 때 담당사원 코드 바인딩
            'model.customer': {
                handler (val, oldVal) {
                    // handsontable 공급가, 세액 뷰처리
                    if (this.hot) {
                        const defHiddenCols = this.arrHiddenCols
                        if (val.STAX === '1') { // 부가세 포함거래처
                            defHiddenCols.push(9, 10)
                        }
                        this.hot.updateSettings({
                            hiddenColumns: {
                                columns: defHiddenCols
                            }
                        })

                        this.$nextTick(() => {
                            this.model.member.code = val.MEMBER_CODE
                            this.$refs['select-warehouse'].$el.children[1].focus()
                        })
                    } else {
                        this.showAlertToExit(
                            '오류',
                            'table 플러그인을 제대로 불러오지 못했습니다.<br/>페이지를 새로고침합니다.',
                            () => {
                                top.location.reload()
                            })
                    }

                    // 계좌 키 바인딩
                    this.model.collect.bank.REG_NO = val.BANK_INFO
                },
                deep: true
            }
        },
        computed: {
            getStoreState () {
                return this.$store.state
            },
            getDisableType () {
                return this.disableType
            },
            getAmtNumericPattern () {
                return (this.getStoreState.USE_POINT_AMT_DIV === 'Y') ? '0,0[00]' : '0,0'
            },
            getPpuNumericPattern () {
                return (this.getStoreState.USE_POINT_DIV === 'Y') ? '0,0[00]' : '0,0'
            },
            getCustomerBc () {
                return numeral(this.model.customer.CUSTOMER_BC.NOW_BC).format()
            },
            getCustomerAfterBc () {
                return numeral(this.model.customer.CUSTOMER_BC.NOW_BC + this.model.salesTotalPrice).format()
            },
            getCustomerCreditBc () {
                return numeral(this.model.customer.CREDIT_BC).format()
            }
        },
        data () {
            return {
                hot: null,
                // resize variables
                resizeHandle: null,
                entryContainer: null,
                // last selected index
                selectedRowIndex: null,
                // hiddenCols setting
                arrHiddenCols: [],
                // 상품,납품분 조회구분
                isGoodsPopDup: false,
                // 매출일자 일자 렌더링구분
                disableType: '',
                model: {
                    salesDay: this.getFullCurrentDate(),
                    customer: {
                        REG_NO: null,
                        VIEW_CODE: null,
                        CUSTOMER_CODE: null,
                        CUSTOMER_NAME: null,
                        MEMBER_CODE: null,
                        BANK_INFO: null,
                        BILL_PERCENT: 100,
                        BILL_TRANSFER: "N",
                        COLLECT_DAY: 0,
                        CREDIT_BC: 0,
                        CUSTOMER_BC: 0,
                        DC_PERCENT: 0,
                        STAX: null
                    },
                    member: {
                        code: null
                    },
                    warehouse: {
                        code: null
                    },
                    collect: {
                        div: '1', // init 현금
                        bank: {
                            REG_NO: null
                        },
                        card: {
                            REG_NO: null
                        },
                        memo: null,
                        price: {
                            value: 0,
                            dc: 0,
                            total: 0
                        }
                    },
                    salesTotalPrice: 0, // 작성중인 화면의 누적 합계금액
                    salesMainItemList: []
                },
                hotOptions: {
                    salesMainSchema: {
                        // ID: undefined,
                        IS_SUMMARY: false,
                        IS_EMPTY: false,
                        HISTORY: null,
                        SALES_DIV: null,
                        EVENT_DIV: false,
                        PRODUCT: {
                            REG_NO: null,
                            VIEW_CODE: null,
                            PRODUCT_NAME: null,
                            STANDARD: null,
                        },

                        BOX_AMOUNT: null,
                        ITEM_AMOUNT: null,
                        TOTAL_AMOUNT: null,
                        SERVICE_AMOUNT: null,

                        PURCHASE_PPU: null,
                        SALES_PPU: null,
                        BEFORE_PPU: null,
                        MM_PPU: null,

                        PURCHASE_PRICE: null,
                        SALES_PRICE: null,
                        DC_PRICE: null,
                        TAX_PRICE: null,
                        SUPPLY_PRICE: null,
                        TOTAL_PRICE: null,
                        PROFIT_PRICE: null,

                        DC_PERCENT: null,
                        PROFIT_PERCENT: null,

                        MEMO: null
                    },
                    colWidths: [
                        85, 170, 120, 70, 70, 70, 80, 90, 70, 90, 90, 90, 60, 100, 40, 80, 80, 50
                    ],
                    // TODO 수량 계란에 따라 판/알 처리
                    colHeaders: [
                        '상품추가', '품명(단가이력조회)', '[입수수량]규격', 'BOX수량', 'EA수량', '합계수량',
                        '단가', '금액', 'DC', '공급가', '부가세', '판매금액', '서비스', '비고', '행사', '거래구분▼', '이익', '삭제'
                    ],
                    columns: [
                        // bind mounted
                    ],
                    salesDivOption: ['매출', '정상반품']
                },
                node: {
                    table: null
                }
            }
        },
        mounted () {
            const getState = this.getStoreState
            switch (getState.AMT_DIV) {
                case '0': // 박스
                    this.arrHiddenCols.push(4, 5)
                    break
                case '1': // 낱개
                    this.arrHiddenCols.push(3)
                    break
                case '2': // 모두
                    break
            }

            if (getState.DC_DIV === '1') {
                this.arrHiddenCols.push(8)
            }

            if (getState.SER_DIV === '1') {
                this.arrHiddenCols.push(12)
            }

            if (getState.CMT_DIV === '1') {
                this.arrHiddenCols.push(13)
            }

            // 불량반품 사용 시 매출구분 옵션 불량반품 추가
            if (getState.RETURN_DIV === '0') {
                this.hotOptions.salesDivOption.push('불량반품')
            }

            /**
             * 매출일자 설정에 따른 날짜 정의
             * 전일&후일수정 권한체크하여 정의
             */
            if (getState.AUTH3_3 === 'N' && getState.AUTH3_4 === 'N') {
                this.disableType = 'noBoth'
            } else {
                if (getState.AUTH3_3 === 'N') {
                    this.disableType = 'noBefore'
                } else if (getState.AUTH3_4 === 'N') {
                    this.disableType = 'noAfter'
                }
            }

            this.hotOptions.columns = [
                {data: 'PRODUCT.VIEW_CODE', type: 'text', readOnly: true},
                {data: 'PRODUCT.PRODUCT_NAME', type: 'text', readOnly: true},
                {
                    data: 'PRODUCT.STANDARD', type: 'text', readOnly: true,
                    renderer: function (hot, td, row, column, prop, value, cellProperties) {
                        Handsontable.renderers.BaseRenderer.apply(this, arguments)

                        if (!hot.getDataAtRowProp(row, 'IS_EMPTY') && hot.countRows() > 1) {
                            const retValue = `[${hot.getDataAtRowProp(row, 'PRODUCT.BOX_GET_AMOUNT')}]${value}`
                            td.innerHTML = retValue
                        } else {
                            td.innerHTML = ''
                        }
                        return td
                    }
                },
                {data: 'BOX_AMOUNT', type: 'numeric', numericFormat: {pattern: this.getAmtNumericPattern}},
                {data: 'ITEM_AMOUNT', type: 'numeric', numericFormat: {pattern: this.getAmtNumericPattern}},
                {
                    data: 'TOTAL_AMOUNT',
                    type: 'numeric',
                    numericFormat: {pattern: this.getAmtNumericPattern},
                    readOnly: true
                },
                {data: 'SALES_PPU', type: 'numeric', numericFormat: {pattern: this.getPpuNumericPattern}},
                {
                    data: 'SALES_PRICE',
                    type: 'numeric',
                    numericFormat: {pattern: this.getPpuNumericPattern},
                    readOnly: true
                },
                {data: 'DC_PRICE', type: 'numeric', numericFormat: {pattern: this.getPpuNumericPattern}},
                {
                    data: 'SUPPLY_PRICE',
                    type: 'numeric',
                    numericFormat: {pattern: this.getPpuNumericPattern},
                    readOnly: true
                },
                {
                    data: 'TAX_PRICE',
                    type: 'numeric',
                    numericFormat: {pattern: this.getPpuNumericPattern},
                    readOnly: true
                },
                {data: 'TOTAL_PRICE', type: 'numeric', numericFormat: {pattern: this.getPpuNumericPattern}},
                {data: 'SERVICE_AMOUNT', type: 'numeric', numericFormat: {pattern: this.getAmtNumericPattern}},
                {data: 'MEMO', type: 'text'},
                {data: 'EVENT_DIV', type: 'checkbox', className: 'htCenter htMiddle'},
                // TODO 불량반품은 설정에 따라
                {data: 'SALES_DIV', type: 'dropdown', source: this.hotOptions.salesDivOption},
                {type: 'text'},
                {type: 'text'},
            ]

            this.fnCreateTable()
        },
        methods: {
            /**
             *  hot 영역 resize 이벤트 추가
             */
            addResizeSetting () {
                this.resizeHandle = document.getElementById('handle')
                this.entryContainer = document.getElementById('hot-wrap')
                this.resizeHandle.addEventListener('mousedown', this.initialiseResize, false)
            },
            initialiseResize () {
                window.addEventListener('mousemove', this.startResizing, false)
                window.addEventListener('mouseup', this.stopResizing, false)
            },
            startResizing (e) {
                // do event
            },
            stopResizing () {
                window.dispatchEvent(new Event('resize'))
                window.removeEventListener('mousemove', this.startResizing, false)
                window.removeEventListener('mouseup', this.stopResizing, false)
            },
            startResizing (e) {
                //box.style.width = (e.clientX - box.offsetLeft) + 'px'
                this.entryContainer.style.height = (e.clientY - this.entryContainer.offsetTop) + 'px'
                this.hot.render()
            },

            /**
             * hot 인스턴스 생성
             */
            fnCreateTable () {
                const self = this
                let HotTable = document.getElementById('hot-table')
                self.node.table = HotTable

                let initData = []
                const emptyData = _cloneDeep(this.hotOptions.salesMainSchema)
                const summaryData = _cloneDeep(this.hotOptions.salesMainSchema)
                emptyData.IS_EMPTY = true
                summaryData.IS_SUMMARY = true

                initData.push(emptyData)
                initData.push(summaryData)

                this.hot = new Handsontable(HotTable, {
                    data: initData,
                    dataSchema: this.hotOptions.salesMainSchema,
                    selectionMode: 'single',
                    autoWrapRow: true,
                    // fixedColumnsLeft: 2,
                    stretchH: 'all',
                    rowHeaders: true,
                    colHeaders: this.hotOptions.colHeaders,
                    colWidths: this.hotOptions.colWidths,
                    columns: this.hotOptions.columns,
                    manualColumnResize: true,
                    enterBeginsEditing: false,
                    outsideClickDeselects: false,
                    fixedRowsBottom: 1,
                    hiddenColumns: {
                        columns: [],
                        indicators: false
                    },
                    contextMenu: {
                        items: {
                            "row_above": {name: '위에 줄 추가'},
                            "row_below": {name: '아래에 줄 추가'}
                        }//['row_above', 'row_below']
                    },
                    afterRender: () => {
                        this.doFixRowRenderer()
                    },
                    afterScrollVertically: () => {
                        // TODO 스크롤 시 X버튼이 렌더링안돼서 디바운싱렌더처리
                        this.debounce(this.hot.render())
                    },
                    afterOnCellMouseOver: function (e, coords) {
                        if (_get(self.model, 'salesMainItemList').length >= 3 && coords.col === 16) {
                            const r = coords.row
                            const getState = self.getStoreState

                            const GET_ROW_CHECK = this.getDataAtRowProp(r, 'SALES_DIV')
                            if (!GET_ROW_CHECK) return
                            const GET_LAYER = document.querySelector('.profitLayer')
                            if (GET_LAYER) return

                            let MAKE_TOOLTIP = ''
                            const GET_PROFIT_PRICE = parseFloat(this.getDataAtRowProp(r, 'PROFIT_PRICE'))
                            const GET_TOTAL_PRICE = parseFloat(this.getDataAtRowProp(r, 'TOTAL_PRICE'))
                            const GET_PURCHASE_PRICE = parseFloat(this.getDataAtRowProp(r, 'PURCHASE_PRICE'))
                            const GET_PURCHASE_PPU = parseFloat(this.getDataAtRowProp(r, 'PURCHASE_PPU'))
                            const GET_BOX_GET_AMT = parseFloat(this.getDataAtRowProp(r, 'PRODUCT.BOX_GET_AMOUNT'))
                            let SET_PROFIT_PER = (GET_TOTAL_PRICE === 0) ?
                                0 : (GET_PROFIT_PRICE / Math.abs(GET_TOTAL_PRICE)) * 100

                            MAKE_TOOLTIP = `매입단가 : ${numeral(GET_PURCHASE_PPU).format()}<br/>`
                            if (getState.AMT_DIV === '2') {
                                MAKE_TOOLTIP += `매입박스단가: ${numeral(GET_PURCHASE_PPU * GET_BOX_GET_AMT).format()}<br/>`
                            }
                            MAKE_TOOLTIP += `이익금: ${numeral(GET_PROFIT_PRICE).format()}<br/>`
                                + `이익율 : ${numeral(SET_PROFIT_PER).format()}%`

                            let EL_LAYER = document.createElement('div')
                            EL_LAYER.classList.add("view-box")
                            EL_LAYER.innerHTML = MAKE_TOOLTIP

                            const GET_WIDTH = window.innerWidth
                            const GET_HEIGHT = window.innerHeight
                            let SET_DEFAULT_WIDTH = 100
                            let SET_DEFAULT_HEIGHT = 85

                            // 레이어가 나타날 위치를 셋팅한다.
                            let SET_POS_X = e.clientX - (SET_DEFAULT_WIDTH * 2)
                            let SET_POS_Y = e.clientY + 5

                            // 레이어가 화면 크기를 벗어나면 위치를 바꾸어 배치한다.
                            if (SET_POS_X + SET_DEFAULT_WIDTH > GET_WIDTH) {
                                SET_POS_X -= SET_DEFAULT_WIDTH
                            }
                            if (SET_POS_Y + SET_DEFAULT_HEIGHT > GET_HEIGHT) {
                                SET_POS_Y -= SET_DEFAULT_HEIGHT
                            }

                            // 상단기준점(0,0) 밖으로 벗어난다면 상단기준점(0,0)에 배치
                            if (SET_POS_X < 0) {
                                SET_POS_X = 0
                            }
                            if (SET_POS_Y < 0) {
                                SET_POS_Y = 0
                            }

                            let SET_PROFIT_LAYER = document.createElement('div')
                            SET_PROFIT_LAYER.appendChild(EL_LAYER)
                            SET_PROFIT_LAYER.className = 'profitLayer'

                            const SET_STYLE_OBJ = {
                                top: `${SET_POS_Y}px`,
                                left: `${SET_POS_X + 30}px`,
                                display: 'block'
                            }

                            for (let p in SET_STYLE_OBJ)
                                SET_PROFIT_LAYER.style[p] = SET_STYLE_OBJ[p]

                            document.querySelector('body').appendChild(SET_PROFIT_LAYER)
                        }
                    },
                    afterOnCellMouseOut: function (e, coords) {
                        if (_get(self.model, 'salesMainItemList').length >= 3 && coords.col === 16) {
                            const GET_LAYER = document.querySelector('.profitLayer')
                            if (GET_LAYER) {
                                self.removeElement(GET_LAYER)
                            }
                        }
                    },
                    afterOnCellMouseDown: function (e, coords) {
                        if (this.getDataAtRowProp(coords.row, 'IS_EMPTY')) {
                            return false
                        }

                        switch (coords.col) {
                            case 17:
                                this.alter('remove_row', coords.row)
                                self.model.salesMainItemList.splice(coords.row, 1)
                                break
                        }
                    },
                    afterSelectionEnd: function (r, c) {
                        const GET_ROW_CHECK = this.getDataAtRowProp(r, 'IS_SUMMARY')
                        if (GET_ROW_CHECK) return

                        switch (c) {
                            case 0:
                                self.doGoodsSearch(false, r)
                                break
                        }
                    },
                    enterMoves: () => {
                        const MAX_COL = this.hot.getCellMeta(0, 0).columns.length - 1
                        if (this.hot.getSelected() >= MAX_COL) {
                            return {row: 1, col: -MAX_COL}
                        } else {
                            return {row: 0, col: 1}
                        }
                    },
                    afterChange: (changes, source) => {
                        if (!changes) return
                        if (source === 'set') {
                            // 합계 계산
                            this.doRenderSummary()
                        } else {
                            this.doCalculate(changes)
                        }
                    },
                    beforeKeyDown: function (e) {
                        let sel = this.getSelected()
                        if (!sel) return

                        // 컨트롤 엔터 시 다음 줄로 이동
                        if (e.which === 13 && e.ctrlKey) {
                            this.selectCell(sel[0][0] + 1, 0)
                        }
                    }
                })

                this.hot.updateSettings({
                    cells: this.doCellRenderer
                })

                // TODO 라이센스 문구 제거
                // this.removeElement('hot-display-license-info')
                this.addResizeSetting()

                window.addEventListener("resize", this.debounce(() => {
                    this.hot.render()
                }))
            },

            /**
             * TODO ANDSONTABLE의 FIX BOTTOM ROW 버그
             * 셀 콘텐츠의 높이가 전체 부모의 높이보다 적을경우,
             * FIX BOTTOM에 해당하는 ROW가 중복으로 노출 됨.
             * 당장은 높이 계산에 따라서 숨김&보임 처리 함.
             */
            doFixRowRenderer () {
                // 현재 HOT의 높이
                const GET_TABLE = this.node.table
                const GET_TABLE_HEIGHT = GET_TABLE.clientHeight
                const GET_MASTER = GET_TABLE.querySelector('.ht_master')
                const GET_CONTENT = GET_MASTER.querySelector('.wtHider')
                const GET_CONTENT_HEIGHT = GET_CONTENT.clientHeight
                const GET_BOTTOM = GET_TABLE.querySelector('.ht_clone_bottom')
                const GET_BOTTOM_HEADER = GET_TABLE.querySelector('.ht_clone_bottom_left_corner')

                if (GET_CONTENT_HEIGHT < GET_TABLE_HEIGHT) {
                    // 시트의 높이가 전체 높이보다 작으면 FIX BOTTOM 숨김
                    GET_BOTTOM.style.display = 'none'
                    GET_BOTTOM_HEADER.style.display = 'none'
                } else {
                    GET_BOTTOM.style.display = 'block'
                    GET_BOTTOM_HEADER.style.display = 'block'
                }
            },

            doCellRenderer (row, col) {
                const cellPrp = {}
                const HOT = this.hot

                if (!HOT) {
                    return {}
                }
                if (HOT.getDataAtRowProp(row, 'IS_EMPTY')) {
                    cellPrp.readOnly = true
                } else if (HOT.getDataAtRowProp(row, 'IS_SUMMARY')) {
                    cellPrp.readOnly = true
                    cellPrp.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                        td.className = 'htBgSummary'
                        if (
                            ['BOX_AMOUNT', 'ITEM_AMOUNT', 'TOTAL_AMOUNT', 'SALES_PRICE', 'DC_PRICE',
                                'SUPPLY_PRICE', 'TAX_PRICE', 'TOTAL_PRICE', 'SERVICE_AMOUNT'].includes(prop)
                        ) {
                            Handsontable.renderers.NumericRenderer.apply(this, arguments)
                        } else {
                            switch (prop) {
                                case 'PRODUCT.PRODUCT_NAME':
                                    td.innerHTML = '합계'
                                    break
                                default:
                                    Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments)
                                    break
                            }
                        }
                    }
                } else {
                    switch (col) {
                        case 1:
                            cellPrp.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                                Handsontable.renderers.TextRenderer.apply(this, arguments)
                                if (instance.getDataAtRowProp(row, 'HISTORY')) {
                                    let iconElement = document.createElement('SPAN')
                                    iconElement.innerText = 'NEW'
                                    iconElement.classList.add("icon-new")

                                    let textElement = document.createElement('SPAN')
                                    textElement.innerHTML = value

                                    td.innerHTML = ''
                                    td.appendChild(textElement)
                                    td.insertBefore(iconElement, textElement)
                                }
                            }
                            break
                        case 15:
                            cellPrp.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                                Handsontable.cellTypes[cellProperties.type].renderer.apply(this, arguments)

                                if (value === '매출') {
                                    td.parentNode.classList.remove("type2")
                                    td.parentNode.classList.add("type1")
                                } else {
                                    td.parentNode.classList.remove("type1")
                                    td.parentNode.classList.add("type2")
                                }
                            }
                            break
                        case 16:
                            cellPrp.readOnly = true
                            cellPrp.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                                Handsontable.renderers.TextRenderer.apply(this, arguments)
                                td.className = 'htViewRow'
                                td.innerHTML = '<div class="btn-view">&nbsp;&nbsp;보기&nbsp;&nbsp;</div>'
                            }
                            break
                        case 17:
                            cellPrp.readOnly = true
                            cellPrp.renderer = function (instance, td, row, col, prop, value, cellProperties) {
                                Handsontable.renderers.TextRenderer.apply(this, arguments)
                                td.innerHTML = '<button class="btn btn-del">x</button>'
                            }
                            break
                    }
                }
                return cellPrp
            },

            /**
             * 상품 조회 팝업
             * @param isDup
             * 납품분 여부 true/false
             */
            doGoodsSearch (isDup, getRow) {
                const HOT = this.hot
                HOT.deselectCell()

                if (!_get(this.model, 'salesDay')) {
                    this.showCommonAlert('매출일자를 선택해주세요.')
                    return
                }

                if (!_get(this.model, 'customer.CUSTOMER_CODE')) {
                    this.showCommonAlert('거래처를 선택해주세요.')
                    return
                }

                if (!_get(this.model, 'member.code')) {
                    this.showCommonAlert('담당자를 선택해주세요.')
                    return
                }

                if (!_get(this.model, 'warehouse.code')) {
                    this.showCommonAlert('창고를 선택해주세요.')
                    return
                }


                // 현재 클릭 ROW 값 저장
                if (isDup) {
                    this.selectedRowIndex = (HOT.countRows()) ? HOT.countRows() - 2 : 0
                    this.isGoodsPopDup = true
                } else {
                    this.selectedRowIndex = getRow ? getRow : 0
                    this.isGoodsPopDup = false
                }
                this.$root.$emit('bv::show::modal', 'pop-goods-multi-picker')
            },
            /**
             * 상품 팝업에서 선택된 정보를 hansOnTable 에 row 추가
             */
            formatData (data) {
                // GET VUEX STATE
                const getState = this.getStoreState
                const getCustomer = this.model.customer

                // 가맹점 수량 구분
                const getAmtDiv = getState.AMT_DIV

                // 거래처 부가세 구분
                const getCustomerStax = getCustomer.STAX
                // 상품 과세면세 구분
                const getProductTax = data.PRODUCT.TAX_DIV
                // 상품 기본 판매수량
                const getProductSalesAmt = data.PRODUCT.SALESE_AMOUNT
                // 상품 입수수량
                const getBoxGetAmt = data.PRODUCT.BOX_GET_AMOUNT
                // 상품 판매단가
                const getProductPpu = data.SALES_PPU
                const getProductPurPpu = data.PURCHASE_PPU

                let SET_BOX_AMT = (getAmtDiv !== '1') ? getProductSalesAmt : 0
                let SET_ITEM_AMT = (getAmtDiv === '1') ? getProductSalesAmt : 0
                let SET_TOT_AMT = (getAmtDiv === '1') ?
                    getProductSalesAmt : getProductSalesAmt * getBoxGetAmt
                let SET_DC_PER = (getCustomer.DC_PERCENT) ? parseInt(getCustomer.DC_PERCENT) : 0
                let SET_SALES_PRICE = getProductPpu * SET_TOT_AMT
                let SET_PURCHASE_PRICE = getProductPurPpu * SET_TOT_AMT
                let SET_DC_PRICE = SET_SALES_PRICE * (SET_DC_PER / 100)
                let SET_TOT_PRICE = SET_SALES_PRICE - SET_DC_PRICE

                let ARR_CAL_PRICE = this.doRetCalPrice(SET_TOT_PRICE, getCustomerStax, getProductTax)
                let SET_SUPPLY_PRICE = ARR_CAL_PRICE[0]
                let SET_TAX_PRICE = ARR_CAL_PRICE[1]

                let SET_STAX_PRICE = 0
                if (getCustomerStax === '2') {
                    if (getProductTax === '1') {
                        SET_STAX_PRICE = SET_SALES_PRICE * 0.1
                        SET_PURCHASE_PRICE = Math.floor(SET_PURCHASE_PRICE * 1.1)
                    }
                }

                // 이익금구하기
                let SET_PROFIT_PRICE = SET_SALES_PRICE - SET_PURCHASE_PRICE
                let SET_PROFIT_PER = (SET_TOT_PRICE === 0) ?
                    0 : (SET_PROFIT_PRICE / Math.abs(SET_TOT_PRICE)) * 100

                return {
                    IS_EMPTY: false, // 테이블 하단 빈객체 구분 값
                    HISTORY: data.HISTORY,
                    SALES_DIV: '매출',
                    EVENT_DIV: false,
                    PRODUCT: data.PRODUCT,

                    BOX_AMOUNT: SET_BOX_AMT,
                    ITEM_AMOUNT: SET_ITEM_AMT,
                    TOTAL_AMOUNT: SET_TOT_AMT,
                    SERVICE_AMOUNT: 0,

                    PURCHASE_PPU: getProductPurPpu,
                    SALES_PPU: getProductPpu,
                    BEFORE_PPU: getProductPpu,
                    // MM_PPU: undefined,

                    PURCHASE_PRICE: SET_PURCHASE_PRICE,
                    SALES_PRICE: SET_SALES_PRICE,
                    DC_PRICE: SET_DC_PRICE,
                    SUPPLY_PRICE: SET_SUPPLY_PRICE,
                    TAX_PRICE: SET_TAX_PRICE,
                    TOTAL_PRICE: SET_TOT_PRICE,
                    PROFIT_PRICE: SET_PROFIT_PRICE,

                    DC_PERCENT: SET_DC_PER,
                    PROFIT_PERCENT: SET_PROFIT_PER,

                    MEMO: ''
                }
            },

            cbAddGoods (arr) {
                // TODO 클릭한 ROW에 상품이 들어가도록 수정해야함
                const HOT = this.hot
                const makeArr = []
                arr.forEach((e) => {
                    makeArr.push(this.formatData(e))
                })

                // GET TABLE DATA
                const getTableData = HOT.getSourceData()

                // 합계와 빈줄 제거
                // _remove(getTableData, (e)=> e.IS_EMPTY || e.IS_SUMMARY)

                let makeNewData
                if (getTableData.length) {
                    // 선택한 위치를 기준으로 선택한 상품들 끼워넣기
                    getTableData.splice(this.selectedRowIndex, 0, ...makeArr)
                    makeNewData = getTableData
                } else {
                    makeNewData = makeArr
                }

                // TODO VUE DATA에 리스트를 저장해야하나?
                this.model.salesMainItemList = _cloneDeep(makeNewData)

                this.$nextTick(() => {
                    // 항상 맨아래 1줄 노출을위해 빈 객체 push
                    // let emptyData = _cloneDeep(this.hotOptions.salesMainSchema)
                    // emptyData.IS_EMPTY = true
                    // makeNewData.push(emptyData)

                    // 데이터 로드 후 렌더링
                    // HOT.loadData(makeNewData)
                    HOT.updateSettings({
                        cells: this.doCellRenderer
                    })
                    HOT.render()

                    // BOX 수량으로 포커싱
                    HOT.selectCell(this.selectedRowIndex, 3)


                    // 합계 계산
                    this.doRenderSummary()

                    // 상품 팝업 숨김
                    this.$root.$emit('bv::hide::modal', 'pop-goods-multi-picker')
                })
            },

            doRenderSummary () {
                const HOT = this.hot
                const HOT_COUNT = HOT.countRows() - 1
                let HOT_DATA = this.hot.getSourceData()
                let TOTAL_SUMMARY = {
                    BOX_AMOUNT: 0,
                    ITEM_AMOUNT: 0,
                    TOTAL_AMOUNT: 0,
                    SALES_PRICE: 0,
                    DC_PRICE: 0,
                    SUPPLY_PRICE: 0,
                    TAX_PRICE: 0,
                    TOTAL_PRICE: 0,
                    SERVICE_AMOUNT: 0
                }
                HOT_DATA.forEach((e, r) => {
                    // 합계와 빈줄이 아닐때만 반복
                    if (!e.IS_SUMMARY && !e.IS_EMPTY) {
                        if (e.SALES_DIV === '매출') {
                            TOTAL_SUMMARY.BOX_AMOUNT += e.BOX_AMOUNT
                            TOTAL_SUMMARY.ITEM_AMOUNT += e.ITEM_AMOUNT
                            TOTAL_SUMMARY.TOTAL_AMOUNT += e.TOTAL_AMOUNT
                            TOTAL_SUMMARY.SALES_PRICE += e.SALES_PRICE
                            TOTAL_SUMMARY.DC_PRICE += e.DC_PRICE
                            TOTAL_SUMMARY.SUPPLY_PRICE += e.SUPPLY_PRICE
                            TOTAL_SUMMARY.TAX_PRICE += e.TAX_PRICE
                            TOTAL_SUMMARY.TOTAL_PRICE += e.TOTAL_PRICE
                            TOTAL_SUMMARY.SERVICE_AMOUNT += e.SERVICE_AMOUNT
                        } else {
                            TOTAL_SUMMARY.BOX_AMOUNT -= e.BOX_AMOUNT
                            TOTAL_SUMMARY.ITEM_AMOUNT -= e.ITEM_AMOUNT
                            TOTAL_SUMMARY.TOTAL_AMOUNT -= e.TOTAL_AMOUNT
                            TOTAL_SUMMARY.SALES_PRICE -= e.SALES_PRICE
                            TOTAL_SUMMARY.DC_PRICE -= e.DC_PRICE
                            TOTAL_SUMMARY.SUPPLY_PRICE -= e.SUPPLY_PRICE
                            TOTAL_SUMMARY.TAX_PRICE -= e.TAX_PRICE
                            TOTAL_SUMMARY.TOTAL_PRICE -= e.TOTAL_PRICE
                            TOTAL_SUMMARY.SERVICE_AMOUNT -= e.SERVICE_AMOUNT
                        }
                    }
                })

                // 거래 후 잔고 계산을 위한 합계금액 저장
                this.model.salesTotalPrice = TOTAL_SUMMARY.TOTAL_PRICE

                let SUMMARY_DATA = HOT.getSourceDataAtRow(HOT_COUNT)
                _merge(SUMMARY_DATA, TOTAL_SUMMARY)

                HOT.render()
            },

            // 금액과 부가세구분을 받아 공급가, 세액 리턴
            doRetCalPrice (nGetPrice, sCustomerStax, sTaxDiv) {
                let nSupplyPrice = 0
                let nTaxPrice = 0

                switch (sCustomerStax) {
                    case "1": //부가세포함
                        if (sTaxDiv == "1") {//과세
                            nSupplyPrice = Math.ceil(nGetPrice / 1.1)
                            nTaxPrice = nGetPrice - nSupplyPrice
                        } else {//면세
                            nSupplyPrice = nGetPrice
                            nTaxPrice = 0
                        }
                        break
                    case "2": //부가세별도
                        if (sTaxDiv == "1") {//과세
                            nSupplyPrice = nGetPrice
                            nTaxPrice = Math.floor(nGetPrice * 0.1)
                        } else {//면세
                            nSupplyPrice = nGetPrice
                            nTaxPrice = 0
                        }
                        break
                }

                return [nSupplyPrice, nTaxPrice]
            },

            doCalculate (changes) {
                const HOT = this.hot
                const change = changes[0]
                const r = change[0]
                const p = change[1]
                const oldValue = change[2]
                let newValue = change[3]

                if (oldValue === undefined || !oldValue) {
                    if (oldValue !== 0) return
                }
                if (oldValue === newValue) return
                if (newValue === undefined || !newValue) {
                    newValue = 0
                }

                let arrGetData = HOT.getDataAtRow(r)

                //맨마지막줄 return
                if (!arrGetData[0]) return

                let nGetPpu = parseFloat(HOT.getDataAtRowProp(r, 'SALES_PPU')) // 단가
                let nGetPrice = parseInt(HOT.getDataAtRowProp(r, 'SALES_PRICE'))

                let nGetSupplyPrice = parseInt(HOT.getDataAtRowProp(r, 'SUPPLY_PRICE'))
                let nGetTaxPrice = parseInt(HOT.getDataAtRowProp(r, 'TAX_PRICE'))
                let nGetTotPrice = parseInt(HOT.getDataAtRowProp(r, 'TOTAL_PRICE'))
                let nGetSerAmt = (HOT.getDataAtRowProp(r, 'SERVICE_AMOUNT')) ?
                    parseInt(HOT.getDataAtRowProp(r, 'SERVICE_AMOUNT')) : 0
                let nGetDiv = HOT.getDataAtRowProp(r, 'SALES_DIV')


                if (p !== 'TOTAL_PRICE') {
                    const special_pattern = /[`~!@#$%^&*|\\\'\";:+\/?]/gi
                    if (special_pattern.test(newValue) === true) {
                        this.showCommonAlert('특수문자는 사용할 수 없습니다.')
                        HOT.setDataAtRowProp(r, p, oldValue, 'set')
                        return false
                    }

                    if (parseFloat(newValue) < 0) {
                        if (p === 'DC_PRICE') {
                            if (nGetDiv !== "매출") {
                                this.showCommonAlert('-는 입력할 수 없습니다.')
                                HOT.setDataAtRowProp(r, p, oldValue, 'set')
                                return false
                            }
                        }

                        HOT.setDataAtRowProp(r, p, parseFloat(newValue) * -1)
                        if (nGetDiv === "매출") {
                            HOT.setDataAtRowProp(r, 'SALES_DIV', "정상반품", 'set')
                        }
                        return false
                    }
                }

                const nGetRow = HOT.countRows()
                for (let k = 0; k < nGetRow - 1; k++) {
                    let getProduct = HOT.getDataAtRowProp(r, 'PRODUCT.REG_NO')

                    if (!getProduct) {
                        this.showCommonAlert('빈줄이 있습니다.')
                        HOT.setDataAtRowProp(r, p, oldValue, "set")
                        return false
                    }
                }

                // GET VUEX STATE
                const getState = this.getStoreState

                // 가맹점 수량 구분
                const setAmtDiv = getState.AMT_DIV
                const sDcDiv = getState.DC_DIV

                // 거래처 부가세 구분
                const sCustomerStax = this.model.customer.STAX

                // 상품 과세면세구분
                const nTaxDiv = HOT.getDataAtRowProp(r, 'PRODUCT.TAX_DIV')
                let nDcPer = 0, nGetDcPrice = 0

                if (sDcDiv === '0') {
                    nDcPer = parseInt(this.model.customer.DC_PERCENT)
                    nGetDcPrice = parseInt(HOT.getDataAtRowProp(r, 'DC_PRICE'))
                }

                let nGetBoxCnt, nBoxAmt, nGetCnt, nTotAmt, nSumPrice = 0
                switch (setAmtDiv) {
                    case "0": // 박스
                        nGetBoxCnt = parseFloat(HOT.getDataAtRowProp(r, 'BOX_AMOUNT')) // GET BOX수량
                        nBoxAmt = parseInt(HOT.getDataAtRowProp(r, 'PRODUCT.BOX_GET_AMOUNT')) // 박스입수수량
                        nGetCnt = 0

                        if (!nGetBoxCnt) {
                            nGetBoxCnt = 0
                        }
                        nTotAmt = nGetBoxCnt
                        nSumPrice = (nTotAmt === 0) ? 0 : Math.ceil(parseFloat(nGetPpu * nTotAmt))
                        break
                    case "1": // 낱개
                        nGetBoxCnt = 0
                        nBoxAmt = 0
                        nGetCnt = parseFloat(HOT.getDataAtRowProp(r, 'ITEM_AMOUNT')) //GET EA수량

                        if (!nGetCnt) {
                            nGetCnt = 0
                        }
                        nTotAmt = nGetCnt
                        nSumPrice = (nTotAmt === 0) ? 0 : Math.ceil(parseFloat(nGetPpu * nTotAmt))
                        break
                    case "2": // 모두
                        nBoxAmt = parseInt(HOT.getDataAtRowProp(r, 'PRODUCT.BOX_GET_AMOUNT')) // 박스입수수량

                        nGetBoxCnt = parseFloat(HOT.getDataAtRowProp(r, 'BOX_AMOUNT')) //GET BOX수량
                        nGetCnt = parseFloat(HOT.getDataAtRowProp(r, 'ITEM_AMOUNT')) //GET EA수량

                        if (!nGetBoxCnt) {
                            nGetBoxCnt = 0
                        }
                        if (!nGetCnt) {
                            nGetCnt = 0
                        }
                        nTotAmt = (nBoxAmt * nGetBoxCnt) + nGetCnt
                        nSumPrice = (nTotAmt === 0) ? 0 : Math.ceil(parseFloat(nGetPpu * nTotAmt))
                        break
                }


                if (nGetBoxCnt === 0 && nGetCnt === 0) {
                    let init_values = []
                    if (setAmtDiv === '2') {
                        init_values.push([r, 'TOTAL_AMOUNT', 0])
                    }
                    if (sDcDiv === '0') {
                        init_values.push([r, 'DC_PRICE', nGetDcPrice])
                    }
                    init_values.push([r, 'SALES_PRICE', 0])
                    init_values.push([r, 'SUPPLY_PRICE', 0])
                    init_values.push([r, 'TAX_PRICE', 0])
                    init_values.push([r, 'TOTAL_PRICE', 0])

                    HOT.setDataAtRowProp(init_values, 'set')
                    return
                }

                let nStaxPrice = 0, nSetDcPrice = 0
                let nSupplyPrice = nGetSupplyPrice
                let nTaxPrice = nGetTaxPrice

                // 합계금액 기본 세팅
                let nTotPrice = nGetTotPrice
                let new_values = [], arrCalPrice, nSalesPrice

                switch (p) {
                    case 'SALES_PRICE':
                    case 'DC_PRICE':
                    case 'TOTAL_PRICE':
                        if (p === 'SALES_PRICE') { // 금액
                            nSetDcPrice = nGetPrice * (nDcPer / 100)
                            nTotPrice = parseInt(newValue) - nSetDcPrice

                            if (sDcDiv === '0') {
                                new_values.push([r, 'DC_PRICE', nSetDcPrice])
                            }
                            arrCalPrice = this.doRetCalPrice(nTotPrice, sCustomerStax, nTaxDiv)
                            nSupplyPrice = arrCalPrice[0]
                            nTaxPrice = arrCalPrice[1]

                            nSalesPrice = nSupplyPrice + nTaxPrice
                            nTotPrice = nSalesPrice

                            new_values.push([r, 'SUPPLY_PRICE', nSupplyPrice])
                            new_values.push([r, 'TAX_PRICE', nTaxPrice])
                            new_values.push([r, 'SALES_PRICE', nSalesPrice])

                            HOT.setDataAtRowProp(new_values, 'set')
                        } else if (p === 'DC_PRICE') { // 할인금액
                            nDcPer = 100 / (nGetPrice / parseInt(newValue))
                            nSetDcPrice = parseInt(newValue)
                            nTotPrice = nGetPrice - nSetDcPrice

                            if (nTaxDiv === '1') { // 과세
                                if (sCustomerStax === '1') { //포함
                                    nSupplyPrice = Math.ceil(nTotPrice / 1.1)
                                    nTaxPrice = nTotPrice - nSupplyPrice
                                } else { // 별도
                                    nSupplyPrice = nTotPrice
                                    nTaxPrice = Math.floor(nTotPrice * 0.1)
                                }
                            } else { // 면세
                                nSupplyPrice = nTotPrice
                                nTaxPrice = 0
                            }

                            nSalesPrice = nSupplyPrice + nTaxPrice
                            nTotPrice = nSalesPrice

                            new_values.push([r, 'SUPPLY_PRICE', nSupplyPrice])
                            new_values.push([r, 'TAX_PRICE', nTaxPrice])
                            new_values.push([r, 'TOTAL_PRICE', nSalesPrice])

                            HOT.setDataAtRowProp(new_values, 'set')
                        } else if (p === 'TOTAL_PRICE') { // 판매금액
                            nTotPrice = parseInt(newValue)

                            if (nTaxDiv === '1') { // 과세
                                nSupplyPrice = Math.ceil(nTotPrice / 1.1)
                                nTaxPrice = nTotPrice - nSupplyPrice
                            } else { // 면세
                                nSupplyPrice = nTotPrice
                                nTaxPrice = 0
                            }

                            if (sCustomerStax === '1') { // 포함
                                nSetDcPrice = parseInt(nGetPrice - nTotPrice)
                            } else { // 별도
                                nSetDcPrice = parseInt(nGetPrice - nSupplyPrice)
                            }

                            nDcPer = 100 / (nGetPrice / nSetDcPrice)
                            nSalesPrice = nSupplyPrice + nTaxPrice + nSetDcPrice

                            if (sDcDiv === '0') {
                                new_values.push([r, 'DC_PRICE', nSetDcPrice])
                            }

                            new_values.push([r, 'SUPPLY_PRICE', nSupplyPrice])
                            new_values.push([r, 'TAX_PRICE', nTaxPrice])
                            new_values.push([r, 'SALES_PRICE', nSalesPrice])

                            HOT.setDataAtRowProp(new_values, 'set')
                        }
                        break
                    case 'SALES_DIV':
                        if (!(newValue === '매출' || newValue === '정상반품' || newValue === '불량반품')) {
                            HOT.setDataAtRowProp(r, p, '매출', 'set')
                        } else {
                            nTotPrice = nGetPrice - nGetDcPrice

                            arrCalPrice = this.doRetCalPrice(nTotPrice, sCustomerStax, nTaxDiv)
                            nSupplyPrice = arrCalPrice[0]
                            nTaxPrice = arrCalPrice[1]
                        }
                        break
                    case 'BOX_AMOUNT':
                    case 'ITEM_AMOUNT':
                        nTotPrice = nSumPrice - nGetDcPrice

                        if (setAmtDiv === '2') {
                            new_values.push([r, 'TOTAL_AMOUNT', nTotAmt])
                        }
                        new_values.push([r, 'SALES_PRICE', nSumPrice])

                        arrCalPrice = this.doRetCalPrice(nTotPrice, sCustomerStax, nTaxDiv)
                        nSupplyPrice = arrCalPrice[0]
                        nTaxPrice = arrCalPrice[1]
                        nSalesPrice = nSupplyPrice + nTaxPrice
                        nTotPrice = nSalesPrice

                        new_values.push([r, 'SUPPLY_PRICE', nSupplyPrice])
                        new_values.push([r, 'TAX_PRICE', nTaxPrice])
                        new_values.push([r, 'TOTAL_PRICE', nSalesPrice])

                        HOT.setDataAtRowProp(new_values, 'set')
                        break
                    case 'SALES_PPU':
                        nTotPrice = nSumPrice - nGetDcPrice

                        new_values.push([r, 'SALES_PRICE', nSumPrice])
                        if (sDcDiv === '0') {
                            new_values.push([r, 'DC_PRICE', nGetDcPrice])
                        }

                        arrCalPrice = this.doRetCalPrice(nTotPrice, sCustomerStax, nTaxDiv)
                        nSupplyPrice = arrCalPrice[0]
                        nTaxPrice = arrCalPrice[1]
                        nSalesPrice = nSupplyPrice + nTaxPrice
                        nTotPrice = nSalesPrice

                        new_values.push([r, 'SUPPLY_PRICE', nSupplyPrice])
                        new_values.push([r, 'TAX_PRICE', nTaxPrice])
                        new_values.push([r, 'TOTAL_PRICE', nSalesPrice])

                        HOT.setDataAtRowProp(new_values, 'set')
                        break
                    case 'SERVICE_AMOUNT':
                        HOT.setDataAtRowProp([], 'set')
                        break
                }

                let nSetPpu = parseFloat(HOT.getDataAtRowProp(r, 'PURCHASE_PPU'))
                let nAPrice = nTotPrice // 판매금액
                let nBPrice = 0
                if (setAmtDiv === '0') {
                    nBPrice = Math.ceil(nSetPpu * (nGetBoxCnt + nGetSerAmt)) // 입고합계금액
                } else {
                    nBPrice = Math.ceil(nSetPpu * (nTotAmt + nGetSerAmt)) // 입고합계금액
                }

                // 이익금액 계산
                let nProfitPrice = nAPrice - nBPrice

                // 매출이아니면 금액 음수처리
                if (nGetDiv !== '매출') {
                    nProfitPrice = nProfitPrice * -1
                }

                if (sCustomerStax === '2') {
                    if (nTaxDiv === '1') {
                        nStaxPrice = nTaxPrice
                        nBPrice = Math.floor(nBPrice * 1.1)
                    }
                }

                let upt_values = []
                upt_values.push([r, 'STAX_PRICE', nStaxPrice])
                upt_values.push([r, 'DC_PRICE', nGetDcPrice])
                upt_values.push([r, 'DC_PERCENT', nDcPer])

                upt_values.push([r, 'TOTAL_PRICE', nAPrice])
                upt_values.push([r, 'PROFIT_PRICE', nProfitPrice]) //이익금액 저장
                upt_values.push([r, 'RECEIVE_PRICE', nBPrice])

                HOT.setDataAtRowProp(upt_values, 'set')
            },

            // 매출 등록처리
            doSubmit (sDiv) {

            }
        }
    }
</script>