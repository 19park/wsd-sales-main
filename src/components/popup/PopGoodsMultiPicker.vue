<!--suppress HtmlUnknownAttribute -->
<template>
    <card class="mb-0">
        <div slot="header">
            <h4 class="card-title d-inline-block">{{getPopName}}</h4>
        </div>
        <div class="box mb-3">
            <b-input-group>
                <b-form-input v-model="postData.keyword"
                              ref="keyword"
                              placeholder="검색어를 입력해주세요"
                              @keyup.enter.native="fnGetData">
                </b-form-input>
                <b-input-group-button>
                    <b-btn variant="outline-success" @click="fnGetData">
                        <font-awesome-icon icon="search"/>
                    </b-btn>
                </b-input-group-button>
            </b-input-group>
        </div>
        <div id="loader-container">
            <ResultTable :hotOptions="hotOptions"
                         ref="chkListTable"
                         @addLoad="doSearch"
                         @rowClick="fnProdClick"
                         @chkClick="fnProdChkClick"/>
        </div>
        <div class="mt-3 text-right clearfix">
            <button class="btn btn-outline-dark float-left" @click="doCheckAll">전체선택</button>
            <button class="btn btn-success" @click="doClickComp">선택완료</button>
            <slot name="footer" v-if="$slots.footer">
            </slot>
        </div>
    </card>
</template>

<script>
    import {goods} from '../../api/index'
    import Common from '../mixin/common'
    import alert from '../mixin/alert'

    import ResultTable from './ResultTableChk.vue'
    import CustomerTypePicker from '../inputs/CustomerTypePicker.vue'

    export default {
        name: 'PopGoodsMultiPicker',
        mixins: [Common, alert],
        props: {
            isDup: Boolean,
            salesDay: String,
            customerCode: String,
            memberCode: String,
            warehouseCode: String
        },
        components: {
            ResultTable,
            CustomerTypePicker
        },
        data () {
            return {
                isInit: false,
                isLoading: false,
                hotOptions: {
                    init: false,
                    data: [],
                    model: {
                        CHECKED: false,
                        HISTORY: null,
                        PRODUCT: {},
                        PURCHASE_PPU: null,
                        SALES_PPU: null,
                        STOCK: null
                    },
                    colWidths: [
                        30, 70, 130, 100, 100, 80, 80
                    ],
                    colHeaders: [
                        '', '코드', '상품명', '규격', '바코드', '입고단가', '현재고'
                    ],
                    columns: [
                        {data: 'CHECKED', type: 'checkbox', className: 'htCenter htMiddle'},
                        {data: 'PRODUCT.VIEW_CODE', type: 'text', readOnly: true},
                        {data: 'PRODUCT.PRODUCT_NAME', type: 'text', readOnly: true},
                        {data: 'PRODUCT.STANDARD', type: 'text', readOnly: true},
                        {data: 'PIECE_BARCODE', type: 'text', readOnly: true},
                        {data: 'PURCHASE_PPU', type: 'text', readOnly: true},
                        {
                            data: 'STOCK',
                            type: 'numeric',
                            numericFormat: {pattern: '0,0[00]'},
                            readOnly: true
                        }
                    ]
                },
                fetchState: null,
                fetchText: {
                    noResults: '조회결과가 없습니다.',
                    noMore: '모든 거래처를 조회했습니다.',
                    error: '조회에 실패하였습니다.'
                },
                postData: {
                    sales_day: this.getFormatTime(this.salesDay),
                    customer_code: this.customerCode,
                    member_code: this.memberCode,
                    warehouse_code: this.warehouseCode,
                    history: (this.isDup) ? true : null,
                    deleted: false,
                    product_type1: null,
                    keyword: '',
                    offset: 0,
                    max: 25
                }
            }
        },
        computed: {
            getPostData () {
                //this.postData.customer_type1 = this.$refs['customer-type'].value
                return this.postData
            },
            getPopName () {
                return (this.isDup) ? '납품분조회' : '상품조회'
            }
        },
        methods: {
            fnProdClick (row) {
                this.$emit('get-data', [row])
            },
            fnProdChkClick (arr) {
                if (!arr.length) {
                    this.showCommonAlert('상품을 1개이상 선택해주세요.')
                    return
                }

                this.$emit('get-data', arr)
            },
            fnGetData () {
                // 조회상태 초기화
                this.fetchState = null

                // 데이터 초기화
                this.hotOptions.init = false
                this.hotOptions.data = []

                // 페이지 정보 초기화
                this.postData.page = 1
                this.postData.offset = 0
                this.doSearch()
            },
            doSearch () {
                if (this.fetchState) return
                if (this.isLoading) return

                this.isLoading = true
                const loader = this.$loading.show({
                    // Optional parameters
                    container: this.$el,
                    canCancel: false,
                    // onCancel: this.onCancel,
                })

                const postData = this.getPostData
                goods.fetch(postData).then((data) => {
                    console.log("#################### 상품정보 조회 ###################", data)

                    let resCnt = data.list.length
                    if (resCnt <= 0) {
                        this.fetchState = 'noResults'
                        this.$toasted.show(this.fetchText.noResults)
                    } else {
                        // CHECKED FALSE PROP ADD
                        data.list.forEach((e, i) => {
                            e.CHECKED = false
                        })
                        this.hotOptions.data = this.hotOptions.data.concat(data.list)
                        this.postData.offset = postData.offset + postData.max
                        if (resCnt < postData.max) {
                            this.fetchState = 'noMore'
                            this.$toasted.show(this.fetchText.noMore)
                        } else {
                            this.fetchState = null
                        }
                    }

                    this.isLoading = false
                    loader.hide()

                    if (!this.isInit) {
                        this.isInit = true
                        // this.$refs.keyword.$el.focus()
                    }
                }).catch((err) => {
                    this.isLoading = false
                    loader.hide()

                    this.$snotify.error('상품 목록 조회 실패', this.parseErrorMsg(err))
                })
            },
            doClickComp () {
                // 선택 상품 추가
                this.$refs.chkListTable.doChkComp()
            },
            doCheckAll () {
                // 상품 전체 선택
                this.$refs.chkListTable.doChkAll()
            }
        },
        mounted () {
            // input focus
            setTimeout(() => {
                this.$refs.keyword.$el.focus()
            }, 300)
        }
    }
</script>

<style scoped>
    #loader-container {
        height: 400px;
        overflow: auto;
    }
</style>
