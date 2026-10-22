// IAM Roles Anywhere 단계 그림 19장의 설계 스펙. 단계마다 정지 그림 하나(버튼·캡션 없음), viewBox 폭 208 한 배치.
// 노드 [x, y, 폭](높이 32), 그룹 [x, y, 폭, 높이], 곁말 [x, y, textAnchor]. 글자: 노드 라벨 10, 그룹 라벨·곁말 9.
// 색: M = diagram-managed(파랑), R = diagram-resource(청록), D = disabled(회색)

const M = 'stroke-diagram-managed'
const R = 'stroke-diagram-resource'
const D = 'stroke-disabled'

export const anchor = 'identity-federation.iam-roles-anywhere'

// 노드 id → 라벨·색. 같은 대상은 모든 그림에서 같은 id·라벨·색을 쓴다.
export const nodeTexts = {
  'private-key': ['private.key', D], 'ca-crt': ['ca.crt', D], 'server-key': ['server.key', D],
  'server-csr': ['server.csr', D], 'server-crt': ['server.crt', D], signature: ['디지털 서명', D],
  helper: ['aws_signing_helper', D], cli: ['AWS CLI', D], arns: ['ARN 셋', D],
  'trust-anchor': ['신뢰 앵커', M], profile: ['S3UploadProfile', M], ra: ['IAM Roles Anywhere', M], sts: ['STS', M],
  role: ['S3UploadRole', R], 'trust-policy': ['신뢰 정책', R], bucket: ['S3 버킷', R],
}

export const groupTexts = {
  ca: '인증 기관', server: '회사 서버', 'roles-anywhere': 'IAM Roles Anywhere', iam: 'IAM', json: 'JSON', config: '~/.aws/config',
}

