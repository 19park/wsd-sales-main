<template>
    <card class="mb-0">
        <div slot="header">
            <h4 class="card-title d-inline-block">{{(isBatch)?'명세서 일괄인쇄 선택':'명세서인쇄 선택'}}</h4>
        </div>
        <b-alert variant="danger" v-if="isBatch" show>명세서와 상품 수에 따라서 최대 5분 소요됩니다.</b-alert>

        <div class="select-area">
            <b-alert v-if="isBatch" show>
                <div class="sort_area d-flex align-items-center">
                    <strong class="mr-3">재발행 포함 여부</strong>
                    <label for="re_print1"><input type="radio" id="re_print1" value="Y" v-model="isRePrint">포함</label>
                    <label for="re_print2"><input type="radio" id="re_print2" value="N" v-model="isRePrint">미포함</label>
                </div>
            </b-alert>

            <div class="sort_area d-flex align-items-center">
                <strong class="mr-3">정렬</strong>
                <label for="sort1"><input type="radio" id="sort1" value="1" v-model="PRINT_SETTINGS.SALES_PRINT_ORDER">입력순서</label>
                <label for="sort2"><input type="radio" id="sort2" value="2" v-model="PRINT_SETTINGS.SALES_PRINT_ORDER">조회번호</label>
            </div>
            <div class="sort_area d-flex align-items-center">
                <strong class="mr-3">금액</strong>
                <label for="view1_1"><input type="radio" id="view1_1" value="1"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_PRICE">출력</label>
                <label for="view1_2"><input type="radio" id="view1_2" value="2"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_PRICE">미출력</label>
            </div>
            <div class="sort_area d-flex align-items-center">
                <strong class="mr-3">단가</strong>
                <label for="view2_1"><input type="radio" id="view2_1" value="1"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_PPU">출력</label>
                <label for="view2_2"><input type="radio" id="view2_2" value="2"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_PPU">미출력</label>
            </div>
            <div class="sort_area d-flex align-items-center">
                <strong class="mr-3">잔고</strong>
                <label for="view4_1"><input type="radio" id="view4_1" value="1"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_BALANCE">출력</label>
                <label for="view4_2"><input type="radio" id="view4_2" value="2"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_BALANCE">미출력</label>
            </div>
            <div class="sort_area d-flex align-items-center">
                <strong class="mr-3">반전</strong>
                <label for="view5_1"><input type="radio" id="view5_1" value="1"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_REVERSE">예</label>
                <label for="view5_2"><input type="radio" id="view5_2" value="2"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_REVERSE">아니오</label>
            </div>
            <div class="sort_area d-flex align-items-center" v-if="AGENT_SETTINGS.AMOUNT_DIV === '2'">
                <strong class="mr-3">박스단가 출력 여부</strong>
                <label for="view6_1"><input type="radio" id="view6_1" value="1"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_BOX_PPU">예</label>
                <label for="view6_2"><input type="radio" id="view6_2" value="2"
                                            v-model="PRINT_SETTINGS.SALES_PRINT_BOX_PPU">아니오</label>
            </div>
        </div>
        <div class="type-area">
            <hr class="my-3"/>
            <table class="table b-table table-bordered" style="margin:0 auto;">
                <colgroup>
                    <col width="25%"/>
                    <col width="25%"/>
                    <col width="25%"/>
                    <col width="25%"/>
                </colgroup>
                <thead>
                <tr class="b1" align="center">
                    <th>리스트 10개</th>
                    <th>리스트 15개</th>
                    <th>두장 인쇄</th>
                    <th>바코드 인쇄</th>
                </tr>
                </thead>
                <tbody>
                <tr class="b1" align="center" height="150">
                    <td><img src="http://www.wholedoc.net/pages/Sales/images/one10.jpg" width="100%"></td>
                    <td><img src="http://www.wholedoc.net/pages/Sales/images/one15.jpg" width="100%"></td>
                    <td><img src="http://www.wholedoc.net/pages/Sales/images/two.jpg" width="100%"></td>
                    <td><img src="http://www.wholedoc.net/pages/Sales/images/thr.jpg" width="100%"></td>
                </tr>
                <tr align="center" valign="top">
                    <td>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(1,'BOTH')">모두 인쇄</button>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(1,'CUSTOMER')">공급받는자용</button>
                        <button class="btn btn-primary btn-block" @click="doSendMail(1,'BOTH')" v-if="!isBatch">이메일 발송
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(4,'BOTH')">모두 인쇄</button>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(4,'CUSTOMER')">공급받는자용</button>
                        <button class="btn btn-primary btn-block" @click="doSendMail(4,'BOTH')" v-if="!isBatch">이메일 발송
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(2,'BOTH')">모두 인쇄</button>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(2,'CUSTOMER')">공급받는자용</button>
                        <button class="btn btn-primary btn-block" @click="doSendMail(2,'BOTH')" v-if="!isBatch">이메일 발송
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(3,'BOTH')">바코드 인쇄</button>
                        <button class="btn btn-success btn-block mb-1" @click="doPrint(3,'CUSTOMER')">공급받는자용</button>
                        <button class="btn btn-primary btn-block" @click="doSendMail(3,'BOTH')" v-if="!isBatch">이메일 발송
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <div class="support-area my-4" v-if="!isBatch">
            <a href="javascript:void(0)" @click="doOpenSupport('chromeGuide.asp', 'chromeGuide')">※ 크롬에서 인쇄환경 설정방법</a>
            <a href="javascript:void(0)" @click="doOpenSupport('printGuide.asp', 'printGuide')">※ 인쇄가 안될경우</a>
            <a href="javascript:void(0)" @click="doOpenSupport('barcodeGuide.asp', 'barcodeGuide')">※ 바코드인쇄가 안될경우</a>
            <a href="javascript:void(0)" @click="doOpenSupport('pdfGuide.asp', 'pdfGuide')">※ PDF로 인쇄 할 경우</a>
        </div>
        <div class="mt-3 text-right" v-if="$slots.footer">
            <slot name="footer"></slot>
        </div>
    </card>
