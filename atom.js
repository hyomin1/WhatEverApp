import { atom } from "recoil";

export const accessData = atom({
  key: "access",
  default: null,
}); //토큰 데이터
export const grantData = atom({
  key: "grant",
  default: null,
}); //토큰 데이터
export const imgData = atom({
  key: "profileImg",
  default:
    "data:image/jpeg;base64,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",
});
export const nameData = atom({
  key: "name",
  default: null,
}); //회원가입시 이름
export const idData = atom({
  key: "userId",
  default: null,
}); //회원가입시 유저아이디
export const pwData = atom({
  key: "password",
  default: null,
}); //회원가입시 비밀번호, 프로필에서 받아오는 비밀번호 데이터

export const IntroduceData = atom({
  key: "introduce",
  default: null,
}); //프로필에서 받아오는 자기소개 데이터 ,프로필 수정시 자기소개
export const responseData = atom({
  key: "response",
  default: null,
}); //프로필에서 받아오는 응답시간데이터
export const distanceData = atom({
  key: "distance",
  default: null,
}); //프로필에서 받아오는 거리데이터
export const ratingData = atom({
  key: "rating",
  default: null,
}); //프로필에서 받아오는 평점데이터
export const uniqueIdData = atom({
  key: "uniqueId",
  default: null,
}); //프로필에서 받아오는 본인 id 값(number)

export const contentData = atom({
  //거리순 default
  key: "content",
  default: null,
});
export const ratingHelperData = atom({
  key: "ratingHelper",
  default: null,
});
export const responseHelperData = atom({
  key: "responseHelper",
  default: null,
});

export const myIdData = atom({
  key: "myId",
  default: null,
}); //로그인시 구독을 위한 내 id값
export const workData = atom({
  key: "work",
  default: null,
});

export const myImgData = atom({
  key: "myImg",
  default: null,
});
export const clientData = atom({
  key: "client",
  default: null,
});
export const subIdData = atom({
  key: "subId",
  default: null,
});
export const ConversationData = atom({
  key: "conversation",
  default: null,
});
export const recvMsgData = atom({
  key: "recvMsg",
  default: [],
});
export const chatRoomListData = atom({
  key: "chatRoom",
  default: [],
});
export const chatListData = atom({
  key: "chatList",
  default: [],
});
export const chatMsgData = atom({
  key: "chatMsg",
  default: [],
});
export const workListData = atom({
  key: "workList",
  default: [],
});
