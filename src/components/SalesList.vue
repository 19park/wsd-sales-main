<template>
    <b-card no-body>
        <b-card-header class="d-flex justify-content-between" id="list-header" ref="list-header">
            <div class="box">
                <div class="d-inline-block">
                    <DatePicker id="startDay"
                                label="기간 :"
                                :model="model"
                                wrap-classes="d-inline-block"/>
                    <span class="ml-1">~</span>
                    <DatePicker id="endDay"
                                :model="model"
                                wrap-classes="d-inline-block"/>

                    <CustomerPicker :model="model.customer"
                                    wrap-classes="d-inline-block ml-2"/>
                    <EmployeePicker :model="model.member"
                                    wrap-classes="d-inline-block ml-2"/>
                    <button type="button" class="btn btn-search" @click="doListLoad()">
                        리스트조회
                    </button>
                </div>
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
                            class="list-item cursor"
                            :class="{ on: chkMatchListState(item) }"
                            @click="getLoadData($event, item)">
                            <!-- TODO 복사저장 트레킹 fn_trk('B003') //-->
                            <td>
                                <a href="javascript:void(0)"
                                   class="btn btn-sm btn-black"
                                   @click="fnCopySave(this)">복사저장</a>
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
                            <td align="right">{{item.PRICE}}</td>
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
                    <!--<span class="mr-3">-->
                    <!--<input type="checkbox" value="Y" id="re-print">-->
                    <!--<label for="re-print">재발행포함</label>-->
                    <!--</span>-->
                    <button type="button" class="btn btn-print mr-1"
                            @click="$('#popPrintAll').modal('show')">명세서일괄인쇄
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
    import _merge from 'lodash/merge'
    import _match from 'lodash/isMatch'

    // 조건조회 관련
    import CustomerPicker from "./inputs/CustomerPicker.vue"
    import EmployeePicker from "./inputs/EmployeePicker.vue"

    import VuejsPaginate from 'vuejs-paginate'
    import DatePicker from './inputs/DatePicker.vue'

    export default {
        name: "SalesList",
        mixins: [Common],
        components: {
            CustomerPicker,
            EmployeePicker,
            DatePicker,
            'paginate': VuejsPaginate
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
                listState: {
                    SALES_CODE: null,
                    SALES_DAY: null,
                    CUSTOMER_CODE: null
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
            }
        },
        mounted () {
            this.node.root = this.$parent.$refs['list-panel']
            this.node.header = this.$refs['list-header']
            this.node.footer = this.$refs['list-footer']
            this.node.body = this.$refs['list-body']
            this.node.bodyTitle = this.node.body.querySelector('.tit-area')
            this.node.bodyList = this.node.body.querySelector('.scr-area')

            window.addEventListener("resize", this.debounce(this.doResizeRender))

            this.doResizeRender()
            this.doListLoad()
        },
        methods: {
            // 리스트 엘리먼트 높이 리사이징
            doResizeRender () {
                const getNode = this.node
                const GET_ROOT_H = getNode.root.clientHeight

                if (GET_ROOT_H < 300) {
                    return false
                }
                const GET_HEADER_H = getNode.header.clientHeight
                const GET_FOOTER_H = getNode.footer.clientHeight
                const GET_TARGET = getNode.body

                // 초기 높이 값 세팅
                GET_TARGET.style.height = `${GET_ROOT_H - GET_HEADER_H - GET_FOOTER_H - 20}px`

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
            async doListLoad () {
                const postData = {
                    start_day: this.getFormatTime(this.model.startDay),
                    end_day: this.getFormatTime(this.model.endDay),
                    customer_code: this.model.customer.CUSTOMER_CODE,
                    member_code: this.model.member.code,
                    offset: (this.listModel.page - 1) * this.listModel.max,
                    max: this.listModel.max
                }

                this.isLoading = true
                const loader = this.$loading.show({
                    container: this.$el,
                    canCancel: false
                })

                const getSummary = await this.doSummaryLoad(postData)
                _merge(this.getSalesSummary, getSummary)

                sales.fetch(postData).then((data) => {
                    let getTotal = (data.total === 0) ? 1 : data.total
                    getTotal = getTotal / this.listModel.max

                    this.listModel.total = getTotal
                    this.listModel.data = data.list

                    this.isLoading = false
                    loader.hide()

                    const getScrollNode = this.node.bodyList
                    this.scrollTo(getScrollNode, getScrollNode.scrollTop, 0, 300, 0)
                }).catch((err) => {
                    this.isLoading = false
                    loader.hide()

                    this.$snotify.error('매출목록 조회 실패', this.parseErrorMsg(err))
                })
            },

            chkMatchListState (item) {
                const matchObj = {
                    SALES_CODE: item.SALES_CODE,
                    SALES_DAY: item.SALES_DAY,
                    CUSTOMER_CODE: item.CUSTOMER_CODE
                }
                return _match(this.listState, matchObj)
            },

            // 매출 합계 추가 조회
            doSummaryLoad (postData) {
                return sales.fetchSummary(postData).then((data) => data).catch((err) => {
                    this.$snotify.error('매출목록집계 조회 실패', this.parseErrorMsg(err))
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

            /**
             * 조회 된 매출목록의 ROW 클릭 시 원장 및 데이터 조회
             * @param obj
             */
            getLoadData (e, obj) {
                let GET_ROW = e.target.parentNode
                let GET_SIBLINGS = this.getSiblings(GET_ROW)

                // 형제 ROW들의 on 클래스 제거
                GET_SIBLINGS.forEach((e) => {
                    e.classList.remove('on')
                })
                // 현재 ROW에 on 클래스 추가
                GET_ROW.classList.add('on')

                // 리스트 상태 값 저장 (페이지 이동 시)
                this.listState.SALES_CODE = obj.SALES_CODE
                this.listState.SALES_DAY = obj.SALES_DAY
                this.listState.CUSTOMER_CODE = obj.CUSTOMER_CODE

                const postLedgerData = {
                    customer_code: obj.CUSTOMER_CODE,
                    customer_name: obj.CUSTOMER_NAME,
                    start_day: this.getFormatTime(this.model.startDay),
                    end_day: this.getFormatTime(this.model.endDay)
                }

                // 매출 원장 조회
                this.$parent.$refs['sales-ledger'].getSalesLedger(postLedgerData)
            },

            getSiblings (n) {
                return [...n.parentElement.children].filter(c => c != n)
            },

            goExcel () {

            },

            goPrint () {

            }
        }
    }
</script>

<style scoped>

</style>
