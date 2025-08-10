import { Post } from "@/types/community";

export const mockPosts: Post[] = [
  {
    id: "1",
    region: "신림동",
    createdAgo: "2일전",
    category: "소분 모임",
    participants: { current: 9, max: 12 },
    title: "안전한 등하굣길 함께 만들어요 - 신림초등학교 학부모 모임",
    excerpt:
      "우리 아이들의 안전한 등하굣길을 위해 학부모님들과 함께 순번제로 교통안전지도를 하려고 합니다. 관심 있는 분들 많이 참여해주세요!",
    author: { name: "김희진" },
    stats: { views: 124, comments: 8, likes: 15 },
  },
  {
    id: "2",
    region: "관악구",
    createdAgo: "4시간전",
    category: "소분 모임",
    participants: { current: 12, max: 15 },
    title: "낙성대 공원 산책모임 - 매주 화요일 저녁 7시",
    excerpt:
      "건강한 산책을 통해 이웃과 소통하며 동네 안전도 함께 지켜요. 누구나 부담 없이 참여 가능합니다.",
    author: { name: "이영수" },
    stats: { views: 67, comments: 3, likes: 8 },
  },
  {
    id: "3",
    region: "봉천동",
    createdAgo: "1일전",
    category: "안전 수리",
    participants: { current: 18, max: 25 },
    title: "CCTV 설치 요청 - 봉천로 골목길",
    excerpt:
      "최근 봉천로 뒷골목에서 불안한 일들이 자주 발생하고 있어 CCTV 설치가 필요합니다. 구청에 공식 요청을 위해 주민 의견을 모으고 있습니다.",
    author: { name: "박민수" },
    stats: { views: 203, comments: 18, likes: 32 },
  },
  {
    id: "4",
    region: "서림동",
    createdAgo: "5일전",
    category: "소분 모임",
    participants: { current: 6, max: 15 },
    title: "여성 안전귀가 동행 서비스 - 야간 시간대 운영",
    excerpt:
      "늦은 시간 혼자 귀가하기 불안한 여성분들을 위한 동행 서비스를 운영하려고 합니다. 함께 참여해주실 분들을 모집합니다.",
    author: { name: "최유진" },
    stats: { views: 156, comments: 12, likes: 24 },
  },
  {
    id: "5",
    region: "신사동",
    createdAgo: "3일전",
    category: "소분 모임",
    participants: { current: 7, max: 12 },
    title: "우리 동네 안전지킴이 - 자율방범대 모집",
    excerpt:
      "동네 순찰과 안전활동을 통해 범죄 예방에 기여하고 싶은 주민분들을 모집합니다. 매주 토요일 오후 2시 정기 모임 있습니다.",
    author: { name: "정호영" },
    stats: { views: 98, comments: 7, likes: 19 },
  },
  {
    id: "6",
    region: "대학동",
    createdAgo: "1주전",
    category: "안전 수리",
    participants: { current: 5, max: 10 },
    title: "가로등 고장 신고 및 수리 요청",
    excerpt:
      "대학동 주택가 골목길 가로등 여러 개가 고장나서 밤에 너무 어둡습니다. 관련 기관에 신고 접수했는데 빠른 수리가 필요해요.",
    author: { name: "장미래" },
    stats: { views: 89, comments: 5, likes: 13 },
  },
  {
    id: "7",
    region: "신림동",
    createdAgo: "2주전",
    category: "소분 모임",
    participants: { current: 4, max: 10 },
    title: "어린이 교통안전 캠페인 - 스쿨존 속도준수",
    excerpt:
      "신림초등학교 앞 스쿨존에서 과속하는 차량들이 많아 위험합니다. 학부모와 주민이 함께하는 교통안전 캠페인을 진행하려고 합니다.",
    author: { name: "윤세라" },
    stats: { views: 176, comments: 14, likes: 28 },
  },
  {
    id: "8",
    region: "관악구",
    createdAgo: "6일전",
    category: "소분 모임",
    participants: { current: 14, max: 18 },
    title: "여성 1인 가구 안전 네트워크 - 정기 모임",
    excerpt:
      "혼자 사는 여성분들의 안전과 소통을 위한 정기 모임을 운영하고 있습니다. 서로 안부를 확인하고 안전 정보를 공유해요.",
    author: { name: "한소영" },
    stats: { views: 134, comments: 9, likes: 21 },
  },
  {
    id: "9",
    region: "봉천동",
    createdAgo: "1일전",
    category: "취미·기타",
    participants: { current: 11, max: 15 },
    title: "주차 문제 해결을 위한 주민 협의회",
    excerpt:
      "봉천동 주택가 불법주차로 인한 통행 불편과 안전사고 위험이 증가하고 있습니다. 주민들과 함께 해결방안을 논의하고자 합니다.",
    author: { name: "조민호" },
    stats: { views: 87, comments: 6, likes: 11 },
  },
  {
    id: "10",
    region: "관악구",
    createdAgo: "3시간전",
    category: "소분 모임",
    participants: { current: 8, max: 20 },
    title: "청소년 안전 교육 프로그램 - 강사 및 자원봉사자 모집",
    excerpt:
      "지역 청소년들을 대상으로 한 종합 안전교육 프로그램을 운영합니다. 교육 강사와 자원봉사자분들의 참여를 기다립니다.",
    author: { name: "김교육" },
    stats: { views: 45, comments: 2, likes: 7 },
  },
  {
    id: "11",
    region: "서초동",
    createdAgo: "5일전",
    category: "일반",
    title: "동네 소식 공유 - 새로운 편의점 오픈",
    excerpt:
      "우리 동네에 새로운 편의점이 오픈했습니다. 24시간 운영하며 생필품부터 간편식까지 다양하게 구비되어 있어요.",
    author: { name: "이웃사랑" },
    stats: { views: 45, comments: 3, likes: 8 },
  },
];

export const categoryTabs = [
  { id: "all", label: "전체", key: "전체" as const },
  { id: "safety", label: "안전 수리", key: "안전 수리" as const },
  { id: "small_group", label: "소분 모임", key: "소분 모임" as const },
  { id: "hobby", label: "취미·기타", key: "취미·기타" as const },
];

export const sortOptions = [
  { value: "등록순" as const, label: "등록순" },
  { value: "최신순" as const, label: "최신순" },
];
