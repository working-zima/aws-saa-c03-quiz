#!/usr/bin/env python3
"""dump-gaps의 `## {topicId}` 절에 흩어진 항목을 모아 표준 출력에 낸다.

    python3 scripts/collect-gaps.py block-file-storage
    python3 scripts/collect-gaps.py '(주제 미정)'
    python3 scripts/collect-gaps.py --list
"""
import collections
import glob
import os
import sys

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), os.pardir,
                   'docs', 'source', 'dump-gaps')


def items():
    """(topicId, 항목 본문)을 파일 순서대로 낸다. '원본 수정 이력' 절은 개념이 아니라 건너뛴다."""
    for path in sorted(glob.glob(os.path.join(DIR, 'Q*.md'))):
        topic, item = None, None
        with open(path, encoding='utf-8') as f:
            lines = f.readlines() + ['## \n']  # 마지막 항목을 닫는 보초
        for line in lines:
            if item and (line.startswith('## ') or line.startswith('### ')):
                yield topic, ''.join(item).rstrip() + '\n'
                item = None
            if line.startswith('## '):
                name = line[3:].strip()
                topic = None if name.startswith('원본 수정 이력') else name
            elif line.startswith('### ') and topic:
                item = [line]
            elif item is not None:
                item.append(line)


def main():
    if len(sys.argv) != 2:
        sys.exit('usage: collect-gaps.py {topicId|--list}')
    if sys.argv[1] == '--list':
        count = collections.Counter(topic for topic, _ in items())
        for topic, n in count.most_common():
            print('%-26s %d' % (topic, n))
        print('%-26s %d' % ('합계', sum(count.values())))
        return
    for topic, item in items():
        if topic == sys.argv[1]:
            print(item)


main()
