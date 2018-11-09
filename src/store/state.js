const state = {
    AGENT_RNO: null,
    AGENT_NO: null,
    AGENT_NAME: null,

    USER_ID: null,
    USER_CODE: null,
    USER_NAME: null,

    USER_M_AGENTNO: null,
    USER_M_ADMIN: null,
    USER_MMDIV: null, // 중상구분 1:직원/2:중상

    SYS_DIV: null,
    SHOP_DIV: null,
    EGG_DIV: null,
    AMT_DIV: null,
    DC_DIV: null,
    SER_DIV: null,
    CMT_DIV: null,

    CONNECT_DIV: null,

    USE_POINT_DIV: null, // 단가 소수점 구분
    USE_POINT_AMT_DIV: null, // 수량 소수점 구분

    AGENT_MEMBER_LIST: [] // 사원리스트 임시 저장(거래처 목록에서 코드사용하여 이름조회)
}

export default state
