<template>
    <div class="box" :class="wrapClasses">
        <label :class="labelClasses">{{ label?label:'창고' }} : </label>
        <b-form-select v-model="model.code"
                       :options="options"
                       class="d-inline-block w-auto align-bottom"
                       @keydown.enter.native="doNextAct">
        </b-form-select>
    </div>
</template>

<script>
    import {warehouses} from '../../api/index'
    import Common from '../mixin/common'

    export default {
        name: "WarehousePicker",
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
        mounted () {
            const postData = {
                member_code: this.$store.state.USER_CODE,
                deleted: false
            }
            warehouses.fetch(postData).then((data)=>{
                let resCnt = data.list.length
                if (resCnt <= 0) {
                    this.options = [
                        { value: null, text: '창고없음' }
                    ]
                } else {
                    // 유형초기화
                    this.options = []
                    data.list.forEach((e, i)=>{
                        if(i===0) this.model.code = e.WAREHOUSE_CODE
                        this.options.push({
                            value: e.WAREHOUSE_CODE,
                            text: `${e.WAREHOUSE_CODE} : ${e.WAREHOUSE_NAME}`
                        })
                    })
                }
            }).catch((err) => {
                this.options = [
                    { value: null, text: '로딩 실패' }
                ]
                this.$snotify.error('창고목록 조회 실패', this.$common.parseErrorMsg(err))
            })
        },
        methods: {
            doNextAct () {
                this.$emit('nextAct')
            }
        }
    }
</script>

<style scoped>

</style>
