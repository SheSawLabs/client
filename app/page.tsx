"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/Sheet";
import { Typography } from "@/components/ui/Typography";

export default function Home() {
  const [checked, setChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <main className="container mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <Typography variant="h1" className="mb-4">
          shadcn/ui Components Showcase
        </Typography>
        <Typography variant="lead">
          여러 컴포넌트들의 다양한 variant와 props 예시입니다.
        </Typography>
      </div>

      {/* Typography Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Typography 컴포넌트</CardTitle>
          <CardDescription>다양한 텍스트 스타일링 예시</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Typography variant="h1">Heading 1</Typography>
          <Typography variant="h2">Heading 2</Typography>
          <Typography variant="h3">Heading 3</Typography>
          <Typography variant="h4">Heading 4</Typography>
          <Typography variant="p">
            This is a paragraph with normal text.
          </Typography>
          <Typography variant="lead">
            This is a lead paragraph with larger text.
          </Typography>
          <Typography variant="large">This is large text.</Typography>
          <Typography variant="small">This is small text.</Typography>
          <Typography variant="muted">This is muted text.</Typography>
          <Typography variant="blockquote">
            &ldquo;This is a blockquote with italic styling and left
            border.&rdquo;
          </Typography>
        </CardContent>
      </Card>

      {/* Button Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Button 컴포넌트</CardTitle>
          <CardDescription>다양한 버튼 variant와 size 예시</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🚀</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled Outline
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Input Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Input 컴포넌트</CardTitle>
          <CardDescription>다양한 input 상태와 타입 예시</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Typography variant="small" className="mb-2">
                기본 Input
              </Typography>
              <Input
                placeholder="Enter your text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" className="mb-2">
                Disabled Input
              </Typography>
              <Input placeholder="Disabled input" disabled />
            </div>
            <div>
              <Typography variant="small" className="mb-2">
                Email Input
              </Typography>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div>
              <Typography variant="small" className="mb-2">
                Password Input
              </Typography>
              <Input type="password" placeholder="Password" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 카드</CardTitle>
            <CardDescription>간단한 카드 예시입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="p">
              카드 컨텐츠 영역입니다. 다양한 내용을 넣을 수 있습니다.
            </Typography>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-primary">강조된 카드</CardTitle>
            <CardDescription>
              커스텀 스타일링이 적용된 카드입니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="p">
              border와 색상이 커스터마이즈된 카드입니다.
            </Typography>
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>배경색 카드</CardTitle>
            <CardDescription>배경색이 적용된 카드입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Typography variant="p">
              muted 배경색이 적용된 카드입니다.
            </Typography>
          </CardContent>
        </Card>
      </div>

      {/* Checkbox Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Checkbox 컴포넌트</CardTitle>
          <CardDescription>다양한 체크박스 상태 예시</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms1"
              checked={checked}
              onCheckedChange={setChecked}
            />
            <label
              htmlFor="terms1"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              동적 체크박스 (현재 상태: {checked ? "체크됨" : "체크안됨"})
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms2" defaultChecked />
            <label
              htmlFor="terms2"
              className="text-sm font-medium leading-none"
            >
              기본적으로 체크된 상태
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms3" disabled />
            <label
              htmlFor="terms3"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              비활성화된 체크박스
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms4" disabled checked />
            <label
              htmlFor="terms4"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              체크된 상태로 비활성화
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Sheet Example */}
      <Card>
        <CardHeader>
          <CardTitle>Sheet 컴포넌트</CardTitle>
          <CardDescription>사이드바 형태의 오버레이 컴포넌트</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">왼쪽에서 열기</Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>왼쪽 Sheet</SheetTitle>
                  <SheetDescription>
                    왼쪽에서 슬라이드로 나타나는 Sheet입니다.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <Typography variant="p">
                    여기에 다양한 컨텐츠를 넣을 수 있습니다.
                  </Typography>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">오른쪽에서 열기</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>오른쪽 Sheet</SheetTitle>
                  <SheetDescription>
                    오른쪽에서 슬라이드로 나타나는 Sheet입니다.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <Input placeholder="Sheet 내부의 입력 필드" />
                  <Button className="w-full">전체 너비 버튼</Button>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">위에서 열기</Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>위쪽 Sheet</SheetTitle>
                  <SheetDescription>
                    위에서 슬라이드로 나타나는 Sheet입니다.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">아래에서 열기</Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>아래쪽 Sheet</SheetTitle>
                  <SheetDescription>
                    아래에서 슬라이드로 나타나는 Sheet입니다.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
