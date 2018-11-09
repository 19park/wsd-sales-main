<template>
    <div class="d-inline-block" :class="wrapClasses">
        <!--<label :class="labelClasses">{{ label?label:'유형' }} : </label>-->
        <b-form-select v-model="value" :options="options">
        </b-form-select>
    </div>
</template>

<script>
    import {customer} from '../../api/index'
    import Common from '../mixin/common'

    export default {
        name: "CustomerTypePicker",
        mixins: [Common],
        props: {
            label: String,
            labelClasses: String,
            wrapClasses: String
        },
        data () {
            return {
                value: null,
                options: [
                    { value: null, text: '로딩 중..' }
                ]
            }
        },
        mounted () {
            customer.fetchTypes().then((data)=>{
                let resCnt = data.list.length
                if (resCnt <= 0) {
                    this.options = [
                        { value: null, text: '유형없음' }
                    ]
                } else {
                    // 유형초기화
                    this.options = [
                        { value: null, text: '전체' }
                    ]
                    data.list.forEach((e, i)=>{
                        this.options.push({
                            value: e.TYPE_CODE,
                            text: `${e.TYPE_CODE} : ${e.TYPE_NAME}`
                        })
                    })
                }
            }).catch((err) => {
                this.options = [
                    { value: null, text: '로딩 실패' }
                ]
                this.$snotify.error('거래처 유형 조회 실패', this.parseErrorMsg(err))
            })
        }
    }
</script>

<style scoped>

</style>
