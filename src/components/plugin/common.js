let common = {}

common.install = function (Vue, options) {
    /**
     * 전역 공통 함수
     */
    const common = {
        /**
         * err 을 받아서 에러객체값에 따라서 alert 창 노출
         */
        parseErrorMsg (err) {
            let msg = ''
            if (!err.response) {
                if (!err.data) {
                    msg = err
                } else {
                    msg = err.data
                }

                console.log('response: ', err)
            } else {
                console.log('not response: ', err.response)
                if (err.response.data) {
                    if (err.response.data.detail) {
                        let tmpErrTxt = ''
                        // noinspection JSUnresolvedVariable
                        err.response.data.detail.errors.forEach(function (v, k) {
                            if (k > 0) {
                                tmpErrTxt += '\n'
                            }
                            tmpErrTxt += v.message
                        })
                        msg = err.response.data.message + '\n' + tmpErrTxt
                    } else if (err.response.data.error) {
                        msg = err.response.data.error.message
                    } else if (err.response.data.message) {
                        msg = err.response.data.message
                    } else {
                        msg = err.response.data
                    }
                } else {
                    msg = err.response.statusText
                }
            }
            return msg
        },

        getErrorMsg (err) {
            const msg = this.parseErrorMsg(err)
            alert(msg)
        },

        // trigger element remove
        removeElement (p) {
            const elem = (typeof p === 'String') ?
                document.getElementById(p) : p
            return elem.parentNode.removeChild(elem)
        },

        // resize callback
        debounce (func) {
            let timer
            return function (event) {
                if (timer) clearTimeout(timer)
                timer = setTimeout(func, 300, event)
            }
        },

        // 스크롤 이동 처리 함수
        scrollTo (element, from, to, duration, currentTime) {
            if (from <= 0) {
                from = 0
            }
            if (to <= 0) {
                to = 0
            }
            if (currentTime >= duration) return
            let delta = to - from
            let progress = currentTime / duration * Math.PI / 2
            let position = delta * (Math.sin(progress))
            setTimeout(() => {
                element.scrollTop = from + position
                this.scrollTo(element, from, to, duration, currentTime + 10)
            }, 10)
        }

    }

    Vue.prototype.$common = common
}

export default common