export interface Comment {
  id: string;
  content: string;
  author: {
    nickname: string;
    location: string;
  };
  createdAt: string;
  likes: number;
  repliesCount: number;
  liked: boolean;
  replies?: Comment[];
}

export const mockComments: Comment[] = [
  {
    id: "1",
    content: "좋은 정보 감사합니다! 저도 참여하고 싶네요.",
    author: {
      nickname: "동네주민",
      location: "신림동",
    },
    createdAt: "30분 전",
    likes: 2,
    repliesCount: 1,
    liked: false,
    replies: [
      {
        id: "1-1",
        content: "네! 언제든지 참여하세요. 같이 해요!",
        author: {
          nickname: "김희진",
          location: "신림동",
        },
        createdAt: "25분 전",
        likes: 1,
        repliesCount: 0,
        liked: false,
      },
    ],
  },
  {
    id: "2",
    content: "안전한 활동이라니 정말 의미있는 것 같아요. 응원합니다!",
    author: {
      nickname: "참여희망자",
      location: "관악구",
    },
    createdAt: "15분 전",
    likes: 1,
    repliesCount: 0,
    liked: false,
  },
  {
    id: "3",
    content: "시간이 어떻게 되나요?",
    author: {
      nickname: "궁금한사람",
      location: "신림동",
    },
    createdAt: "5분 전",
    likes: 0,
    repliesCount: 0,
    liked: false,
  },
];
