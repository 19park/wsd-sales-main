import Vue from 'vue'
import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)

// noinspection JSCommentMatchesSignature
const alert = {
    data () {
        return {}
    },
    methods: {
        toHtml (text) {
            return text ? text.replace('\n', '<br>') : ''
        },
        /**
         * 일반적인 오류 alert
         * @param title 타이틀
         */
        showCommonAlert (title) {
            this.showAlertToQuestion('warning',
                title, null, '확인')
        },

        /**
         * 메시지 받아서 처리 하는 alert
         * @param positiveCallback 저장 이벤트 핸들러(함수)
         */
        showAlertToSaveWithMessage (message, positiveCallback) {
            this.showAlertToQuestion('question', // 질의
                message,                // 저장 확인 메시지
                null,
                '저장', // 저장 버튼
                positiveCallback, // 저장 이벤트 핸들러
                '취소') // 취소 버튼
        },

        /**
         * 저장 확인 alert
         * @param positiveCallback 저장 이벤트 핸들러(함수)
         */
        showAlertToSave (positiveCallback) {
            this.showAlertToQuestion('question', // 질의
                '확인', // 저장 확인 메시지
                null,
                '저장', // 저장 버튼
                positiveCallback, // 저장 이벤트 핸들러
                '취소') // 취소 버튼
        },
        /**
         * 수정 확인 alert
         * @param positiveCallback 수정 이밴트 핸들러(함수)
         */
        showAlertToUpdate (positiveCallback) {
            this.showAlertToQuestion('question', // 질의
                '확인', // 수정 확인 메시지
                null,
                '수정', // 수정 버튼
                positiveCallback, // 수정 이벤트 핸들러
                '취소') // 취소 버튼
        },
        /**
         * 삭제 확인 alert
         * @param positiveCallback 삭제 이벤트 핸들러(함수)
         */
        showAlertToDelete (positiveCallback) {
            this.showAlertToQuestion('question', // 질의
                '확인', // 삭제 확인 메시지
                null,
                '삭제', // 삭제 버튼
                positiveCallback, // 삭제 이벤트 핸들러
                '취소') // 취소 버튼
        },
        /**
         * 재시도 alert (재시도, 취소)
         * @param title 제목
         * @param message 내용
         * @param positiveCallback 긍정 이벤트 핸들러(함수)
         * @param negativeCallback 부정 이벤트 핸들러(함수)
         */
        showAlertToRetry (title, message, positiveCallback, negativeCallback) {
            this.showAlertToQuestion('error',
                title,
                message,
                '재시도',
                positiveCallback,
                '취소',
                negativeCallback)
        },
        showAlertToRetryGetData (message, positiveCallback, negativeCallback) {
            this.showAlertToQuestion('error',
                '재시도',
                message,
                '재시도',
                positiveCallback,
                '취소',
                negativeCallback)
        },
        /**
         * 질의용 alert
         * @param title 제목
         * @param message 내용
         * @param positiveTxt 긍정 버튼 텍스트
         * @param positiveCallback 긍정 버튼 이밴트 핸들러(함수)
         * @param negativeTxt 부정 버튼 텍스트
         * @param negativeCallback 부정 버튼 이벤트 핸들러(함수)
         */
        showAlertToQuestion (type, title, message, positiveTxt, positiveCallback, negativeTxt, negativeCallback) {
            this.$swal({
                type: type,
                title: title,
                html: this.toHtml(message),
                allowOutsideClick: true,
                showCancelButton: !!negativeTxt,
                confirmButtonText: positiveTxt,
                cancelButtonText: negativeTxt
            }).then(result => {
                console.debug('click', result)
                if (result.value) {
                    if (positiveCallback) {
                        console.debug('run positive callback')
                        positiveCallback()
                    }
                } else {
                    if (negativeCallback) {
                        console.debug('run negative callback')
                        negativeCallback()
                    }
                }
            })
        },
        /**
         * 알림용 alert
         * @param message 내용
         * */
        showAlertToInfo (message) {
            this.$swal({
                type: 'warning',
                title: 'Information!',
                html: this.toHtml(message),
                confirmButtonText: '확인'
            })
        },
        showAlertToWarning (title, message) {
            this.$swal({
                type: 'warning',
                title: title,
                html: this.toHtml(message),
                confirmButtonText: '확인'
            })
        },
        /**
         * Vue 에서 나가기를 지원하기 위한 alert
         * @param title 제목
         * @param message 내용
         * @param positiveCallback 나가기용 콜백
         */
        showAlertToExit (title, message, positiveCallback) {
            this.$swal({
                type: 'info',
                title: title,
                html: this.toHtml(message),
                // allowOutsideClick: true,
                confirmButtonText: '확인'
            }).then(() => {
                // 무조건 positive callback 수행
                // console.debug('click', result)
                if (positiveCallback) {
                    // console.debug('run positive callback')
                    positiveCallback()
                }
            })
        },
        /**
         * 처리 성공 모달 alert
         * @param positiveTxt
         * @param positiveCallback
         * @param negativeTxt
         * @param negativeCallback
         */
        showModalSuccessToProcess(positiveTxt, positiveCallback, negativeTxt, negativeCallback) {
            this.showModalSuccess('완료', positiveTxt, positiveCallback, negativeTxt, negativeCallback)
        },
        /**
         * 저장 성공 모달 alert
         * @param positiveTxt 긍정 버튼 텍스트 // 필수
         * @param positiveCallback 긍정 이벤트 핸들러(함수) // 필수
         * @param negativeTxt 부정 버튼 텍스트 // 생략가능
         * @param negativeCallback 부정 이벤트 핸들러(함수) // 생략가능
         */
        showModalSuccessToSave (positiveTxt, positiveCallback, negativeTxt, negativeCallback) {
            this.showModalSuccess('저장완료', positiveTxt, positiveCallback, negativeTxt, negativeCallback)
        },
        /**
         * 수정 성공 모달 alert
         * @param positiveTxt 긍정 버튼 텍스트 // 필수
         * @param positiveCallback 긍정 이벤트 핸들러(함수) // 필수
         * @param negativeTxt 부정 버튼 텍스트 // 생략가능
         * @param negativeCallback 부정 이벤트 핸들러(함수) // 생략가능
         */
        showModalSuccessToUpdate (positiveTxt, positiveCallback, negativeTxt, negativeCallback) {
            this.showModalSuccess('수정완료', positiveTxt, positiveCallback, negativeTxt, negativeCallback)
        },
        /**
         * 삭제 성공 모달 alert
         * @param positiveTxt 긍정 버튼 텍스트 // 필수
         * @param positiveCallback 긍정 이벤트 핸들러(함수) // 필수
         * @param negativeTxt 부정 버튼 텍스트 // 생략가능
         * @param negativeCallback 부정 이벤트 핸들러(함수) // 생략가능
         */
        showModalSuccessToDelete (positiveTxt, positiveCallback, negativeTxt, negativeCallback) {
            this.showModalSuccess('삭제완료', positiveTxt, positiveCallback, negativeTxt, negativeCallback)
        },
        /**
         * 성공 모달 alert
         * @param title 제목
         * @param positiveTxt 긍정 버튼 텍스트 // 필수
         * @param positiveCallback 긍정 이벤트 핸들러(함수) // 필수
         * @param negativeTxt 부정 버튼 텍스트 // 생략가능
         * @param negativeCallback 부정 이벤트 핸들러(함수) // 생략가능
         */
        showModalSuccess (title, positiveTxt, positiveCallback, negativeTxt, negativeCallback) {
            this.$swal({
                type: 'success',
                title: title,
                allowOutsideClick: true,
                showCancelButton: !!negativeTxt,
                confirmButtonText: positiveTxt,
                cancelButtonText: negativeTxt
            }).then(result => {
                if (result.value) {
                    if (positiveCallback) {
                        positiveCallback()
                    }
                } else {
                    if (negativeTxt) {
                        if (negativeCallback) {
                            negativeCallback()
                        }
                    } else {
                        if (positiveCallback) {
                            positiveCallback()
                        }
                    }
                }
            })
        }
    }
}

export {
    alert
}

export default alert
