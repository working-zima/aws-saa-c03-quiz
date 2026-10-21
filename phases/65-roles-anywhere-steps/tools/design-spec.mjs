// 쓰지 않는 설계 기록(ADR-050 「남겨 둔 것」): 처음 미리보기의 구간 버튼 도식. 사용자가 단계마다 본문 안의 작은 그림(step-figures.mjs)을 골랐다.
// 미리보기: https://claude.ai/artifact/KQDhbNNYEW4ZxfBDSEXF9T

// IAM Roles Anywhere 단계 도식 설계 스펙. 좌표(세로 280·가로 440)와 문구를 한곳에 둔다.
// 노드 [x, y, 폭](높이 32), 그룹 [x, y, 폭, 높이], 곁말 [x, y, textAnchor].
// 색: M = diagram-managed(파랑), R = diagram-resource(청록), D = disabled(회색)

const M = 'stroke-diagram-managed'
const R = 'stroke-diagram-resource'
const D = 'stroke-disabled'
const P = 'identity-federation.'

export const diagrams = {
  'roles-anywhere-steps': {
    anchor: P + 'iam-roles-anywhere',
    component: 'RolesAnywhereStepsDiagram',
    label: 'IAM Roles Anywhere 단계 도식',
    svgLabel: '인증 기관·회사 서버·IAM Roles Anywhere·STS·IAM 역할·S3 버킷',
    question: '회사 서버는 장기 자격 증명 없이 어떻게 S3에 로그를 올릴까?',
    idleCaption: '구간을 고르면 그 단계들에서 무엇이 어디로 오가는지 볼 수 있다.',
    legend: '파랑: IAM Roles Anywhere의 신뢰 앵커·프로필과 STS · 청록: 계정 안의 IAM 역할과 S3 버킷 · 회색: 회사 쪽 인증 기관과 서버 안의 파일·프로그램.',
    sources: [P + 'iam-roles-anywhere'],
    labels: {
      ca: '인증 기관', keys: '서버 인증서·개인키', helper: 'aws_signing_helper', cli: 'AWS CLI',
      'trust-anchor': '신뢰 앵커', profile: '프로필', role: 'IAM 역할', sts: 'STS', s3: 'S3 버킷',
    },
    colors: { ca: D, keys: D, helper: D, cli: D, 'trust-anchor': M, profile: M, sts: M, role: R, s3: R },
    groupLabels: { server: '회사 서버', aws: 'AWS', 'roles-anywhere': 'IAM Roles Anywhere' },
    members: {
      server: ['keys', 'helper', 'cli'],
      aws: ['trust-anchor', 'profile', 'role', 'sts', 's3'],
      'roles-anywhere': ['trust-anchor', 'profile'],
    },
    noteTexts: {
      'step-3': '3 등록', 'step-6': '6 발급', 'step-8': '8 지정',
      'step-11': '11 서명·인증서', 'step-12': '12 검증', 'step-13': '13 확인', 'step-14': '14 AssumeRole', 'step-15': '15 임시 자격 증명',
      'step-19-run': '11~15 다시', 'step-19-upload': '19 업로드',
    },
    tall: {
      viewBox: [280, 448],
      groups: { server: [4, 64, 248, 112], aws: [4, 216, 248, 224], 'roles-anywhere': [12, 240, 232, 80] },
      nodes: {
        ca: [12, 8, 104],
        keys: [12, 88, 112], cli: [140, 88, 104], helper: [12, 136, 128],
        profile: [20, 264, 96], 'trust-anchor': [140, 264, 96],
        role: [20, 344, 96], sts: [140, 344, 96], s3: [140, 392, 96],
      },
      paths: {
        'ca-keys': 'M64 40 V88',
        'ca-anchor': 'M116 24 H264 V280 H236',
        'profile-role': 'M68 296 V344',
        'helper-ra': 'M40 168 V240',
        'ra-helper': 'M128 240 V168',
        'ra-sts': 'M188 320 V344',
        'cli-helper': 'M192 120 V152 H140',
        'cli-s3': 'M244 104 H264 V408 H236',
      },
      notes: {
        'step-3': [190, 18, 'middle'], 'step-6': [72, 52, 'start'], 'step-8': [76, 336, 'start'],
        'step-11': [48, 200, 'start'], 'step-12': [188, 312, 'middle'], 'step-13': [68, 312, 'middle'],
        'step-14': [180, 336, 'end'], 'step-15': [136, 200, 'start'],
        'step-19-run': [200, 144, 'start'], 'step-19-upload': [258, 196, 'end'],
      },
    },
    wide: {
      viewBox: [440, 280],
      groups: { server: [4, 56, 144, 168], aws: [232, 8, 204, 264], 'roles-anywhere': [240, 32, 188, 128] },
      nodes: {
        ca: [12, 8, 104],
        keys: [12, 80, 128], helper: [12, 128, 128], cli: [12, 176, 128],
        'trust-anchor': [248, 56, 80], profile: [340, 56, 80],
        sts: [248, 184, 80], role: [340, 184, 80], s3: [340, 232, 80],
      },
      paths: {
        'ca-keys': 'M64 40 V80',
        'ca-anchor': 'M116 24 H200 V72 H248',
        'profile-role': 'M380 88 V184',
        'helper-ra': 'M140 136 H240',
        'ra-helper': 'M240 152 H140',
        'ra-sts': 'M288 160 V184',
        'cli-helper': 'M76 176 V160',
        'cli-s3': 'M140 192 H200 V248 H340',
      },
      notes: {
        'step-3': [158, 18, 'middle'], 'step-6': [72, 50, 'start'], 'step-8': [388, 176, 'start'],
        'step-11': [190, 130, 'middle'], 'step-12': [288, 104, 'middle'], 'step-13': [380, 104, 'middle'],
        'step-14': [296, 176, 'start'], 'step-15': [190, 168, 'middle'],
        'step-19-run': [84, 172, 'start'], 'step-19-upload': [244, 242, 'start'],
      },
    },
    scenarios: [
      { id: 'setup', label: '준비 1~8', nodes: ['ca', 'keys', 'trust-anchor', 'profile', 'role'],
        paths: ['ca-keys', 'ca-anchor', 'profile-role'], notes: ['step-3', 'step-6', 'step-8'],
        caption: 'ca.crt를 신뢰 앵커로 등록하고 server.crt를 발급한 뒤, 프로필에 IAM 역할을 지정한다.',
        sources: [P + 'iam-roles-anywhere'] },
      { id: 'issue', label: '발급 9~15', nodes: ['keys', 'helper', 'trust-anchor', 'profile', 'role', 'sts'],
        paths: ['helper-ra', 'ra-helper', 'ra-sts'], notes: ['step-11', 'step-12', 'step-13', 'step-14', 'step-15'],
        caption: 'IAM Roles Anywhere가 서명·인증서와 역할을 확인한 뒤 STS 임시 자격 증명을 넘긴다.',
        sources: [P + 'iam-roles-anywhere'] },
      { id: 'upload', label: '업로드 16~19', nodes: ['cli', 'helper', 's3'],
        paths: ['cli-helper', 'cli-s3'], notes: ['step-19-run', 'step-19-upload'],
        caption: 'AWS CLI가 명령마다 aws_signing_helper로 새 임시 자격 증명을 받아 S3에 올린다.',
        sources: [P + 'iam-roles-anywhere'] },
    ],
  },
}

export const tables = {}
