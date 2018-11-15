<template>
    <card class="mb-0">
        <div slot="header">
            <h4 class="card-title d-inline-block">매출 거래명세서 이메일 발송</h4>
        </div>
        <div class="table-responsive">
            <form method="post" @submit="false" ref="senderForm">
                <table class="table table-bordered" style="table-layout:fixed;">
                    <colgroup>
                        <col width="80%">
                        <col width="20%">
                    </colgroup>
                    <thead>
                    <tr class="b1">
                        <th colspan="2">수신자(거래처) 이메일</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <div class="d-flex justify-content-between">
                                <input type="text" class="form-control mr-2" v-model="email1" ref="email1">
                                <select class="form-control" v-model="email2" @change="doCngFocus()" ref="email2">
                                    <option value="@naver.com">@naver.com</option>
                                    <option value="@hanmail.net">@hanmail.net</option>
                                    <option value="@daum.net">@daum.net</option>
                                    <option value="@nate.com">@nate.com</option>
                                    <option value="@gmail.com">@gmail.com</option>
                                    <option value="@esero.go.kr">@esero.go.kr</option>
                                    <option value="@hometax.go.kr">@hometax.go.kr</option>
                                    <option value="@empas.com">@empas.com</option>
                                    <option value="@korea.com">@korea.com</option>
                                    <option value="@hotmail.com">@hotmail.com</option>
                                    <option value="">직접입력</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <label>
                                <input type="checkbox" value="Y" v-model="saveDiv">&nbsp;저장
                            </label>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div class="mt-3 text-right" v-if="$slots.footer">
            <button class="btn btn-primary mr-2" @click="doSend()">이메일발송</button>
            <slot name="footer"></slot>
        </div>
    </card>
</template>

<script>
    import {mapState} from 'vuex'
    import {SETTINGS, customer, sales} from '../../api/index'
    import Common from '../mixin/common'

    export default {
        name: 'PopSalesReportEmail',
        mixins: [Common],
        props: {
            state: Object
        },
        data () {
            return {
                isInit: false,
                isLoading: false,

                printDiv: this.state.report.div,
                printType: this.state.report.type,

                email1: '',
                email2: '@naver.com',
                saveDiv: false
            }
        },
        watch: {
            'state': {
                handler (val, oldVal) {
                    this.doGetCustomerEmail(val)
                },
                deep: true
            }
        },
        computed: {
            ...mapState([
                'AGENT_NO',
                'AGENT_SETTINGS',
                'PRINT_SETTINGS'
            ])
        },
        mounted () {
            this.doGetCustomerEmail(this.state.model.CUSTOMER_CODE)
        },
        methods: {
            doSend () {
                const PARAM = this.printDiv
                const TYPE_PARAM = this.printType
                const GET_INPUT_EMAIL = this.email1 + this.email2
                if (!this.doChkEmail(GET_INPUT_EMAIL)) {
                    this.$snotify.error('이메일을 다시 입력해 주세요.', '잘못된 형식')
                    this.$refs.email1.focus()
                    return
                }

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
                const GET_SAVE_DIV = this.saveDiv

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

                let ACTION_URL = `${SETTINGS.DOMAIN_LIVE}/api/v1/report/sales/${SET_ROW_CNT}/${this.AGENT_NO}/${GET_CUSTOMER_CODE}/${GET_SALES_DAY}/${GET_SALES_CODE}/jasper`

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
                ACTION_URL += `&is_send_email=true`
                ACTION_URL += `&customer_email=${GET_INPUT_EMAIL}`

                // 저장 체크 구분에 따른 파라메터 추가
                if(GET_SAVE_DIV){
                    ACTION_URL += '&is_update_customer_email=true'
                }

                const loader = this.$loading.show({
                    container: self.$el,
                    canCancel: false
                })

                sales.sendEmail(ACTION_URL).then((data) => {
                    if (data === 'OK') {
                        this.$snotify.success('명세서가 발송되었습니다.', '발송 완료.')
                        this.$root.$emit('bv::hide::modal', 'pop-send-email')
                    }
                    loader.hide()
                }).catch((err) => {
                    this.$snotify.error('명세서 이메일 발송 실패', this.$common.parseErrorMsg(err))
                    loader.hide()
                })
            },

            doCngFocus () {
                if (this.email2 !== '') return
                this.$refs.email1.focus()
            },

            doChkEmail (s) {
                const re = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*$")

                return re.test(s)
            },

            // 해당 거래처의 이메일 조회
            doGetCustomerEmail (PARAM) {
                customer.fetchTarget({
                    CODE: PARAM
                }).then((data) => {
                    this.doSetEmail(data.EMAIL)
                }).catch((err) => {
                    this.$snotify.error('거래처 이메일 조회 실패', this.$common.parseErrorMsg(err))
                })
            },

            // 조회해온 EMAIL을 DATA에 바인딩
            doSetEmail (EMAIL) {
                if (!EMAIL || EMAIL === '') {
                    this.saveDiv = 'N'
                } else {
                    this.saveDiv = 'Y'
                }

                if (!this.doChkEmail(EMAIL)) {
                    this.email1 = EMAIL
                    this.email2 = ''
                } else {
                    let ARR_EMAIL = EMAIL.split('@')
                    this.email1 = ARR_EMAIL[0]

                    let isCng = false
                    this.$refs.email2.querySelectorAll('option').forEach((e) => {
                        if (e.value === `@${ARR_EMAIL[1]}`) {
                            isCng = true

                            this.email2 = `@${ARR_EMAIL[1]}`
                        }
                    })

                    if (!isCng) {
                        this.email1 = this.email1 + `@${ARR_EMAIL[1]}`
                        this.email2 = ''
                    }
                }
            }
        }
    }
</script>

<style scoped>

</style>
