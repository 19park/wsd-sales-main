<template>
    <div class="box" :class="wrapClasses">
        <label :class="labelClasses">{{ label?label:'담당자' }} : </label>
        <b-form-select v-model="model.code"
                       :options="options"
                       :disabled="disabled"
                       class="d-inline-block w-auto align-bottom">
        </b-form-select>
    </div>
</template>

<script>
    import {member} from '../../api/index'
    import Common from '../mixin/common'

    export default {
        name: "EmployeePicker",
        mixins: [Common],
        props: {
            label: String,
            model: Object,
            labelClasses: String,
            wrapClasses: String,
            disabled: Boolean,
            // isRetire: Boolean, // 조회 시 퇴사여부
            // isDeleted: Boolean // 조회 시 삭제여부
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
                retire: false
            }
            member.fetch(postData).then((data)=>{
                let resCnt = data.list.length
                if (resCnt <= 0) {
                    this.options = [
                        { value: null, text: '담당자없음' }
                    ]
                } else {
                    // 유형초기화
                    this.options = [
                        { value: null, text: '선택' }
                    ]
                    data.list.forEach((e, i)=>{
                        this.options.push({
                            value: e.MEMBER_CODE,
                            name: e.M_NAME,
                            text: `${e.MEMBER_CODE} : ${e.M_NAME}`
                        })
                    })

                    this.$store.state.AGENT_MEMBER_LIST = this.options
                }
            }).catch((err) => {
                this.options = [
                    { value: null, text: '로딩 실패' }
                ]
                this.$snotify.error('담당자목록 조회 실패', this.parseErrorMsg(err))
            })
        }
    }
</script>

<style scoped>

</style>
