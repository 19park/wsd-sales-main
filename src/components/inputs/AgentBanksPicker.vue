<template>
    <div class="d-inline-block" :class="wrapClasses">
        <label :class="labelClasses">{{ label?label:'입금계좌' }} : </label>
        <b-form-select v-model="model.REG_NO"
                       :options="options"
                       class="d-inline-block w-auto align-bottom">
        </b-form-select>
    </div>
</template>

<script>
    import {agent} from '../../api/index'
    import Common from '../mixin/common'

    export default {
        name: "AgentBanksPicker",
        mixins: [Common],
        props: {
            label: String,
            model: Object,
            labelClasses: String,
            wrapClasses: String
        },
        data () {
            return {
                options: [
                    { value: null, text: '로딩 중..' }
                ]
            }
        },
        watch: {
            // 은행 값 없는 값 감지 후 null 초기화
            'model': {
                handler (val, oldVal) {
                    let isExist = false
                    this.options.forEach((e)=>{
                        if(e.value === val.REG_NO) isExist = true
                    })
                    if(!isExist) this.model.REG_NO = null
                },
                deep: true
            }
        },
        mounted () {
            agent.fetchBank().then((data)=>{
                let resCnt = data.list.length
                if (resCnt <= 0) {
                    this.options = [
                        { value: null, text: '계좌없음' }
                    ]
                } else {
                    // 유형초기화
                    this.options = [
                        { value: null, text: '선택' }
                    ]
                    data.list.forEach((e, i)=>{
                        this.options.push({
                            value: e.REG_NO,
                            text: `${e.BANK_NAME} / ${e.BANK_AC_NO} / ${e.BANK_AC_NAME}`
                        })
                    })
                }
            }).catch((err) => {
                this.options = [
                    { value: null, text: '로딩 실패' }
                ]
                this.$snotify.error('계좌 조회 실패', this.parseErrorMsg(err))
            })
        }
    }
</script>

<style scoped>

</style>
