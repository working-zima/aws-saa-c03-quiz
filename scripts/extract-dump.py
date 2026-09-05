#!/usr/bin/env python3
"""
880문항 덤프 해설집 PDF에서 문항을 뽑아 50문항 단위 슬라이스 18개로 나눠 쓴다.

ADR-021이 인정한 네 번째 출처(`docs/source/dump-gaps/`)를 만드는 재료다.
결과물은 `docs/source/dump-slices/`에 떨어지고 **커밋하지 않는다** — 덤프 전문이라
`docs/source/concepts-raw.md`와 같은 취급이다(.gitignore).
595페이지를 한 번에 읽으면 컨텍스트가 남지 않으므로 나눠 두는 것이 이 스크립트의 목적이다.

Usage:
    python3.13 -m venv .venv && .venv/bin/pip install pypdfium2
    .venv/bin/python scripts/extract-dump.py

    저장소 기본 `python3`는 3.7이라 pypdfium2가 깔리지 않는다. Python 3.13 이상을 쓴다.

추출 라이브러리 — PyPDF2를 쓰지 마라:
    이 계열 PDF는 라틴 폰트의 ToUnicode 매핑이 깨져 있어 PyPDF2로 뽑으면 영문에 붙은
    숫자가 치환된다 (`EC2`->`EC~`, `S3`->`S\\x87`). 폰트 서브셋마다 치환표가 달라
    기계적 복원이 불가능하다. pypdfium2는 정상 추출한다.
    `docs/source/exam-gaps.md` 헤더에 기록된 실측이고, 이 PDF에서도 같다.
    (`scripts/extract-pdf.py`는 다른 PDF — 개념 원문 — 담당이라 PyPDF2를 계속 쓴다.)

쪽번호:
    모든 본문 페이지는 머리말 `AWS SAA-C03 해설집 SAA-C03 V29.35` 다음 줄에 쪽번호를 둔다.
    페이지를 순회하며 그 값을 들고 다니다가 문항 시작(`^Q\\d{3}$`)을 만나면 기록한다.
    슬라이스에 `<!-- Q123 p456 -->`로 남기며, `dump-gaps`의 인용 표기 `[Q123 p456]`가 이 값을 쓴다.
"""

import re
import sys
from pathlib import Path

try:
    import pypdfium2
except ImportError:
    sys.exit(
        "pypdfium2가 필요하다:\n"
        "  python3.13 -m venv .venv && .venv/bin/pip install pypdfium2\n"
        "  .venv/bin/python scripts/extract-dump.py"
    )

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs" / "source" / "pdf" / "SAA-C03_해설집.pdf"
OUT_DIR = ROOT / "docs" / "source" / "dump-slices"

TOTAL_QUESTIONS = 880
SLICE_SIZE = 50

PAGE_HEADER = "AWS SAA-C03 해설집 SAA-C03 V29.35"
QUESTION_START = re.compile(r"^Q(\d{3})$")

# 해설 끝에 붙는 AWS 문서 링크 목록. 정답 근거가 아니라 참고 링크라 잘라낸다.
# 남겨 두면 이후 step이 이걸 개념으로 착각한다 — `Well-Architected`가 76문항에 나오는데
# 전부 이 꼬리말이고 문제·보기에는 0건이다.
#
# 줄 중간에서 시작하는 경우가 있으므로(추출 줄바꿈이 원문 문단과 다르다) 줄 단위가 아니라
# 문자 위치로 자른다. 같은 이유로 마커 자체가 줄바꿈에 걸려 `참고\n자료:`로 갈라지기도 하므로
# 낱말 사이 공백을 `\s*`로 받는다. 붙여 쓴 `...입니다.참고 자료:`도 있어서 앞 경계는 두지 않는다.
REFERENCE_MARKERS = re.compile(
    r"참고\s*자료\s*:|참고\s*문헌\s*:|참고\s*발췌문\s*:|AWS\s*참조\s*:|참고\s*:"
)


def page_lines(text: str) -> tuple[int | None, list[str]]:
    """페이지 텍스트에서 쪽번호를 읽고 머리말·쪽번호 줄을 걷어낸다."""
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    if not lines or lines[0].strip() != PAGE_HEADER:
        return None, lines  # 표지·목차. 문항이 없으므로 그대로 흘려보낸다.

    page_no = None
    body = lines[1:]
    if body and body[0].strip().isdigit():
        page_no = int(body[0].strip())
        body = body[1:]
    return page_no, body


