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

    AUTH1_1: null, // 저장
    AUTH1_2: null, // 수정
    AUTH1_3: null, // 삭제

    AUTH2_1: null, // 매출관리
    AUTH2_2: null, // 매입관리
    AUTH2_3: null, // 재고관리
    AUTH2_4: null, // 계산서관리
    AUTH2_5: null, // 지출관리
    AUTH2_6: null, // 장비관리
    AUTH2_7: null, // 정보현황
    AUTH2_8: null, // 거래처등록
    AUTH2_9: null, // 품목등록
    AUTH2_10: null, // 환경설정
    AUTH2_11: null, // 쇼핑몰설정

    AUTH3_1: null, // 전체거래처
    AUTH3_2: null, // 실적전체
    AUTH3_3: null, // 날짜변경_전일
    AUTH3_4: null, // 날짜변경_후일
    AUTH3_5: null, // 단가수정
    AUTH3_6: null, // 잔고수정
    AUTH3_7: null, // 재고수정

    /**
     * 이하 api get
     */
    AGENT_SETTINGS: {
        SHOP_DIV: null, // 쇼핑몰 사용여부
        EGG_DIV: null, // 계란 업체여부
        AMOUNT_DIV: null, // 수량 사용여부
        DC_DIV: null, // DC 사용여부
        SERVICE_DIV: null, // 서비스 사용여부
        CMT_DIV: null, // 비고 사용여부

        CONNECT_AGENT: null, // 연결업체

        POINT_DIV: null, // 단가 소수점 구분
        A_POINT_DIV: null, // 수량 소수점 구분

        RETURN_DIV: null, // 불량반품 사용여부
        STOCK_LIMIT_DIV: null, // 0 재고 한도 체크
        CREDIT_LIMIT_DIV: null // 여신 한도 체크
    },

    // 명세서 출력 설정 API 로딩
    PRINT_SETTINGS: {
        STAX_PRINT: null, // 세액 출력구분 (회사정보 GET => N/Y)
        SALES_PRINT_ORDER: null, // 정렬기준 (1:입력순서, 2:조회번호)
        SALES_PRINT_PRICE: null, // 금액출력 (1:출력, 2:미출력)
        SALES_PRINT_PPU: null, // 단가출력 (1:출력, 2:미출력)
        SALES_PRINT_BALANCE: null, // 잔고출력 (1:출력, 2:미출력)
        SALES_PRINT_REVERSE: null, // 반전구분 (1:예, 2:아니오)
        // 전체사용 한정
        SALES_PRINT_BOX_PPU: null, // 박스단가출력 (1:예, 2:아니오)
        PRINT_CHECK_TXT: ''
    },

    AGENT_MEMBER_LIST: [] // 사원리스트 임시 저장(거래처 목록에서 코드사용하여 이름조회)
}

export default state
