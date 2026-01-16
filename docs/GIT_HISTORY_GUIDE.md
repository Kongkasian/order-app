# Cursor에서 Git 히스토리 보기 가이드

Cursor에서 Git 커밋 히스토리를 보는 여러 방법을 안내합니다.

## 방법 1: 소스 제어 패널 사용

### 기본 사용
1. 왼쪽 사이드바에서 **소스 제어 아이콘** 클릭 (또는 `Ctrl+Shift+G`)
2. **Source Control** 패널이 열립니다
3. 최근 변경사항과 스테이징된 파일을 확인할 수 있습니다

### 커밋 히스토리 확인
- 소스 제어 패널에서 **브랜치 이름** (예: `main`)을 클릭하면 최근 커밋 목록이 표시됩니다
- 또는 소스 제어 패널 하단의 상태 표시줄에서 브랜치 정보 확인

## 방법 2: Git Graph 확장 프로그램 설치 (권장)

Git Graph는 시각적으로 Git 히스토리를 볼 수 있는 유용한 확장 프로그램입니다.

### 설치 방법
1. 왼쪽 사이드바에서 **확장 프로그램 아이콘** 클릭 (또는 `Ctrl+Shift+X`)
2. 검색창에 **"Git Graph"** 입력
3. **"Git Graph"** (작성자: mhutchie) 선택
4. **"Install"** 클릭

### 사용 방법
1. 명령 팔레트 열기 (`Ctrl+Shift+P`)
2. **"Git Graph: View Git Graph"** 입력 및 실행
3. 새로운 탭에서 Git 히스토리 그래프가 열립니다

## 방법 3: 터미널 사용

### 최근 커밋 목록 보기
```bash
git log --oneline -10
```

### 그래프 형식으로 보기
```bash
git log --oneline --graph --all -20
```

### 상세 정보와 함께 보기
```bash
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit -10
```

## 방법 4: Cursor 통합 터미널 활용

1. 터미널 열기 (`Ctrl+`` (백틱) 또는 `View` → `Terminal`)
2. 다음 명령어 실행:

```bash
# 간단한 커밋 목록
git log --oneline -10

# 그래프 형식
git log --oneline --graph --decorate -15

# 특정 파일의 히스토리
git log --oneline -- <파일경로>

# 특정 날짜 이후의 커밋
git log --oneline --since="2 weeks ago"
```

## 방법 5: GitHub 웹에서 확인

1. GitHub 저장소로 이동
2. **"Commits"** 탭 클릭
3. 모든 커밋 히스토리를 웹에서 확인 가능

## 현재 커밋 상태 확인

다음 명령어로 현재 상태를 확인할 수 있습니다:

```bash
# 현재 상태 확인
git status

# 최근 커밋 10개 보기
git log --oneline -10

# 브랜치와 최근 커밋 그래프
git log --oneline --graph --all --decorate -15
```

## 유용한 Git 명령어

```bash
# 특정 커밋 상세 정보
git show <커밋해시>

# 특정 파일의 변경 이력
git log --follow -- <파일경로>

# 커밋 작성자별 통계
git shortlog -sn

# 최근 변경된 파일 목록
git log --name-status --pretty=format: -1
```

## 문제 해결

### 명령 팔레트에서 Git 명령이 보이지 않을 때
- Git이 제대로 설치되어 있는지 확인: `git --version`
- 워크스페이스가 Git 저장소인지 확인: `.git` 폴더 존재 여부 확인

### 소스 제어 패널이 비어있을 때
- 변경사항이 없는 경우 정상입니다
- `git status` 명령어로 현재 상태 확인

### Git Graph가 작동하지 않을 때
- 확장 프로그램이 활성화되어 있는지 확인
- Cursor를 재시작
- Git 저장소 루트에서 명령 실행

## 추천 방법

1. **일상적인 사용**: 소스 제어 패널 (방법 1)
2. **시각적 히스토리 확인**: Git Graph 확장 (방법 2)
3. **상세 정보 확인**: 터미널 사용 (방법 3)
4. **온라인에서 확인**: GitHub 웹 (방법 5)
