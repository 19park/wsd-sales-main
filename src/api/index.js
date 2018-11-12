import axios from 'axios'
import store from '../store'
import _get from 'lodash/get'

// const DOMAIN = 'http://192.168.100.231:8080/wholedoc'
const DOMAIN = 'https://wholedoc.net:8444/wholedoc'
const API_KEY = 'wholeDoc1hb23jh45h3j3v339d0fk90s9d8fd9e'
const WEB_TOKEN = 'WeB91F98eF7d3K2sdhKetnaD'
const UNAUTHORIZED = 401
const onUnauthorized = () => {
    //router.push(`/login?rPath=${encodeURIComponent(location.pathname)}`)
}


// 기본 타임아웃
axios.defaults.timeout = 40000
axios.defaults.headers.common['api-key'] = API_KEY
axios.defaults.headers.common['auth-token-web'] = WEB_TOKEN

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


const request = (method, url, data) => {
    const dataType = (method === 'get') ? 'params' : 'data'
    return axios({
        method,
        url: DOMAIN + url,
        [dataType]: data
    }).then(result => result.data)
        .catch(err => {
            if (!_get(err, 'response')) {
                throw '네트워크 에러'
            } else {
                const {status} = err.response
                if (status === UNAUTHORIZED) onUnauthorized()
                throw err.response
            }
        })
}


export const agent = {
    fetchBank (data) {
        return request('get', '/api/v6/agentBanks', data)
    }
}


export const customer = {
    fetch (data) {
        return request('get', '/api/v6/customers', data)
    },
    fetchTypes (data) {
        return request('get', '/api/v6/customerType1s', data)
    },
    // create(title) {
    //   return request('post', '/customer', {title})
    // }
}

export const member = {
    fetch (data) {
        return request('get', '/api/v6/agentMembers/all', data)
    }
}

export const warehouses = {
    fetch (data) {
        return request('get', '/api/v6/warehouses', data)
    }
}

export const goods = {
    fetch (data) {
        return request('get', '/api/v6/salesProducts', data)
    }
}


export const sales = {
    // 목록 조회
    fetch (data) {
        return request('get', '/api/v6/sales', data)
    },
    // 집계 조회
    fetchSummary (data) {
        return request('get', '/api/v6/sales/summary', data)
    },
    // 원장 조회
    fetchLedger (data) {
        return request('get', '/api/v6/salesLedger/simple', data)
    }
}