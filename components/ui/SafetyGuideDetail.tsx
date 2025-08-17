import { SafetyLevel } from "./SafetyLevel";
import { Typography } from "./Typography";

const SafetyGuideDetail = () => {
  return (
    <div className="px-6 py-8 space-y-6 w-full">
      <Typography
        variant="h1"
        className="break-words text-center text-2xl font-bold"
      >
        안전 등급이 뭔가요?
      </Typography>

      <div className="space-y-4">
        <Typography className="break-words leading-relaxed">
          시소의 안전 등급이란,
          <a
            href="https://www.cpted.or.kr/kr/business/intro.php"
            target="_blank"
            rel="noreferrer"
          >
            <span className="text-blue-600 underline cursor-pointer">
              CPTED 원칙
            </span>
          </a>
          에 따라
        </Typography>

        <div className="space-y-3">
          <Typography className="text-blue-600 font-medium">
            1 자연적 감시
          </Typography>
          <Typography className="text-blue-600 font-medium">
            2 접근 통제
          </Typography>
          <Typography className="text-blue-600 font-medium">
            3 영역성 강화
          </Typography>
          <Typography className="text-blue-600 font-medium">
            4 유지 관리
          </Typography>
          <Typography className="text-blue-600 font-medium">
            5 활동성
          </Typography>
        </div>

        <Typography className="break-words leading-relaxed">
          등의 요소로 중요도를 반영한
          <br />
          우리 동네의 체감 안전 수치입니다.
        </Typography>
      </div>

      <div className="space-y-2 w-full">
        <SafetyLevel />
      </div>
    </div>
  );
};

export { SafetyGuideDetail };