</template>

<script>
    import {mapState} from 'vuex'
    import {SETTINGS, agent, sales} from '../../api/index'
    import Common from '../mixin/common'

    export default {
        name: 'PopSalesReport',
        mixins: [Common],
        props: {
            state: Object,
            isBatch: Boolean
        },
        data () {
            return {
                isInit: false,
                isLoading: false,
                isRePrint: 'N'
            }
        },
        computed: {
            ...mapState([
                'AGENT_NO',
                'AGENT_SETTINGS',
                'PRINT_SETTINGS'
            ])
        },
        methods: {
            doOpenSupport (p, n) {
                window.open(
                    `http://www.wholedoc.net/pages/Sales/${p}`, n,
                    'left=20,top=20,width=700,height=600,scrollbars=yes,toolbar=no,menubar=no'
                )
            },

            doPrint (PARAM, TYPE_PARAM) {
                const _P = this.PRINT_SETTINGS
                const TYPE = _P.SALES_PRINT_ORDER
                const DIV1 = _P.SALES_PRINT_PRICE
                const DIV2 = _P.SALES_PRINT_PPU
                const DIV3 = _P.STAX_PRINT
                const DIV4 = _P.SALES_PRINT_BALANCE
                const DIV5 = _P.SALES_PRINT_REVERSE
                const DIV6 = _P.SALES_PRINT_BOX_PPU
                const DIV_CHK_TXT = TYPE + DIV1 + DIV2 + DIV3 + DIV4 + DIV5 + DIV6

                const GET_CUSTOMER_CODE = this.state.model.CUSTOMER_CODE
                const GET_SALES_DAY = this.state.model.SALES_DAY
                const GET_SALES_CODE = this.state.model.SALES_CODE
                const GET_SLIP_YN = this.state.isPrint

                /**
                 * 일괄 인쇄 시 별도 처리
                 */
                let MAKE_POST_DATA = []

                if (this.isBatch) {
                    const GET_REPRINT_YN = this.isRePrint
                    const GET_LIST_DATA = this.$salesList().listModel.data

                    // 일괄 시 넘길 데이터를 배열로 push 생성
                    GET_LIST_DATA.forEach((e) => {
                        if (GET_REPRINT_YN === 'Y') {
                            MAKE_POST_DATA.push({
                                sales_day: e.SALES_DAY,
                                sales_code: e.SALES_CODE,
                                customer_code: e.CUSTOMER_CODE
                            })
                        } else {
                            if (!e.SLIP_YN) {
                                MAKE_POST_DATA.push({
                                    sales_day: e.SALES_DAY,
                                    sales_code: e.SALES_CODE,
                                    customer_code: e.CUSTOMER_CODE
                                })
                            }
                        }
                    })

                    if (MAKE_POST_DATA.length < 1) {
                        this.$snotify.error('일괄 인쇄 할 데이터가 없습니다.', '데이터 없음')
                        return
                    }
                }

                let SET_ROW_CNT = "10"
                switch (PARAM) {
                    case 1://10줄
                        SET_ROW_CNT = "10"
                        break
                    case 4://15줄
                        SET_ROW_CNT = "15"
                        break
                    case 2://한장
                        SET_ROW_CNT = "30"
                        break
                    case 3://바코드
                        SET_ROW_CNT = "30bar"
                        break
                    case 5://공급자
                        SET_ROW_CNT = "10"
                        break
                }

                let ACTION_URL = ''

                // 일괄인쇄는 URL에 매출정보를 붙이지 않음
                if (this.isBatch) {
                    ACTION_URL = `${SETTINGS.DOMAIN_LIVE}/api/v1/report/sales/${SET_ROW_CNT}/${this.AGENT_NO}/jaspers`
                } else {
                    ACTION_URL = `${SETTINGS.DOMAIN_LIVE}/api/v1/report/sales/${SET_ROW_CNT}/${this.AGENT_NO}/${GET_CUSTOMER_CODE}/${GET_SALES_DAY}/${GET_SALES_CODE}/jasper`
                }

                if (TYPE === "1") {
                    ACTION_URL += "?sales_order=REG_NO"
                } else {
                    ACTION_URL += "?sales_order=INQ_ORD"
                }

                if (DIV1 === "1") {//금액
                    ACTION_URL += "&is_print_price=true"
                } else {
                    ACTION_URL += "&is_print_price=false"
                }

                if (DIV2 === "1") {//단가
                    ACTION_URL += "&is_print_ppu=true"
                } else {
                    ACTION_URL += "&is_print_ppu=false"
                }

                if (DIV3 === "Y") {//부가세별도_출력
                    ACTION_URL += "&is_print_tax=true"
                } else {
                    ACTION_URL += "&is_print_tax=false"
                }

                if (DIV4 === "1") {//잔고
                    ACTION_URL += "&is_print_balance=true"
                } else {
                    ACTION_URL += "&is_print_balance=false"
                }

                if (DIV5 === "1") {//반전
                    ACTION_URL += "&is_reverse=true"
                }

                if (this.AGENT_SETTINGS.AMOUNT_DIV === '2') {
                    if (DIV6 === "1") { //박스단가 출력여부
                        ACTION_URL += "&is_print_box_ppu=true"
                    } else {
                        ACTION_URL += "&is_print_box_ppu=false"
                    }
                }

                ACTION_URL += `&print_gb=${TYPE_PARAM}`

                MAKE_POST_DATA = JSON.stringify(MAKE_POST_DATA)

                // 인쇄 api 호출
                this.fnGetPdfPrint(this, ACTION_URL, MAKE_POST_DATA)


                // 일괄 인쇄가 아닐 경우에만 처리
                if (!this.isBatch) {
                    //체크옵션과 기존옵션이 다르면 설정값 업데이트
                    if (DIV_CHK_TXT !== this.PRINT_SETTINGS.PRINT_CHECK_TXT) {
                        this.doPrintChkSave()
                    }

                    //명세서 출력값이 false 이면 true로 업데이트
                    if (!GET_SLIP_YN) {
                        this.doSlipUpt()
                    }
                }
            },

            doPrintChkSave () {
                const postData = {
                    ...this.PRINT_SETTINGS
                }

                agent.updatePrtOpts(postData).then((data) => data).catch((err) => {
                    this.$snotify.error('인쇄 옵션 업데이트 실패', this.$common.parseErrorMsg(err))
                })
            },

            doSlipUpt () {
                const getModel = this.state.model
                const postData = {
                    sales_day: getModel.SALES_DAY,
                    sales_code: getModel.SALES_CODE,
                    customer_code: getModel.CUSTOMER_CODE
                }

                sales.patchPrintComp(postData).then((data) => data).catch((err) => {
                    this.$snotify.error('인쇄 여부 업데이트 실패', this.$common.parseErrorMsg(err))
                })
            },

            // 이메일 발송 팝업
            doSendMail (PARAM, TYPE_PARAM) {
                this.state.report.div = PARAM
                this.state.report.type = TYPE_PARAM

                this.$nextTick(() => {
                    this.$root.$emit('bv::show::modal', 'pop-send-email')
                })
            }
        }
    }
</script>

<style>
    .select-area .sort_area {
        margin-bottom: 8px;
        font-size: 1.2rem;
    }

    .select-area .sort_area:last-child {
        margin-bottom: 0;
    }

    .select-area .sort_area label {
        margin: 0 10px 0 0;
        width: 80px;
    }

    .select-area .sort_area label input {
        position: relative;
        top: 2px;
        margin-right: 5px;
    }

    .type-area {
        overflow: auto;
    }

    .type-area hr {
        border: 0;
        border-top: 1px solid #eee;
    }
</style>