export const figures = {
  1: {
    label: '1단계 그림: 인증 기관에서 OpenSSL로 private.key를 만든다',
    viewBox: [208, 80],
    groups: { ca: [8, 8, 192, 64] },
    members: { ca: ['private-key'] },
    nodes: { 'private-key': [24, 32, 80] },
    paths: {},
    notes: { make: [116, 52, 'start', 'OpenSSL로 생성'] },
  },
  2: {
    label: '2단계 그림: private.key로 자체 서명해 ca.crt를 만든다',
    viewBox: [208, 96],
    groups: { ca: [8, 8, 192, 80] },
    members: { ca: ['private-key', 'ca-crt'] },
    nodes: { 'private-key': [16, 32, 76], 'ca-crt': [116, 32, 76] },
    paths: { sign: 'M92 48 H116' },
    notes: { sign: [104, 80, 'middle', '자체 서명'] },
  },
  3: {
    label: '3단계 그림: ca.crt를 IAM Roles Anywhere에 등록해 신뢰 앵커를 만든다',
    viewBox: [208, 176],
    groups: { ca: [8, 8, 192, 64], 'roles-anywhere': [8, 104, 192, 64] },
    members: { ca: ['ca-crt'], 'roles-anywhere': ['trust-anchor'] },
    nodes: { 'ca-crt': [112, 32, 80], 'trust-anchor': [112, 128, 80] },
    paths: { register: 'M152 64 V128' },
    notes: { register: [144, 92, 'end', '등록'] },
  },
  4: {
    label: '4단계 그림: 회사 서버에서 OpenSSL로 server.key를 만든다',
    viewBox: [208, 80],
    groups: { server: [8, 8, 192, 64] },
    members: { server: ['server-key'] },
    nodes: { 'server-key': [24, 32, 80] },
    paths: {},
    notes: { make: [116, 52, 'start', 'OpenSSL로 생성'] },
  },
  5: {
    label: '5단계 그림: server.key의 공개키와 서버 이름으로 server.csr를 만든다',
    viewBox: [208, 96],
    groups: { server: [8, 8, 192, 80] },
    members: { server: ['server-key', 'server-csr'] },
    nodes: { 'server-key': [16, 32, 76], 'server-csr': [116, 32, 76] },
    paths: { request: 'M92 48 H116' },
    notes: { request: [104, 80, 'middle', '공개키·서버 이름'] },
  },
  6: {
    label: '6단계 그림: server.csr를 인증 기관에 내고 server.crt를 발급받는다',
    viewBox: [208, 184],
    groups: { ca: [8, 8, 192, 64], server: [8, 112, 192, 64] },
    members: { ca: ['private-key', 'ca-crt'], server: ['server-crt', 'server-csr'] },
    nodes: { 'private-key': [16, 32, 80], 'ca-crt': [112, 32, 80], 'server-crt': [16, 136, 80], 'server-csr': [112, 136, 80] },
    paths: { request: 'M152 136 V72', issue: 'M64 72 V136' },
    notes: { request: [160, 96, 'start', '신청'], issue: [72, 96, 'start', '발급'] },
  },
  7: {
    label: '7단계 그림: S3UploadRole에 권한 정책과 신뢰 정책을 둔다',
    viewBox: [208, 140],
    groups: { iam: [8, 8, 192, 124] },
    members: { iam: ['role'] },
    nodes: { role: [16, 32, 80] },
    paths: {},
    notes: {
      permission: [16, 88, 'start', '권한 정책: s3:PutObject 허용'],
      trust: [16, 104, 'start', '신뢰 정책: 서비스 주체'],
      principal: [16, 120, 'start', 'rolesanywhere.amazonaws.com'],
    },
  },
  8: {
    label: '8단계 그림: S3UploadProfile에 S3UploadRole을 지정한다',
    viewBox: [208, 176],
    groups: { 'roles-anywhere': [8, 8, 192, 64], iam: [8, 104, 192, 64] },
    members: { 'roles-anywhere': ['profile'], iam: ['role'] },
    nodes: { profile: [16, 32, 96], role: [104, 128, 80] },
    paths: { assign: 'M64 64 V144 H104' },
    notes: { assign: [72, 92, 'start', '지정'] },
  },
  9: {
    label: '9단계 그림: 회사 서버에 aws_signing_helper를 설치한다',
    viewBox: [208, 80],
    groups: { server: [8, 8, 192, 64] },
    members: { server: ['helper'] },
    nodes: { helper: [24, 32, 120] },
    paths: {},
    notes: { install: [156, 52, 'start', '설치'] },
  },
  10: {
    label: '10단계 그림: server.crt·server.key·ARN 셋으로 aws_signing_helper가 IAM Roles Anywhere에 발급을 요청한다',
    viewBox: [208, 216],
    groups: { server: [8, 8, 192, 136] },
    members: { server: ['server-crt', 'server-key', 'helper', 'arns'] },
    nodes: { 'server-crt': [16, 32, 80], 'server-key': [112, 32, 80], helper: [16, 96, 112], arns: [148, 96, 48], ra: [16, 176, 120] },
    paths: { crt: 'M56 64 V96', key: 'M152 64 V80 H120 V96', arns: 'M148 112 H128', request: 'M72 128 V176' },
    notes: { request: [80, 164, 'start', '발급 요청 (테스트)'] },
  },
  11: {
    label: '11단계 그림: server.key로 만든 디지털 서명과 server.crt를 IAM Roles Anywhere에 보낸다',
    viewBox: [208, 224],
    groups: { server: [8, 8, 192, 112] },
    members: { server: ['server-key', 'server-crt', 'signature'] },
    nodes: { 'server-key': [16, 32, 80], 'server-crt': [112, 32, 80], signature: [16, 80, 80], ra: [16, 160, 120] },
    paths: { sign: 'M56 64 V80', 'send-signature': 'M56 112 V160', 'send-crt': 'M152 64 V176 H136' },
    notes: { 'with-arns': [64, 140, 'start', '세 ARN과 함께 전송'], 'no-key': [16, 212, 'start', '개인키 자체는 보내지 않는다'] },
  },
  12: {
    label: '12단계 그림: 공개키로 디지털 서명을 검증한 뒤 ca.crt로 server.crt를 확인한다',
    viewBox: [208, 208],
    groups: { 'roles-anywhere': [8, 8, 192, 192] },
    members: { 'roles-anywhere': ['signature', 'server-crt', 'trust-anchor'] },
    nodes: { signature: [16, 32, 80], 'server-crt': [16, 96, 80], 'trust-anchor': [16, 160, 80] },
    paths: { first: 'M56 96 V64', second: 'M56 160 V128' },
    notes: { first: [64, 84, 'start', '1 공개키로 검증'], second: [64, 148, 'start', '2 ca.crt로 확인'] },
  },
  13: {
    label: '13단계 그림: 프로필에 역할이 등록돼 있는지, 역할의 신뢰 정책이 IAM Roles Anywhere를 신뢰하는지 확인한다',
    viewBox: [208, 224],
    groups: { 'roles-anywhere': [8, 8, 192, 64], iam: [8, 104, 192, 112] },
    members: { 'roles-anywhere': ['profile'], iam: ['role', 'trust-policy'] },
    nodes: { profile: [16, 32, 96], role: [16, 128, 96], 'trust-policy': [16, 176, 96] },
    paths: { 'in-profile': 'M64 64 V128', trusts: 'M112 192 H168 V72' },
    notes: { 'in-profile': [72, 92, 'start', '1 등록돼 있나'], trusts: [160, 140, 'end', '2 신뢰하나'] },
  },
  14: {
    label: '14단계 그림: IAM Roles Anywhere가 STS에 AssumeRole을 호출해 임시 자격 증명을 받는다',
    viewBox: [208, 96],
    groups: {},
    members: {},
    nodes: { ra: [8, 32, 120], sts: [168, 32, 32] },
    paths: { assume: 'M128 40 H168', credentials: 'M168 56 H128' },
    notes: { assume: [148, 24, 'middle', 'AssumeRole'], credentials: [148, 80, 'middle', '임시 자격 증명'] },
  },
  15: {
    label: '15단계 그림: 임시 자격 증명이 aws_signing_helper에 전달돼 네 값이 JSON으로 출력된다',
    viewBox: [208, 264],
    groups: { server: [8, 72, 192, 184], json: [16, 152, 176, 96] },
    members: { server: ['helper'], json: [] },
    nodes: { ra: [8, 8, 120], helper: [16, 96, 120] },
    paths: { deliver: 'M68 40 V96', print: 'M76 128 V152' },
    notes: {
      deliver: [76, 60, 'start', '임시 자격 증명'], print: [84, 144, 'start', '출력'],
      'access-key-id': [26, 186, 'start', 'Access Key ID'], 'secret-access-key': [26, 200, 'start', 'Secret Access Key'],
      'session-token': [26, 214, 'start', 'Session Token'], expiration: [26, 228, 'start', 'Expiration'],
    },
  },
  16: {
    label: '16단계 그림: 회사 서버에 AWS CLI를 설치한다',
    viewBox: [208, 80],
    groups: { server: [8, 8, 192, 64] },
    members: { server: ['cli'] },
    nodes: { cli: [24, 32, 80] },
    paths: {},
    notes: { install: [116, 52, 'start', '설치'] },
  },
  17: {
    label: '17단계 그림: AWS CLI가 ~/.aws/config의 s3-logs 프로필을 읽어 aws_signing_helper를 실행한다',
    viewBox: [208, 232],
    groups: { server: [8, 8, 192, 216], config: [16, 88, 176, 72] },
    members: { server: ['cli', 'helper'], config: [] },
    nodes: { cli: [16, 32, 80], helper: [16, 184, 120] },
    paths: { read: 'M56 64 V88', run: 'M56 160 V184' },
    notes: {
      read: [64, 80, 'start', '읽는다'], run: [64, 176, 'start', '실행'],
      profile: [26, 122, 'start', '[profile s3-logs]'], process: [26, 136, 'start', 'credential_process = …'],
      region: [26, 150, 'start', 'region = ap-northeast-2'],
    },
  },
  18: {
    label: '18단계 그림: S3 버킷을 만들거나 확인하고, S3UploadRole이 그 버킷에 s3:PutObject를 허용하는지 본다',
    viewBox: [208, 128],
    groups: {},
    members: {},
    nodes: { role: [16, 8, 80], bucket: [16, 88, 80] },
    paths: { allow: 'M56 40 V88' },
    notes: { allow: [64, 68, 'start', 's3:PutObject 허용'], check: [104, 108, 'start', '생성 또는 확인'] },
  },
  19: {
    label: '19단계 그림: AWS CLI가 aws_signing_helper로 임시 자격 증명을 받아 aws s3 cp로 S3 버킷에 올린다',
    viewBox: [208, 232],
    groups: { server: [8, 8, 192, 152] },
    members: { server: ['cli', 'helper'] },
    nodes: { cli: [16, 32, 80], helper: [16, 104, 120], bucket: [144, 192, 56] },
    paths: { run: 'M40 64 V104', credentials: 'M80 104 V64', upload: 'M96 48 H184 V192' },
    notes: {
      run: [48, 88, 'start', '실행'], credentials: [88, 88, 'start', '임시 자격 증명'],
      rerun: [16, 150, 'start', '11~15단계가 다시 일어난다'], upload: [176, 180, 'end', 'aws s3 cp'],
    },
  },
}
