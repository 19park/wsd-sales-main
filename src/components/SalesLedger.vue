<template>
    <b-card no-body>
        <b-card-header id="ledger-header" ref="ledger-header">
            <strong class="mr-3">원장</strong>
            <span>* 매출&매입 거래처는 최종 잔고만 표시됩니다.</span>
        </b-card-header>
        <b-card-body id="ledger-body" ref="ledger-body" class="p-0">
            <div class="d-flex flex-column h-100">
                <div class="tit-area">
                    <table class="table table-bordered mb-0"
                           style="table-layout:fixed;">
                        <colgroup>
                            <col width="18%">
                            <col width="20%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                            <col width="18%">
                        </colgroup>
                        <thead>
                        <tr bgcolor="d9edf7">
                            <th class="text-left">일자</th>
                            <th>매출</th>
                            <th>DC</th>
                            <th>수금</th>
                            <th>할인</th>
                            <th>잔고</th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="scr-area flex-fill">
                    <div v-if="!model.list.length"
                         class="text-center py-3">
                        조회결과가 없습니다.
                    </div>
                    <table v-else
                           class="table table-bordered mb-0"
                           style="table-layout:fixed;">
                        <colgroup>
                            <col width="18%">
                            <col width="20%">
                            <col width="15%">
                            <col width="15%">
                            <col width="15%">
                            <col width="18%">
                        </colgroup>
                        <tbody class="list-area" id="list-wrap">
                        <tr v-for="item in model.list"
                            :class="{'list-item':(item.TYPE === 'DAILY')}"
                            :bgcolor="(item.TYPE === 'DAILY')?'':'#BEFFBD'">
                            <td class="text-left">{{getTypeFormat(item)}}</td>
                            <td>{{formatComma(item.SALES)}}</td>
                            <td>{{formatComma(item.SALES_DISCOUNT)}}</td>
                            <td>{{formatComma(item.COLLECT)}}</td>
                            <td>{{formatComma(item.COLLECT_DISCOUNT)}}</td>
                            <td>
                                {{(typeof item.BALANCE === 'number') ? formatComma(item.BALANCE) : ''}}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </b-card-body>
        <b-card-footer id="ledger-footer" ref="ledger-footer">
            <strong v-if="model.customer.name">
                거래처명 : {{model.customer.name}}
            </strong>
            <p v-else>
                매출목록을 선택해주세요.
            </p>
        </b-card-footer>
    </b-card>
</template>

<script>
    import {sales} from '../api/index'
    import Common from './mixin/common'
    import numeral from 'numeral'

    export default {
        name: "SalesLedger",
        mixins: [Common],
        data () {
            return {
                isLoading: false,
                model: {
                    customer: {
                        name: null
                    },
                    list: []
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
        mounted () {
            this.node.root = this.$parent.$refs['list-panel']
            this.node.header = this.$refs['ledger-header']
            this.node.footer = this.$refs['ledger-footer']
            this.node.body = this.$refs['ledger-body']
            this.node.bodyTitle = this.node.body.querySelector('.tit-area')
            this.node.bodyList = this.node.body.querySelector('.scr-area')

            window.addEventListener("resize", this.debounce(this.doResizeRender))

            this.doResizeRender()
        },
        methods: {
            // 리스트 엘리먼트 높이 리사이징
            doResizeRender () {
                const getNode = this.node
                const GET_ROOT_H = getNode.root.clientHeight

                if(GET_ROOT_H < 300) { return false }
                const GET_HEADER_H = getNode.header.clientHeight
                const GET_FOOTER_H = getNode.footer.clientHeight
                const GET_TARGET = getNode.body

                // 초기 높이 값 세팅
                GET_TARGET.style.height = `${GET_ROOT_H-GET_HEADER_H-GET_FOOTER_H-20}px`

                const GET_SCROLL_ELEM = getNode.bodyList
                const scrollBarWidth = GET_SCROLL_ELEM.offsetWidth - GET_SCROLL_ELEM.clientWidth;
                getNode.bodyTitle.style.paddingRight = `${scrollBarWidth}px`
            },

            /**
             * 매출 원장 조회
             * @param postData
             * 매출 목록에서 클릭한 ROW 의
             * 거래처코드, 조회 시작&종료일을 객체로 받음
             */
            getSalesLedger (postData) {
                this.isLoading = true
                const loader = this.$loading.show({
                    container: this.$el,
                    canCancel: false
                })

                this.model.customer.name = postData.customer_name
                delete postData.customer_name

                sales.fetchLedger(postData).then((data) => {
                    this.model.list = data.list

                    this.isLoading = false
                    loader.hide()
                }).catch((err) => {
                    this.isLoading = false
                    loader.hide()

                    this.$snotify.error('매출원장 조회 실패', this.parseErrorMsg(err))
                })
            },

            // ROW 별 타입을 받아서 한글로 리턴
            getTypeFormat (obj) {
                let retMsg = ''
                switch (obj.TYPE) {
                    case 'BEFORE_BALANCE':
                        retMsg = '이월잔고'
                        break
                    case 'DAILY':
                        retMsg = obj.DAY
                        break
                    case 'MONTHLY':
                        retMsg = '[월  계]'
                        break
                    case 'LAST_SUM':
                        retMsg = '[합  계]'
                        break
                }

                return retMsg
            },

            formatComma (n) {
                return numeral(n).format()
            }
        }
    }
</script>

<style scoped>

</style>
