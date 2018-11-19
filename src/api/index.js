import axios from 'axios'
import store from '../store'
import _get from 'lodash/get'

export const SETTINGS = {
    DOMAIN: 'http://192.168.100.231:8080/wholedoc',
    DOMAIN_LIVE: 'https://www.wholedoc.net:8444/wholedoc',
    DOMAIN_WSD: 'http://www.wholedoc.net/pages/sales',
    API_KEY: 'wholeDoc1hb23jh45h3j3v339d0fk90s9d8fd9e',
    WEB_TOKEN: 'WeB91F98eF7d3K2sdhKetnaD',
    UNAUTHORIZED: 401,
    onUnauthorized: () => {
        //router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`)
    }
}

// 기본 타임아웃
axios.defaults.timeout = 40000
axios.defaults.headers.common['api-key'] = SETTINGS.API_KEY
axios.defaults.headers.common['auth-token-web'] = SETTINGS.WEB_TOKEN

// axios 사용 시 요청, 응답에 대한 선 처리
axios.interceptors.request.use(config => {
    if ((config.url.indexOf('wholedoc') > -1) && config.method === 'get') {
        if (!config.params) {
            // 조회조건이 하나도 없는 경우 오류가 발생하므로 빈 객체를 생성
            config.params = {}
        }

        if (!_get(config.params, 'agent_no', undefined)) {
            // noinspection JSUnresolvedVariable
            const agentNo = _get(store.state, 'AGENT_NO', undefined)
            if (agentNo) {
                config.params['agent_no'] = agentNo
            }
        }
    }
    return config
}, err => {
    return Promise.reject(err)
})


const request = (settings) => {
    const GET_URL = settings.url
    if (!GET_URL.match('http')) {
        settings.url = SETTINGS.DOMAIN + GET_URL
    }
    return axios(settings)
        .then(result => result.data)
        .catch(err => {
            if (!_get(err, 'response')) {
                throw '네트워크 에러'
            } else {
                const {status} = err.response
                if (status === SETTINGS.UNAUTHORIZED) SETTINGS.onUnauthorized()
                throw err
            }
        })
}


export const agent = {
    fetch () {
        return request({
            method: 'get',
            url: `/api/v6/agents/${store.state.AGENT_RNO}`
        })
    },
    fetchBank (data) {
        return request({
            method: 'get',
            url: '/api/v6/agentBanks',
            params: data
        })
    },
    // 명세서 인쇄 시 변경 되면 가맹점에 업데이트
    updatePrtOpts (data) {
        return request({
            method: 'put',
            url: `/api/v6/agents/${store.state.AGENT_RNO}/prtOpts`,
            data
        })
    }
}


export const customer = {
    fetch (data) {
        return request({
            method: 'get',
            url: '/api/v6/customers',
            params: data
        })
    },
    fetchTypes (data) {
        return request({
            method: 'get',
            url: '/api/v6/customerType1s',
            params: data
        })
    },
    fetchTarget (data) {
        return request({
            method: 'get',
            url: `/api/v6/customers/${store.state.AGENT_NO}/${data.CODE}`
        })
    }
}

export const member = {
    fetch (data) {
        return request({
            method: 'get',
            url: '/api/v6/agentMembers/all',
            params: data
        })
    }
}

export const warehouses = {
    fetch (data) {
        return request({
            method: 'get',
            url: '/api/v6/warehouses',
            params: data
        })
    }
}

export const goods = {
    fetch (data) {
        return request({
            method: 'get',
            url: '/api/v6/salesProducts',
            params: data
        })
    },
    fetchTypes (data) {
        return request({
            method: 'get',
            url: '/api/v6/productType1s',
            params: data
        })
    }
}


export const sales = {
    // 목록 조회
    fetch (data) {
        return request({
            method: 'get',
            url: '/api/v6/sales',
            params: data
        })
    },

    // 집계 조회
    fetchSummary (data) {
        return request({
            method: 'get',
            url: '/api/v6/sales/summary',
            params: data
        })
    },

    // 원장 조회
    fetchLedger (data) {
        return request({
            method: 'get',
            url: '/api/v6/salesLedger/simple',
            params: data
        })
    },

    // 매출목록 엑셀변환
    fetchListExcel (data) {
        return request({
            method: 'post',
            url: `${SETTINGS.DOMAIN_WSD}/S_Excel.asp`,
            data: data,
            responseType: 'arraybuffer',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
    },

    // 매출목록 인쇄
    fetchListPrint (data) {
        return request({
            method: 'post',
            url: `${SETTINGS.DOMAIN_WSD}/S_Print.asp`,
            data: data
        })
    },

    fetchReport ({url, data}) {
        return request({
            method: 'post',
            url,
            data,
            responseType: 'arraybuffer',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        })
    },

    // 명세서 이메일 발송
    sendEmail (url) {
        return request({
            method: 'get',
            url: url
        })
    },



    // 단가 변동 내역 조회
    fetchPpuHistories (data) {
        return request({
            method: 'get',
            url: '/api/v6/salesPpuHistories',
            params: data
        })
    },

    // 명세서 인쇄 여부 업데이트
    patchPrintComp (data) {
        return request({
            method: 'patch',
            url: `/api/v6/sales/${store.state.AGENT_NO}/${data.sales_day}/${data.sales_code}/${data.customer_code}/printing`
        })
    },

    // 매출 등록
    createSales (data) {
        return request({
            method: 'post',
            url: '/api/v6/sales',
            data
        })
    },

    updateSales (obj, data) {
        return request({
            method: 'put',
            url: `/api/v6/sales/${store.state.AGENT_NO}/${obj.sales_day}/${obj.sales_code}/${obj.customer_code}`,
            data
        })
    },

    // 매출 삭제
    deleteSales (data) {
        return request({
            method: 'delete',
            url: `/api/v6/sales/${store.state.AGENT_NO}/${data.sales_day}/${data.sales_code}/${data.customer_code}?register_code=${store.state.USER_CODE}`
        })
    },

    // 매출 단일 조회
    fetchData (data) {
        return request({
            method: 'get',
            url: `/api/v6/sales/${store.state.AGENT_NO}/${data.sales_day}/${data.sales_code}/${data.customer_code}`
        })
    }
}