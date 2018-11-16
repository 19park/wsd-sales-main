<template>
    <b-card no-body>
        <b-card-header class="d-flex justify-content-between" id="list-header" ref="list-header">
            <div class="d-flex align-items-center">
                <DatePicker id="startDay"
                            label="기간 :"
                            :model="model"
                            wrap-classes="d-inline-block"/>
                <span class="ml-1">~</span>
                <DatePicker id="endDay"
                            :model="model"
                            wrap-classes="d-inline-block"/>

                <CustomerPicker :model="model.customer"
                                wrap-classes="d-inline-block ml-3"/>
                <EmployeePicker :model="model.member"
                                wrap-classes="d-inline-block ml-3"/>
                <button type="button" class="btn btn-search ml-2" @click="doListLoad()">
                    리스트조회
                </button>
            </div>
        </b-card-header>
        <b-card-body id="list-body" ref="list-body" class="p-0">
            <div class="d-flex flex-column h-100">
                <div class="tit-area">
                    <table class="table table-bordered mb-0"
                           style="table-layout:fixed;">
                        <colgroup>
                            <col width="10%"/>
                            <col width="15%"/>
                            <col width="6%"/>
                            <col width="20%"/>
                            <col width="10%"/>
                            <col width="7%"/>
                            <col width="10%"/>
                            <col width="10%"/>
                            <col width="7%"/>
                            <col width="5%"/>
                        </colgroup>
                        <thead>
                        <tr bgcolor="d9edf7">
                            <th></th>
                            <th>매출일시</th>
                            <th>번호</th>
                            <th>거래처명</th>
                            <th>담당사원</th>
                            <th class="text-right">상품수</th>
                            <th class="text-right">금액</th>
                            <th>등록자</th>
                            <th>장치</th>
                            <th>인쇄</th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="scr-area flex-fill">
                    <div v-if="!listModel.data.length"
                         class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
                        조회결과가 없습니다.
                    </div>
                    <table v-else
                           class="table table-bordered mb-0"
                           style="table-layout:fixed;">
                        <colgroup>
                            <col width="10%"/>
                            <col width="15%"/>
                            <col width="6%"/>
                            <col width="20%"/>
                            <col width="10%"/>
                            <col width="7%"/>
                            <col width="10%"/>
                            <col width="10%"/>
                            <col width="7%"/>
                            <col width="5%"/>
                        </colgroup>
                        <tbody class="list-area" id="list-wrap">
                        <tr align="center"
                            v-for="item in listModel.data"
                            ref="list-item"
                            class="list-item cursor"
                            :class="{ on: chkMatchListState(item) }"
                            @click="getLoadData(item)">
                            <!-- TODO 복사저장 트레킹 fn_trk('B003') //-->
                            <td>
                                <a href="javascript:void(0)"
                                   class="btn btn-sm btn-black"

                                   @click="doSalesCopy()">복사저장</a>
                            </td>
                            <td align="left" class="elip">
                                {{
                                `${getFormatTime(item.SALES_DAY)} ${getFormatDate('LT', item.REG_DATE)}`
                                }}
                            </td>
                            <td>{{item.SALES_CODE}}</td>
                            <td align="left" class="elip">{{item.CUSTOMER_NAME}}</td>
                            <td align="left">{{item.MEMBER_NAME}}</td>
                            <td align="right">{{item.ITEM_COUNT}}</td>
                            <td align="right">{{getFormatPrice(item.PRICE)}}</td>
                            <td align="left">{{item.REG_NAME}}</td>
                            <td align="left">{{(item.APP_DIV === 'W')?'웹':'모바일'}}</td>
                            <td>{{(item.SLIP_YN)?'Y':'N'}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="box">
                    <table class="table table-bordered" id="sum-table">
                        <colgroup>
                            <col width="7%"/>
                            <col width="13%"/>
                            <col width="7%"/>
                            <col width="13%"/>
                            <col width="7%"/>
                            <col width="13%"/>
                            <col width="7%"/>
                            <col width="13%"/>
                            <col width="7%"/>
                            <col width="13%"/>
                        </colgroup>
                        <tbody>
                        <tr align="right">
                            <th class="b1">매출계</th>
                            <td class="t1">{{getFormatSummary('SALES')}}</td>
                            <th class="b1">반품계</th>
                            <td class="t2">{{getFormatSummary('SALES_RETURN')}}</td>
                            <th class="b1">수금계</th>
                            <td class="t3">{{getFormatSummary('COLLECT')}}</td>
                            <th class="b1">할인계</th>
                            <td class="t4">{{getFormatSummary('COLLECT_DISCOUNT')}}</td>
                            <th class="b1">미수</th>
                            <td class="t5">{{getFormatSummary('REMAIN')}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-card-body>
        <b-card-footer id="list-footer" ref="list-footer">
            <div class="d-flex justify-content-between">
                <div class="d-inline-block">Total : <span class="tot-print">0</span></div>
                <paginate v-model="listModel.page"
                          :pageCount="listModel.total"
                          :prevText="'<<'"
                          :nextText="'>>'"
                          :page-range="10"
                          :page-class="'page-item'"
                          :prev-link-class="'page-link'"
                          :next-link-class="'page-link'"
                          :page-link-class="'page-link'"
                          :containerClass="'pagination b-pagination pagination-md'"
                          :click-handler="doListClick">
                </paginate>
                <div class="float-right d-flex align-items-center">
                    <button type="button" class="btn btn-print mr-1"
                            @click="doOpenSalesReport()">명세서일괄인쇄
                    </button>
                    <button type="button" class="btn btn-excel mr-1" @click="goExcel()"
                            style="width:60px;">엑셀
                    </button>
                    <button type="button" class="btn btn-print" @click="goPrint()"
                            style="width:60px;">인쇄
                    </button>
                </div>
            </div>
        </b-card-footer>
    </b-card>
</template>

<script>
    import {sales} from '../api/index'
    import Common from './mixin/common'
    import numeral from 'numeral'
    import _assign from 'lodash/assign'
    import _findIndex from 'lodash/findIndex'
    import _isEqal from 'lodash/isEqual'

    // 조건조회 관련
    import CustomerPicker from "./inputs/CustomerPicker.vue"
    import EmployeePicker from "./inputs/EmployeePicker.vue"

    import VuejsPaginate from 'vuejs-paginate'
    import DatePicker from './inputs/DatePicker.vue'

    // 명세서인쇄 팝업
    import PopSalesReport from './popup/PopSalesReport.vue'

    export default {
        name: "SalesList",
        mixins: [Common],
        components: {
            DatePicker,
            CustomerPicker,
            EmployeePicker,
            'paginate': VuejsPaginate,

            PopSalesReport
        },
        data () {
            return {
                isLoading: false,
                model: {
                    startDay: this.getFullCurrentDate(),
                    endDay: this.getFullCurrentDate(),
                    customer: {
                        CUSTOMER_CODE: null,
                        CUSTOMER_NAME: null
                    },
                    member: {
                        code: null
                    }
                },
                listModel: {
                    page: 1,
                    total: 1,
                    max: 50,
                    data: [],
                    summary: {
                        COLLECT: 0,
                        COLLECT_DISCOUNT: 0,
                        REMAIN: 0,
                        SALES: 0,
                        SALES_RETURN: 0
                    }
                },
                node: {
                    root: null,
                    header: null,
                    footer: null,
                    body: null,
                    bodyTitle: null,
                    bodyList: null
                }
            }
        },
        computed: {
            getSalesSummary () {
                return this.listModel.summary
            },
            getListItems () {
                return this.$refs['list-item']
            }
        },
        mounted () {
            this.node.root = this.$salesListWrap()
            this.node.header = this.$refs['list-header']
            this.node.footer = this.$refs['list-footer']
            this.node.body = this.$refs['list-body']
            this.node.bodyTitle = this.node.body.querySelector('.tit-area')
            this.node.bodyList = this.node.body.querySelector('.scr-area')

            window.addEventListener("resize", this.$common.debounce(this.doResizeRender))

            this.doResizeRender()
            this.doListLoad()
        },
        methods: {
            // 리스트 엘리먼트 높이 리사이징
            doResizeRender () {
                const getNode = this.node
                const GET_ROOT_H = getNode.root.clientHeight

                if (GET_ROOT_H < 200) {
                    return false
                }
                const GET_HEADER_H = getNode.header.clientHeight
                const GET_FOOTER_H = getNode.footer.clientHeight
                const GET_TARGET = getNode.body

                // 초기 높이 값 세팅
                GET_TARGET.style.height = `${GET_ROOT_H - GET_HEADER_H - GET_FOOTER_H - 10}px`

                const GET_SCROLL_ELEM = getNode.bodyList
                const scrollBarWidth = GET_SCROLL_ELEM.offsetWidth - GET_SCROLL_ELEM.clientWidth;
                getNode.bodyTitle.style.paddingRight = `${scrollBarWidth}px`
            },

            // 페이지네이션 클릭이벤트 처리
            doListClick (n) {
                this.listModel.page = n
                this.doListLoad()
            },

            // 매출목록 조회
            async doListLoad (cbData) {
                const postData = {
                    start_day: this.getFormatTime(this.model.startDay),
                    end_day: this.getFormatTime(this.model.endDay),
                    customer_code: this.model.customer.CUSTOMER_CODE,
                    member_code: this.model.member.code,
                    offset: (this.listModel.page - 1) * this.listModel.max,
                    max: this.listModel.max
                }

                this.isLoading = true
                const loader = this.$common.getLoader(this)

                const getSummary = await this.doSummaryLoad(postData)
                _assign(this.getSalesSummary, getSummary)

                sales.fetch(postData).then((data) => {
                    let getTotal = (data.total === 0) ? 1 : data.total
                    getTotal = getTotal / this.listModel.max

                    this.listModel.total = getTotal
                    this.listModel.data = data.list

                    this.isLoading = false
                    loader.hide()

                    const getScrollNode = this.node.bodyList
                    this.$common.scrollTo(getScrollNode, getScrollNode.scrollTop, 0, 300, 0)

                    this.$nextTick(() => {
                        // 저장 후 인쇄 상태라면 DATA 체크하여 클릭
                        if (cbData) {
                            this.listModel.data.forEach((e, i) => {
                                if (
                                    cbData.SALES_CODE === e.SALES_CODE &&
                                    cbData.SALES_DAY === e.SALES_DAY &&
                                    cbData.CUSTOMER_CODE === e.CUSTOMER_CODE
                                ) {
                                    this.getListItems[i].click()
                                }
                            })
                        }
                    })
                }).catch((err) => {
                    this.isLoading = false
                    loader.hide()

                    this.$snotify.error('매출목록 조회 실패', this.$common.parseErrorMsg(err))
                })
            },

            chkMatchListState (item) {
                const matchObj = {
                    SALES_CODE: item.SALES_CODE,
                    SALES_DAY: item.SALES_DAY,
                    CUSTOMER_CODE: item.CUSTOMER_CODE
                }
                return _isEqal(this.$salesEntry().listState.model, matchObj)
            },

            // 매출 합계 추가 조회
            doSummaryLoad (postData) {
                return sales.fetchSummary(postData).then((data) => data).catch((err) => {
                    this.$snotify.error('매출목록집계 조회 실패', this.$common.parseErrorMsg(err))
                })
            },

            /**
             * 매출 집계 조회 콤마 포맷
             * @param key
             * 조회 객체의 키를 받아 리턴
             */
            getFormatSummary (key) {
                return numeral(this.getSalesSummary[key]).format()
            },

            getFormatPrice (n) {
                return numeral(n).format()
            },

            /**
             * 조회 된 매출목록의 ROW 클릭 시 원장 및 데이터 조회
             * @param obj (매출 코드,일자, 거래처 코드)
             * @param isLoadLedger (원장 추가 로딩 여부)
             */
            getLoadData (obj, isLoadLedger = true) {
                // 리스트 상태 값 저장 (페이지 이동 시)
                const getSalesEntry = this.$salesEntry()
                getSalesEntry.listState.model.SALES_CODE = obj.SALES_CODE
                getSalesEntry.listState.model.SALES_DAY = obj.SALES_DAY
                getSalesEntry.listState.model.CUSTOMER_CODE = obj.CUSTOMER_CODE

                // 매출등록 컴포넌트 수정상태 변경
                getSalesEntry.listState.isModify = true

                // 명세서 출력여부 세팅
                getSalesEntry.listState.isPrint = (obj.SLIP_YN) ? obj.SLIP_YN : true

                const postLedgerData = {
                    customer_code: obj.CUSTOMER_CODE,
                    start_day: this.getFormatTime(new Date().setFullYear(new Date().getFullYear() - 1)),
                    end_day: this.getFormatTime(new Date())
                }

                const postData = {
                    sales_day: obj.SALES_DAY,
                    sales_code: obj.SALES_CODE,
                    customer_code: obj.CUSTOMER_CODE
                }

                // 매출 단일 조회
                getSalesEntry.getSalesData(postData)

                // 매출 원장 조회
                if (isLoadLedger) this.$salesLedger().getSalesLedger(postLedgerData)
            },

            // 형제 노드 찾기
            getSiblings (n) {
                return [...n.parentElement.children].filter(c => c != n)
            },

            // 매출목록 엑셀저장
            goExcel () {
                console.log('엑셀')
            },

            // 매출목록 인쇄
            goPrint () {
                console.log('인쇄')
            },

            // 명세서 팝업 오픈
            doOpenSalesReport () {
                // 리스트 데이터 확인
                if (this.listModel.data.length < 1) {
                    this.$snotify.error('일괄 인쇄 할 데이터가 없습니다.', '데이터 없음')
                    return
                }
                this.$root.$emit('bv::show::modal', 'pop-sales-batch-report')
            }
        }
    }
</script>

<style scoped>

</style>
