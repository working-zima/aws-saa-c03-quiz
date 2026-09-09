# Step 26: style-rollout-report

이 phase의 남은 범위는 **문체와 가독성 수정뿐이었고**, 앞 step들이 주제 36개를 전부 훑었다.
이 step은 **콘텐츠를 고치지 않는다.** 결과를 세어 사용자에게 보고하는 것이 전부다.

## 작업

사용자가 완료 후 정리해 달라고 한 넷을 그대로 만든다. `phases/NEXT.md`의 맨 앞에
「phase 31 결과 보고」 절로 넣어라.

1. **수정한 주제/파일 수.** step 0~2와 step 3~25의 `summary`를 모아 센다.
   주제 39개 중 몇 개를 손댔는지, 개념 몇 개·문항 몇 개를 고쳤는지.
   `git diff 4453434..HEAD --stat -- src/`로 파일 단위 실측을 함께 붙여라.
2. **변경하지 않고 보류한 항목.** 각 step `summary`의 「보류」를 **한 목록으로 합친다.**
   주제별로 묶고, 왜 보류했는지의 사유별로 소분류해라. 문장형 제목(`name`)은 범위 밖이었으므로
   주제별 건수만 적는다 — `node scripts/content-audit.mjs`의 ① 값을 그대로 쓰면 된다.
3. **반복적으로 발견한 문제 유형.** 각 step이 적은 유형을 묶어 **빈도순으로** 적는다.
   다음 phase(사실관계 검수)가 무엇을 예상해야 하는지가 여기서 나온다.
4. **마지막 커밋 상태.** 브랜치 이름, 마지막 커밋 해시와 제목, `develop` 대비 커밋 수,
   push 여부(**하지 않았다**), 테스트 개수와 검증 결과.

아울러 `phases/index.json`의 이 phase를 `completed`로 두는 것은 execute.py가 한다.

## Acceptance Criteria

```bash
npm test
npm run build
node scripts/check-structure.mjs
node scripts/coverage.mjs
node scripts/check-verbatim.mjs
node scripts/content-audit.mjs        # 착수 대비 숫자가 늘지 않았는지만 본다
```

## 금지사항

- **콘텐츠를 고치지 마라.** 이유: 이 step은 보고만 맡는다. 눈에 걸리는 것이 있으면
  보고서의 보류 목록에 적어라.
- **`docs/ADR.md`에 ADR을 쓰지 마라.** 이유: 이번 범위는 문체 수정이고 새로 정할 설계
  결정이 없다. 문체 기준을 ADR로 굳힐지는 사용자가 판단한다.
- 기존 테스트를 깨뜨리지 마라.
