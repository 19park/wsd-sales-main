<template>
    <div class="d-inline-block" :class="wrapClasses">
        <label :class="labelClasses">{{ label?label:'카드선택' }} : </label>
        <b-form-select v-model="model.REG_NO"
                       :options="options"
                       class="d-inline-block w-auto align-bottom">
        </b-form-select>
    </div>
</template>

<script>
    import {agent} from '../../api/index'

    export default {
        name: "AgentCardsPicker",
        props: {
            label: String,
            model: Object,
            labelClasses: String,
            wrapClasses: String
        },
        data () {
            return {
                value: null,
                options: [
                    { value: null, text: '카드없음' }
                ]
            }
        },
        mounted () {
            agent.fetchBank().then((data)=>{
                let resCnt = data.list.length
                if (resCnt <= 0) {
                    this.options = [
                        { value: null, text: '카드없음' }
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
                this.$snotify.error('카드 조회 실패', this.$common.parseErrorMsg(err))
            })
        }
    }
</script>

<style scoped>

</style>
