import { SafetyLevel } from "./SafetyLevel";
import { Typography } from "./Typography";

const SafetyGuideDetail = () => {
  return (
    <div className="mt-4 space-y-3">
      <Typography variant="h1">안전 등급이 뭔가요?</Typography>
      <Typography className="whitespace-pre">
        시소의 안전 등급이란, CPTED 원칙에 따라
        <br />
        자연적 감시
        <br />
        접근 통제
        <br />
        영역성 강화
        <br />
        유지 관리
        <br />
        활동성
        <br />
        <br />등 다섯 요소의 중요도를 반영한우리 동네의 체감 안전 수치입니다
      </Typography>
      <div className="space-y-2">
        <SafetyLevel />
      </div>
    </div>
  );
};

export { SafetyGuideDetail };