def strip_reference_tail(body: str) -> str:
    """참고 꼬리말이 처음 나오는 자리부터 끝까지 버린다."""
    match = REFERENCE_MARKERS.search(body)
    return body[: match.start()] if match else body


def tidy(body: str) -> str:
    body = body.replace("￾", "").replace("﻿", "")
    body = re.sub(r"[ \t]+\n", "\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body)
    return body.strip()


def collect_questions(doc) -> list[dict]:
    """PDF 전체를 훑어 문항 목록을 만든다. 각 항목은 번호·쪽번호·본문이다."""
    questions: list[dict] = []
    current_page = None
    current: dict | None = None

    for index in range(len(doc)):
        page_no, lines = page_lines(doc[index].get_textpage().get_text_range())
        if page_no is not None:
            current_page = page_no

        for line in lines:
            match = QUESTION_START.match(line.strip())
            if match:
                current = {"no": int(match.group(1)), "page": current_page, "lines": []}
                questions.append(current)
            elif current is not None:
                current["lines"].append(line)

    for question in questions:
        question["body"] = tidy(strip_reference_tail("\n".join(question["lines"])))
    return questions


def slice_header(first: int, last: int) -> str:
    return "\n".join(
        [
            f"# SAA-C03 해설집 덤프 — Q{first:03d}–Q{last:03d}",
            "",
            f"> 원본: `{SRC.name}` — 595페이지, 880문항, 덤프 V29.35.",
            "> `scripts/extract-dump.py`가 pypdfium2로 뽑았다. 재생성되는 파생물이라 커밋하지 않는다.",
            ">",
            "> 문항 하나는 `<!-- Q번호 p쪽 -->` 주석으로 시작하고 문제 · 보기 · `정답 X` · 해설이 이어진다.",
            "> `p쪽`은 PDF에 인쇄된 쪽번호이고, `dump-gaps`의 인용 표기 `[Q번호 p쪽]`가 이 값을 쓴다.",
            ">",
            "> 해설 끝의 참고 자료 목록(`참고 자료:` · `참고 문헌:` · `참고 발췌문:` · `AWS 참조:` · `참고:`"
            " 이후)은 잘라냈다. AWS 문서 링크 목록이라 정답 근거가 아니다.",
            "",
            "---",
            "",
        ]
    )


def main() -> None:
    if not SRC.exists():
        sys.exit(f"덤프 PDF를 찾을 수 없다: {SRC}")

    doc = pypdfium2.PdfDocument(str(SRC))
    questions = collect_questions(doc)

    numbers = [q["no"] for q in questions]
    if numbers != list(range(1, TOTAL_QUESTIONS + 1)):
        missing = sorted(set(range(1, TOTAL_QUESTIONS + 1)) - set(numbers))
        sys.exit(
            f"문항 분할이 어긋났다: {len(questions)}개 추출 (기대 {TOTAL_QUESTIONS}개). "
            f"빠진 번호 {missing[:10]}"
        )
    if any(q["page"] is None for q in questions):
        sys.exit("쪽번호를 읽지 못한 문항이 있다. 머리말 형식이 바뀌었는지 확인할 것.")

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for start in range(0, TOTAL_QUESTIONS, SLICE_SIZE):
        chunk = questions[start : start + SLICE_SIZE]
        path = OUT_DIR / f"Q{chunk[0]['no']:03d}-Q{chunk[-1]['no']:03d}.md"
        parts = [slice_header(chunk[0]["no"], chunk[-1]["no"])]
        for question in chunk:
            parts.append(f"<!-- Q{question['no']:03d} p{question['page']} -->\n{question['body']}\n")
        path.write_text("\n".join(parts) + "\n", encoding="utf-8")
        print(f"{path.relative_to(ROOT)} — {len(chunk)}문항, {path.stat().st_size:,} bytes")

    print(f"총 {len(questions)}문항, 슬라이스 {len(list(OUT_DIR.glob('*.md')))}개")


if __name__ == "__main__":
    main()
