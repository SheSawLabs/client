import { COLORS } from "@/constants";
import { SafetyLevel } from "./SafetyLevel";
import { Typography } from "./Typography";
import Image from "next/image";
const SafetyGuideDetail = () => {
  return (
    <div className="px-2 py-8 space-y-6 w-full">
      <Typography variant="h1" className="break-words text-2xl font-bold">
        안전 등급이
        <br />
        뭔가요?
      </Typography>

      <div className="space-y-4">
        <Typography className="break-words leading-relaxed">
          시소의 안전 등급이란,
          <br />
          <a
            className="flex items-center justify-start space-x-1"
            href="https://www.cpted.or.kr/kr/business/intro.php"
            target="_blank"
            rel="noreferrer"
          >
            <span className="cursor-pointer" style={{ color: COLORS.PRIMARY }}>
              CPTED 원칙
            </span>
            <Image
              src="/icons/export.svg"
              alt="내보내기 아이콘"
              width={10}
              height={10}
              className="w-5 h-5"
            />
            에 따라
          </a>
        </Typography>

        <div className="space-y-3">
          <Typography className="font-medium">
            <span className="mr-3" style={{ color: COLORS.PRIMARY }}>
              1
            </span>
            자연적 감시
          </Typography>
          <Typography className="font-medium">
            <span className="mr-3" style={{ color: COLORS.PRIMARY }}>
              2
            </span>
            접근 통제
          </Typography>
          <Typography className="font-medium">
            <span className="mr-3" style={{ color: COLORS.PRIMARY }}>
              3
            </span>
            영역성 강화
          </Typography>
          <Typography className="font-medium">
            <span className="mr-3" style={{ color: COLORS.PRIMARY }}>
              4
            </span>
            유지 관리
          </Typography>
          <Typography className="font-medium">
            <span className="mr-3" style={{ color: COLORS.PRIMARY }}>
              5
            </span>
            활동성
          </Typography>
        </div>

        <Typography className="break-words leading-relaxed">
          등의 요소로 중요도를 반영한
          <br />
          우리 동네의 체감 안전 수치입니다.
        </Typography>
      </div>

      <div className="space-y-2 mt-2  w-full">
        <SafetyLevel />
      </div>
    </div>
  );
};

export { SafetyGuideDetail };
