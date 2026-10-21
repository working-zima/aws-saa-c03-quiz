// 설계 승인본: 미리보기와 step 문서를 만든 좌표·문구. 실행 결과를 이 파일과 대조한다(phase 62 verification과 같은 방식).
// 미리보기: https://claude.ai/artifact/BYcW9db3DtN84kJpcuwerQ

// IAM 주제 시각 자료 설계 스펙. 좌표(세로 280·가로 440)와 문구를 한곳에 둔다.
// n(id, 라벨, 색, x, y, 폭) — 색: M = diagram-managed, R = diagram-resource, D = disabled

const M = 'stroke-diagram-managed'
const R = 'stroke-diagram-resource'
const D = 'stroke-disabled'
const P = 'iam-permissions.'

export const diagrams = {
  'group-policy': {
    anchor: P + 'iam-group-policy-attachment',
    component: 'GroupPolicyDiagram',
    label: 'IAM 그룹 정책 도식',
    svgLabel: '사용자마다 붙인 정책과 그룹에 붙인 정책',
    question: '권한 기준을 바꾸려면 몇 곳을 고쳐야 할까?',
    idleCaption: '붙이는 방식을 고르면 정책이 어디에 붙고 기준을 바꿀 때 몇 곳을 고치는지 볼 수 있다.',
    legend: '파랑: IAM 정책 · 회색: IAM 사용자. 큰 박스가 IAM 그룹 하나다.',
    sources: [P + 'iam-group-policy-attachment'],
    labels: {
      'group-policy': '그룹에 붙인 정책', 'policy-a': '직접 붙인 정책', 'policy-b': '직접 붙인 정책', 'policy-c': '직접 붙인 정책',
      'user-a': '사용자 A', 'user-b': '사용자 B', 'user-c': '사용자 C',
    },
    colors: { 'group-policy': M, 'policy-a': M, 'policy-b': M, 'policy-c': M, 'user-a': D, 'user-b': D, 'user-c': D },
    groupLabels: { group: 'IAM 그룹' },
    members: { group: ['user-a', 'user-b', 'user-c'] },
    noteTexts: { 'three-places': '고칠 곳 셋', 'one-place': '고칠 곳 하나', leftover: '그룹 기준과 따로 남음' },
    tall: {
      viewBox: [280, 232],
      groups: { group: [140, 56, 136, 152] },
      nodes: {
        'group-policy': [152, 8, 112],
        'policy-a': [12, 80, 104], 'policy-b': [12, 124, 104], 'policy-c': [12, 168, 104],
        'user-a': [152, 80, 112], 'user-b': [152, 124, 112], 'user-c': [152, 168, 112],
      },
      paths: {
        'group-policy-group': 'M208 40 V56',
        'policy-a-user-a': 'M116 96 H152', 'policy-b-user-b': 'M116 140 H152', 'policy-c-user-c': 'M116 184 H152',
      },
      notes: { 'three-places': [64, 224, 'middle'], 'one-place': [208, 224, 'middle'], leftover: [64, 72, 'middle'] },
    },
    wide: {
      viewBox: [440, 148],
      groups: { group: [156, 56, 280, 64] },
      nodes: {
        'group-policy': [8, 80, 120],
        'policy-a': [166, 8, 84], 'policy-b': [258, 8, 84], 'policy-c': [350, 8, 84],
        'user-a': [170, 80, 76], 'user-b': [262, 80, 76], 'user-c': [354, 80, 76],
      },
      paths: {
        'group-policy-group': 'M128 96 H156',
        'policy-a-user-a': 'M208 40 V80', 'policy-b-user-b': 'M300 40 V80', 'policy-c-user-c': 'M392 40 V80',
      },
      notes: { 'three-places': [300, 140, 'middle'], 'one-place': [300, 140, 'middle'], leftover: [158, 28, 'end'] },
    },
    scenarios: [
      { id: 'per-user', label: '사용자마다', nodes: ['policy-a', 'policy-b', 'policy-c', 'user-a', 'user-b', 'user-c'],
        paths: ['policy-a-user-a', 'policy-b-user-b', 'policy-c-user-c'], notes: ['three-places'],
        caption: '정책을 사람마다 붙이면 붙는 곳이 사람 수만큼 생긴다. 기준을 바꿀 때 전부를 훑어야 한다.',
        sources: [P + 'iam-group-policy-attachment'] },
      { id: 'group', label: '그룹에', nodes: ['group-policy', 'user-a', 'user-b', 'user-c'],
        paths: ['group-policy-group'], notes: ['one-place'],
        caption: '직무별 그룹에 정책을 붙이고 사용자를 그룹에 넣으면 권한의 기준이 그룹 하나에 모인다.',
        sources: [P + 'iam-group-policy-attachment'] },
      { id: 'leftover', label: '직접 정책을 남기면', nodes: ['group-policy', 'policy-a', 'user-a', 'user-b', 'user-c'],
        paths: ['group-policy-group', 'policy-a-user-a'], notes: ['leftover'],
        caption: '사용자에게 직접 붙어 있던 정책을 떼지 않으면 그룹의 기준과 따로 살아 있는 권한이 된다.',
        sources: [P + 'iam-group-policy-attachment'] },
    ],
  },

  'role-paths': {
    anchor: P + 'cross-account-iam-role',
    component: 'RolePathsDiagram',
    label: 'IAM 역할을 맡는 경로 도식',
    svgLabel: '인스턴스 프로파일·IAM Roles Anywhere·신뢰 정책',
    question: '역할을 맡는 쪽은 어떤 길로 임시 자격 증명을 받을까?',
    idleCaption: '맡는 쪽을 고르면 어떤 수단을 거쳐 IAM 역할에 이르는지 볼 수 있다. 역할에는 액세스 키가 없다.',
    legend: '파랑: IAM 역할과 역할을 맡기는 수단 · 회색: 역할을 맡는 쪽. 데이터 센터와 다른 계정은 박스로 나타냈다.',
    sources: [P + 'iam-role', P + 'instance-profile', P + 'iam-roles-anywhere', P + 'cross-account-iam-role'],
    labels: {
      ec2: 'EC2 인스턴스', profile: '인스턴스 프로파일', system: '시스템', 'roles-anywhere': 'IAM Roles Anywhere',
      workload: '워크로드', trust: '신뢰 정책', role: 'IAM 역할',
    },
    colors: { ec2: D, profile: M, system: D, 'roles-anywhere': M, workload: D, trust: M, role: M },
    groupLabels: { datacenter: '데이터 센터', 'other-account': '다른 계정' },
    members: { datacenter: ['system'], 'other-account': ['workload'] },
    noteTexts: { 'no-key': '인스턴스에 키를 두지 않음', cert: 'X.509 인증서 제시', temp: '임시 자격 증명을 받는다' },
    tall: {
      viewBox: [280, 280],
      groups: { datacenter: [4, 56, 120, 60], 'other-account': [4, 132, 120, 60] },
      nodes: {
        ec2: [16, 8, 92], profile: [152, 8, 116],
        system: [16, 76, 92], 'roles-anywhere': [152, 76, 116],
        workload: [16, 152, 92], trust: [152, 152, 116],
        role: [152, 220, 116],
      },
      paths: {
        'ec2-profile': 'M108 24 H152', 'profile-role': 'M268 24 H274 V236 H268',
        'system-ra': 'M108 92 H152', 'ra-role': 'M268 92 H274 V236 H268',
        'workload-trust': 'M108 168 H152', 'trust-role': 'M210 184 V220',
      },
      notes: { 'no-key': [62, 50, 'middle'], cert: [62, 128, 'middle'], temp: [210, 272, 'middle'] },
    },
    wide: {
      viewBox: [440, 224],
      groups: { datacenter: [152, 8, 136, 60], 'other-account': [296, 8, 136, 60] },
      nodes: {
        ec2: [28, 28, 96], system: [172, 28, 96], workload: [316, 28, 96],
        profile: [18, 96, 116], 'roles-anywhere': [162, 96, 116], trust: [306, 96, 116],
        role: [162, 168, 116],
      },
      paths: {
        'ec2-profile': 'M76 60 V96', 'profile-role': 'M76 128 V184 H162',
        'system-ra': 'M220 60 V96', 'ra-role': 'M220 128 V168',
        'workload-trust': 'M364 60 V96', 'trust-role': 'M364 128 V184 H278',
      },
      notes: { 'no-key': [76, 20, 'middle'], cert: [228, 82, 'start'], temp: [220, 216, 'middle'] },
    },
    scenarios: [
      { id: 'instance-profile', label: 'EC2', nodes: ['ec2', 'profile', 'role'], paths: ['ec2-profile', 'profile-role'],
        notes: ['no-key', 'temp'],
        caption: 'EC2에는 IAM 역할을 인스턴스 프로파일에 연결해 붙인다. 인스턴스 안에 액세스 키를 두지 않는다.',
        sources: [P + 'instance-profile', P + 'iam-role'] },
      { id: 'roles-anywhere', label: '데이터 센터', nodes: ['system', 'roles-anywhere', 'role'], paths: ['system-ra', 'ra-role'],
        notes: ['cert', 'temp'],
        caption: '신뢰한 인증 기관의 X.509 인증서를 IAM Roles Anywhere가 임시 자격 증명으로 바꾼다.',
        sources: [P + 'iam-roles-anywhere'] },
      { id: 'trust-policy', label: '다른 계정', nodes: ['workload', 'trust', 'role'], paths: ['workload-trust', 'trust-role'],
        notes: ['temp'],
        caption: '자원이 있는 계정의 역할이 신뢰 정책으로 다른 계정의 주체를 허용한다. 그 주체가 역할을 맡는다.',
        sources: [P + 'cross-account-iam-role', P + 'iam-user-is-account-scoped'] },
    ],
  },

  abac: {
    anchor: P + 'abac',
    component: 'AbacTagDiagram',
    label: '속성 기반 액세스 제어 도식',
    svgLabel: '태그 비교와 이름 나열',
    question: '리소스가 계속 늘어도 정책을 고치지 않으려면?',
    idleCaption: '방식을 고르면 태그로 비교할 때와 이름을 나열할 때 새 키가 어떻게 되는지 볼 수 있다.',
    legend: '파랑: 정책과 리소스 · 회색: 요청하는 주체. 팀 A·B는 태그 값을 구별하는 이름이다.',
    sources: [P + 'abac'],
    labels: {
      principal: '역할 · 팀 A', 'tag-policy': '태그가 같으면 허용', 'list-policy': '이름을 나열한 정책',
      'key-1': '키 1 · 팀 A', 'key-2': '키 2 · 팀 B', 'key-new': '새 키 · 팀 A',
    },
    colors: { principal: D, 'tag-policy': M, 'list-policy': M, 'key-1': M, 'key-2': M, 'key-new': M },
    groupLabels: {},
    members: {},
    noteTexts: { mismatch: '태그가 달라 닿지 않음', auto: '정책 수정 없이 들어옴', manual: '이름을 더해야 닿음' },
    tall: {
      viewBox: [280, 216],
      groups: {},
      nodes: {
        principal: [82, 8, 116],
        'tag-policy': [12, 80, 124], 'list-policy': [144, 80, 124],
        'key-1': [10, 160, 80], 'key-2': [100, 160, 80], 'key-new': [190, 160, 80],
      },
      paths: {
        'principal-tag': 'M120 40 V60 H74 V80', 'principal-list': 'M160 40 V60 H206 V80',
        'tag-key-1': 'M50 112 V160', 'tag-key-new': 'M120 112 V136 H230 V160',
        'list-key-1': 'M170 112 V128 H60 V160',
      },
      notes: { mismatch: [140, 208, 'middle'], auto: [230, 208, 'middle'], manual: [230, 208, 'middle'] },
    },
    wide: {
      viewBox: [440, 192],
      groups: {},
      nodes: {
        principal: [8, 72, 96],
        'tag-policy': [136, 32, 124], 'list-policy': [136, 112, 124],
        'key-1': [320, 8, 96], 'key-2': [320, 72, 96], 'key-new': [320, 136, 96],
      },
      paths: {
        'principal-tag': 'M104 80 H120 V48 H136', 'principal-list': 'M104 96 H120 V128 H136',
        'tag-key-1': 'M260 48 H288 V24 H320', 'tag-key-new': 'M260 56 H280 V152 H320',
        'list-key-1': 'M260 120 H296 V32 H320',
      },
      notes: { mismatch: [368, 120, 'middle'], auto: [368, 184, 'middle'], manual: [368, 184, 'middle'] },
    },
    scenarios: [
      { id: 'tag-compare', label: '태그 비교', nodes: ['principal', 'tag-policy', 'key-1', 'key-2'],
        paths: ['principal-tag', 'tag-key-1'], notes: ['mismatch'],
        caption: '주체와 리소스에 붙은 태그를 조건 키로 비교한다. 태그가 같은 리소스에만 접근이 허용된다.',
        sources: [P + 'abac'] },
      { id: 'new-key', label: '새 키가 생기면', nodes: ['principal', 'tag-policy', 'key-1', 'key-new'],
        paths: ['principal-tag', 'tag-key-1', 'tag-key-new'], notes: ['auto'],
        caption: '새 키에 같은 태그를 붙이면 정책을 고치지 않아도 규칙에 들어온다. 키가 여러 리전에 생겨도 같다.',
        sources: [P + 'abac'] },
      { id: 'name-list', label: '이름을 나열하면', nodes: ['principal', 'list-policy', 'key-1', 'key-new'],
        paths: ['principal-list', 'list-key-1'], notes: ['manual'],
        caption: '리소스 이름을 정책에 나열하면 새 키가 생길 때마다 정책에 이름을 하나씩 추가해야 한다.',
        sources: [P + 'abac'] },
    ],
  },

  boundary: {
    anchor: P + 'permissions-boundary',
    component: 'PermissionsBoundaryDiagram',
    label: '권한 경계 도식',
    svgLabel: '붙인 정책과 권한 경계가 겹치는 범위, 경계 부착 요구',
    question: '넓은 정책을 붙여도 권한이 넘지 않게 하려면?',
    idleCaption: '장면을 고르면 경계가 실제 권한을 어떻게 줄이고, 경계 없는 역할을 어떻게 막는지 볼 수 있다.',
    legend: '파랑: 실제 권한과 이를 지키는 장치 · 회색: 쓸 수 없는 권한과 역할 생성 쪽. 겹친 두 박스는 붙인 정책과 권한 경계의 범위다.',
    sources: [P + 'permissions-boundary', P + 'iam-policy'],
    labels: {
      'policy-only': '경계 밖', effective: '실제 권한', 'boundary-only': '정책에 없음',
      request: '경계 없는 역할 생성 요청', scp: 'SCP', rejected: '생성 거부', created: '규정 어긴 역할', found: '나중에 찾아 지움',
    },
    colors: {
      'policy-only': D, effective: M, 'boundary-only': D,
      request: D, scp: M, rejected: D, created: D, found: M,
    },
    groupLabels: { 'policy-range': '붙인 정책', 'boundary-range': '권한 경계' },
    members: { 'policy-range': ['policy-only', 'effective'], 'boundary-range': ['boundary-only', 'effective'] },
    noteTexts: {
      'not-usable': '쓸 수 없음', 'not-granted': '부여되지 않음', 'scp-requires': '경계 부착을 요구',
      'never-created': '역할이 생기지 않음', 'exists-until': '지우기 전까지 존재',
    },
    tall: {
      viewBox: [280, 344],
      groups: { 'policy-range': [104, 8, 172, 88], 'boundary-range': [4, 48, 172, 88] },
      nodes: {
        'policy-only': [196, 32, 64], effective: [108, 56, 64], 'boundary-only': [12, 72, 72],
        request: [72, 160, 136],
        scp: [30, 224, 80], rejected: [30, 288, 80],
        created: [162, 224, 96], found: [162, 288, 96],
      },
      paths: {
        'request-scp': 'M100 192 V224', 'scp-rejected': 'M70 256 V288',
        'request-created': 'M180 192 V224', 'created-found': 'M210 256 V288',
      },
      notes: {
        'not-usable': [228, 82, 'middle'], 'not-granted': [48, 122, 'middle'], 'scp-requires': [94, 216, 'end'],
        'never-created': [70, 336, 'middle'], 'exists-until': [210, 336, 'middle'],
      },
    },
    wide: {
      viewBox: [440, 192],
      groups: { 'policy-range': [88, 8, 148, 88], 'boundary-range': [4, 48, 156, 88] },
      nodes: {
        'policy-only': [168, 32, 60], effective: [92, 56, 64], 'boundary-only': [8, 72, 72],
        request: [276, 8, 140],
        scp: [252, 72, 80], rejected: [252, 136, 80],
        created: [340, 72, 96], found: [340, 136, 96],
      },
      paths: {
        'request-scp': 'M300 40 V72', 'scp-rejected': 'M292 104 V136',
        'request-created': 'M388 40 V72', 'created-found': 'M388 104 V136',
      },
      notes: {
        'not-usable': [198, 82, 'middle'], 'not-granted': [44, 122, 'middle'], 'scp-requires': [306, 60, 'start'],
        'never-created': [292, 184, 'middle'], 'exists-until': [388, 184, 'middle'],
      },
    },
    scenarios: [
      { id: 'boundary', label: '경계를 붙이면', nodes: ['effective'], paths: [], notes: ['not-usable', 'not-granted'],
        caption: '실제 권한은 붙인 정책과 권한 경계가 겹치는 범위다. 경계만으로는 권한이 생기지 않는다.',
        sources: [P + 'permissions-boundary', P + 'iam-policy'] },
      { id: 'scp', label: 'SCP가 부착 요구', nodes: ['request', 'scp', 'rejected'], paths: ['request-scp', 'scp-rejected'],
        notes: ['scp-requires', 'never-created'],
        caption: '역할을 만들 때 경계 부착을 요구하는 SCP를 걸면 경계 없는 역할은 처음부터 만들어지지 않는다.',
        sources: [P + 'permissions-boundary'] },
      { id: 'detect', label: '나중에 찾아 지움', nodes: ['request', 'created', 'found'], paths: ['request-created', 'created-found'],
        notes: ['exists-until'],
        caption: '어긴 역할을 나중에 찾아 지우는 방식은 만들어진 뒤에야 작동한다. 지우기 전까지 그 역할이 있다.',
        sources: [P + 'permissions-boundary'] },
    ],
  },

  'policy-evaluation': {
    anchor: P + 'iam-explicit-deny-precedence',
    component: 'PolicyEvaluationDiagram',
    label: '정책 평가 순서 도식',
    svgLabel: '명시적 거부·허용·기본 거부',
    question: '허용과 거부가 겹치면 어느 쪽이 이길까?',
    idleCaption: '요청을 고르면 정책 평가가 어떤 순서로 진행돼 어디에서 끝나는지 볼 수 있다.',
    legend: '파랑: 정책을 평가하는 단계 · 회색: 요청과 결과. 명시적 거부부터 차례로 본다.',
    sources: [P + 'iam-explicit-deny-precedence'],
    labels: {
      request: '요청', 'check-deny': '명시적 거부가 걸리나', denied: '거부 · 403',
      'check-allow': '허용 문장이 있나', allowed: '허용', 'default-deny': '기본 거부',
    },
    colors: { request: D, 'check-deny': M, denied: D, 'check-allow': M, allowed: D, 'default-deny': D },
    groupLabels: {},
    members: {},
    noteTexts: {
      'yes-1': '예', 'no-1': '아니오', 'yes-2': '예', 'no-2': '아니오',
      'allow-exists': '허용 문장이 있어도', 'source-ip': 'aws:SourceIp 대역 밖',
    },
    tall: {
      viewBox: [280, 248],
      groups: {},
      nodes: {
        request: [12, 8, 128], 'check-deny': [12, 64, 128], denied: [168, 64, 100],
        'check-allow': [12, 136, 128], allowed: [168, 136, 100], 'default-deny': [12, 208, 128],
      },
      paths: {
        'request-deny': 'M76 40 V64', 'deny-yes': 'M140 80 H168', 'deny-no': 'M76 96 V136',
        'allow-yes': 'M140 152 H168', 'allow-no': 'M76 168 V208',
      },
      notes: {
        'yes-1': [154, 74, 'middle'], 'no-1': [84, 120, 'start'], 'yes-2': [154, 146, 'middle'], 'no-2': [84, 192, 'start'],
        'allow-exists': [148, 28, 'start'], 'source-ip': [148, 28, 'start'],
      },
    },
    wide: {
      viewBox: [440, 128],
      groups: {},
      nodes: {
        request: [8, 16, 56], 'check-deny': [88, 16, 116], 'check-allow': [236, 16, 96], 'default-deny': [364, 16, 72],
        denied: [96, 88, 100], allowed: [234, 88, 100],
      },
      paths: {
        'request-deny': 'M64 32 H88', 'deny-yes': 'M146 48 V88', 'deny-no': 'M204 32 H236',
        'allow-yes': 'M284 48 V88', 'allow-no': 'M332 32 H364',
      },
      notes: {
        'yes-1': [152, 72, 'start'], 'no-1': [220, 26, 'middle'], 'yes-2': [290, 72, 'start'], 'no-2': [348, 26, 'middle'],
        'allow-exists': [8, 80, 'start'], 'source-ip': [8, 80, 'start'],
      },
    },
    scenarios: [
      { id: 'conditional-deny', label: '조건부 거부', nodes: ['request', 'check-deny', 'denied'], paths: ['request-deny', 'deny-yes'],
        notes: ['yes-1', 'allow-exists'],
        caption: '모든 리소스에 허용 문장이 있어도 같은 작업의 조건부 거부가 성립하면 막히고 403이 돌아온다.',
        sources: [P + 'iam-explicit-deny-precedence'] },
      { id: 'source-ip', label: '대역 밖 IP', nodes: ['request', 'check-deny', 'denied'], paths: ['request-deny', 'deny-yes'],
        notes: ['yes-1', 'source-ip'],
        caption: 'aws:SourceIp로 대역을 정해 두면 그 밖에서 온 호출은 권한이 있어도 거부 문장에 걸린다.',
        sources: [P + 'iam-explicit-deny-precedence'] },
      { id: 'allowed', label: '허용만', nodes: ['request', 'check-deny', 'check-allow', 'allowed'],
        paths: ['request-deny', 'deny-no', 'allow-yes'], notes: ['no-1', 'yes-2'],
        caption: '어느 거부에도 걸리지 않고 허용 문장이 있으면 요청이 허용된다.',
        sources: [P + 'iam-explicit-deny-precedence'] },
      { id: 'none', label: '아무 데도 안 걸림', nodes: ['request', 'check-deny', 'check-allow', 'default-deny'],
        paths: ['request-deny', 'deny-no', 'allow-no'], notes: ['no-1', 'no-2'],
        caption: '거부에도 허용에도 걸리지 않으면 요청은 기본 거부로 막힌다.',
        sources: [P + 'iam-explicit-deny-precedence'] },
    ],
  },

  notaction: {
    anchor: P + 'iam-notaction-deny',
    component: 'NotActionDenyDiagram',
    label: 'NotAction 거부 도식',
    svgLabel: '허용문·모든 작업 거부·NotAction 거부',
    question: '한 서비스만 쓰게 하려면 어떤 문장이 필요할까?',
    idleCaption: '정책 구성을 고르면 두 서비스가 열리는지 막히는지 볼 수 있다. 그룹에는 다른 서비스를 허용하는 정책이 이미 붙어 있다.',
    legend: '파랑: 정책 문장 · 회색: 요청이 향하는 서비스. 큰 박스가 그룹에 붙은 정책들이다.',
    sources: [P + 'iam-notaction-deny'],
    labels: {
      target: '남길 서비스', other: '다른 서비스',
      'allow-target': '남길 서비스 허용', 'other-allow': '다른 정책의 허용',
      'deny-all': '모든 작업 거부', 'deny-notaction': 'NotAction 거부',
    },
    colors: { target: D, other: D, 'allow-target': M, 'other-allow': M, 'deny-all': M, 'deny-notaction': M },
    groupLabels: { policies: '그룹에 붙은 정책' },
    members: { policies: ['allow-target', 'other-allow', 'deny-all', 'deny-notaction'] },
    noteTexts: {
      'target-open': '열림', 'other-open': '열림', 'target-blocked': '막힘', 'other-blocked': '막힘', 'target-kept': '남음',
    },
    tall: {
      viewBox: [280, 192],
      groups: { policies: [4, 72, 272, 112] },
      nodes: {
        target: [12, 24, 116], other: [152, 24, 116],
        'allow-target': [12, 96, 116], 'other-allow': [152, 96, 116],
        'deny-all': [12, 144, 116], 'deny-notaction': [152, 144, 116],
      },
      paths: {
        'allow-target-target': 'M100 96 V56', 'other-allow-other': 'M210 96 V56',
        'deny-all-target': 'M12 160 H8 V40 H12', 'deny-all-other': 'M128 160 H140 V40 H152',
        'deny-notaction-other': 'M268 160 H272 V40 H268',
      },
      notes: {
        'target-open': [70, 16, 'middle'], 'other-open': [210, 16, 'middle'],
        'target-blocked': [70, 16, 'middle'], 'other-blocked': [210, 16, 'middle'], 'target-kept': [70, 16, 'middle'],
      },
    },
    wide: {
      viewBox: [440, 144],
      groups: { policies: [4, 72, 432, 64] },
      nodes: {
        target: [56, 24, 112], other: [264, 24, 128],
        'allow-target': [12, 96, 96], 'deny-all': [116, 96, 96], 'deny-notaction': [220, 96, 100], 'other-allow': [328, 96, 100],
      },
      paths: {
        'allow-target-target': 'M96 96 V56', 'other-allow-other': 'M378 96 V56',
        'deny-all-target': 'M164 96 V56', 'deny-all-other': 'M212 112 H216 V40 H264',
        'deny-notaction-other': 'M270 96 V56',
      },
      notes: {
        'target-open': [112, 16, 'middle'], 'other-open': [328, 16, 'middle'],
        'target-blocked': [112, 16, 'middle'], 'other-blocked': [328, 16, 'middle'], 'target-kept': [112, 16, 'middle'],
      },
    },
    scenarios: [
      { id: 'allow-only', label: '허용문만', nodes: ['target', 'other', 'allow-target', 'other-allow'],
        paths: ['allow-target-target', 'other-allow-other'], notes: ['target-open', 'other-open'],
        caption: '허용문만 쓰면 그룹에 붙은 다른 정책이 다른 서비스를 허용할 때 그대로 열린다.',
        sources: [P + 'iam-notaction-deny'] },
      { id: 'deny-all', label: '모두 거부 + 허용', nodes: ['target', 'other', 'deny-all', 'allow-target'],
        paths: ['deny-all-target', 'deny-all-other', 'allow-target-target'], notes: ['target-blocked', 'other-blocked'],
        caption: '모든 작업을 거부하고 한 서비스를 허용하면 거부가 이겨 그 서비스까지 막힌다.',
        sources: [P + 'iam-notaction-deny'] },
      { id: 'notaction', label: 'NotAction 거부', nodes: ['target', 'other', 'deny-notaction', 'other-allow'],
        paths: ['deny-notaction-other', 'other-allow-other'], notes: ['target-kept', 'other-blocked'],
        caption: 'Deny 문의 NotAction에 한 서비스를 적으면 그 서비스만 남는다. 다른 정책이 열어도 같다.',
        sources: [P + 'iam-notaction-deny'] },
    ],
  },

  'region-condition': {
    anchor: P + 'iam-requested-region-condition',
    component: 'RegionConditionDiagram',
    label: '리전 조건 키 도식',
    svgLabel: 'aws:RequestedRegion·aws:SourceIp·사후 알림',
    question: '승인된 리전 밖으로 가는 요청은 무엇이 막을까?',
    idleCaption: '구성을 고르면 조건이 요청의 어느 쪽을 보고, 승인되지 않은 리전으로 가는 요청이 어떻게 되는지 볼 수 있다.',
    legend: '파랑: 정책 평가와 리전, 알림 구성 · 회색: 요청을 보내는 사용자. 리전 A·B는 구별하는 이름이다.',
    sources: [P + 'iam-requested-region-condition'],
    labels: {
      user: '사용자', policy: '정책 평가', 'region-a': '리전 A · 승인됨', 'region-b': '리전 B · 승인 안 됨', notify: '일어난 뒤 알림',
    },
    colors: { user: D, policy: M, 'region-a': M, 'region-b': M, notify: M },
    groupLabels: {},
    members: {},
    noteTexts: {
      origin: '출발지를 본다', destination: '목적지를 본다', 'a-allowed': '허용',
      'b-denied': '요청 시점에 거부', 'b-reached': '막지 못함', happened: '이미 일어남',
    },
    tall: {
      viewBox: [280, 288],
      groups: {},
      nodes: {
        user: [82, 8, 116], policy: [82, 80, 116],
        'region-a': [12, 176, 116], 'region-b': [152, 176, 116], notify: [152, 248, 116],
      },
      paths: {
        'user-policy': 'M140 40 V80', 'policy-a': 'M110 112 V144 H70 V176', 'policy-b': 'M170 112 V144 H210 V176',
        'b-notify': 'M210 208 V248',
      },
      notes: {
        origin: [206, 28, 'start'], destination: [206, 100, 'start'], 'a-allowed': [70, 224, 'middle'],
        'b-denied': [210, 224, 'middle'], 'b-reached': [210, 224, 'middle'], happened: [144, 268, 'end'],
      },
    },
    wide: {
      viewBox: [440, 208],
      groups: {},
      nodes: {
        user: [8, 56, 88], policy: [136, 56, 104],
        'region-a': [284, 8, 120], 'region-b': [284, 104, 120], notify: [284, 168, 120],
      },
      paths: {
        'user-policy': 'M96 72 H136', 'policy-a': 'M240 64 H256 V24 H284', 'policy-b': 'M240 80 H256 V120 H284',
        'b-notify': 'M300 136 V168',
      },
      notes: {
        origin: [52, 108, 'middle'], destination: [188, 108, 'middle'], 'a-allowed': [344, 56, 'middle'],
        'b-denied': [352, 152, 'middle'], 'b-reached': [352, 152, 'middle'], happened: [276, 188, 'end'],
      },
    },
    scenarios: [
      { id: 'requested-region', label: 'aws:RequestedRegion', nodes: ['user', 'policy', 'region-a', 'region-b'],
        paths: ['user-policy', 'policy-a'], notes: ['destination', 'a-allowed', 'b-denied'],
        caption: 'aws:RequestedRegion은 요청이 향한 리전을 본다. 목록 밖 리전이면 요청 시점에 막힌다.',
        sources: [P + 'iam-requested-region-condition'] },
      { id: 'source-ip', label: 'aws:SourceIp', nodes: ['user', 'policy', 'region-a', 'region-b'],
        paths: ['user-policy', 'policy-a', 'policy-b'], notes: ['origin', 'b-reached'],
        caption: 'aws:SourceIp는 요청이 출발한 곳을 본다. 목적지 리전은 전혀 제한하지 못한다.',
        sources: [P + 'iam-requested-region-condition'] },
      { id: 'after-fact', label: '일어난 뒤 알림', nodes: ['user', 'policy', 'region-b', 'notify'],
        paths: ['user-policy', 'policy-b', 'b-notify'], notes: ['happened'],
        caption: '규정에 어긋난 동작을 일어난 뒤에 알리는 구성은 실수로 일어나는 것 자체를 막지 못한다.',
        sources: [P + 'iam-requested-region-condition'] },
    ],
  },

  'delegated-admin': {
    anchor: P + 'access-analyzer-delegated-administrator',
    component: 'DelegatedAdminDiagram',
    label: 'Access Analyzer 위임 관리자 도식',
    svgLabel: '관리 계정·감사 계정·구성원 계정',
    question: '조직 전체의 Access Analyzer 결과는 어떻게 한곳에 모일까?',
    idleCaption: '순서를 고르면 구성원 계정들의 결과가 감사 계정에 모이는지 볼 수 있다.',
    legend: '파랑: S3 버킷 · 청록: 계정. 큰 박스가 조직이다.',
    sources: [P + 'access-analyzer-delegated-administrator', P + 'iam-access-analyzer'],
    labels: {
      management: '관리 계정', 'member-1': '구성원 계정', 'member-2': '구성원 계정', audit: '감사 계정', bucket: 'S3 버킷과 정책',
    },
    colors: { management: R, 'member-1': R, 'member-2': R, audit: R, bucket: M },
    groupLabels: { org: '조직' },
    members: { org: ['management', 'member-1', 'member-2', 'audit', 'bucket'] },
    noteTexts: { delegate: '위임 관리자로 지정', gathered: '결과가 모인다', 'not-gathered': '결과가 모이지 않음' },
    tall: {
      viewBox: [280, 304],
      groups: { org: [4, 8, 272, 288] },
      nodes: {
        management: [82, 32, 116], 'member-1': [12, 104, 116], 'member-2': [152, 104, 116],
        audit: [82, 176, 116], bucket: [82, 240, 116],
      },
      paths: {
        'management-audit': 'M140 64 V176', 'member-1-audit': 'M70 136 V192 H82', 'member-2-audit': 'M210 136 V192 H198',
        'audit-bucket': 'M140 208 V240',
      },
      notes: { delegate: [148, 92, 'start'], gathered: [140, 224, 'middle'], 'not-gathered': [140, 288, 'middle'] },
    },
    wide: {
      viewBox: [440, 192],
      groups: { org: [4, 8, 432, 176] },
      nodes: {
        management: [16, 56, 104], audit: [168, 56, 104], 'member-1': [320, 24, 104], 'member-2': [320, 88, 104],
        bucket: [168, 128, 104],
      },
      paths: {
        'management-audit': 'M120 72 H168', 'member-1-audit': 'M320 40 H296 V64 H272', 'member-2-audit': 'M320 104 H296 V80 H272',
        'audit-bucket': 'M220 88 V128',
      },
      notes: { delegate: [144, 50, 'middle'], gathered: [220, 112, 'middle'], 'not-gathered': [220, 176, 'middle'] },
    },
    scenarios: [
      { id: 'delegate', label: '위임 관리자 지정', nodes: ['management', 'audit', 'member-1', 'member-2'],
        paths: ['management-audit', 'member-1-audit', 'member-2-audit'], notes: ['delegate', 'gathered'],
        caption: '관리 계정에서 감사 계정을 위임 관리자로 지정하면 구성원 계정들의 결과가 그 계정에 모인다.',
        sources: [P + 'access-analyzer-delegated-administrator'] },
      { id: 'bucket-first', label: '버킷부터 만들면', nodes: ['audit', 'bucket', 'member-1', 'member-2'],
        paths: ['audit-bucket'], notes: ['not-gathered'],
        caption: '버킷과 정책을 먼저 만들거나 감사 추적을 보내도 분석 결과는 모이지 않는다. 지정이 첫 조치다.',
        sources: [P + 'access-analyzer-delegated-administrator'] },
    ],
  },
}

export const tables = {
  'group-members': {
    anchor: P + 'iam-user-is-account-scoped',
    component: 'GroupMembersTable',
    label: 'IAM 그룹에 넣을 수 있는 것',
    columns: ['대상', '그룹에 넣기', '권한을 주는 방법'],
    columnWidths: ['34%', '20%', '46%'],
    rows: [
      { header: '같은 계정의 IAM 사용자', cells: ['가능', '그룹에 넣으면 그룹에 붙인 정책을 받는다'] },
      { header: '다른 계정의 IAM 사용자', cells: ['불가', '자원이 있는 계정의 역할을 신뢰 정책으로 허용한다'] },
      { header: 'EC2 인스턴스', cells: ['불가', 'IAM 역할을 쓴다'] },
      { header: 'IAM 역할', cells: ['불가', '역할에 정책을 직접 붙인다'] },
    ],
    sources: [P + 'iam-user', P + 'iam-group-users-only', P + 'iam-user-is-account-scoped', P + 'iam-policy'],
  },
  credentials: {
    anchor: P + 'iam-role',
    component: 'CredentialTable',
    label: 'IAM 사용자와 IAM 역할의 자격 증명',
    columns: ['견주는 것', 'IAM 사용자', 'IAM 역할'],
    columnWidths: ['24%', '40%', '36%'],
    rows: [
      { header: '접근 수단', cells: ['액세스 키(만료 시점 없음)', '역할을 맡아 받는 임시 자격 증명'] },
      { header: '보관과 전달', cells: ['사용자가 키를 직접 보관한다', '자격 증명을 서로 건넬 필요가 없다'] },
      { header: '멈추는 방법', cells: ['키를 비활성화하거나 삭제한다. 그 전까지 계속 유효하다', '필요할 때 언제든 역할을 해제한다'] },
    ],
    sources: [P + 'iam', P + 'iam-user', P + 'iam-role'],
  },
  'analyzer-tools': {
    anchor: P + 'network-access-analyzer',
    component: 'AnalyzerToolTable',
    label: '권한 검토에서 함께 비교되는 것',
    columns: ['도구·구성', '다루는 것', '하는 일'],
    columnWidths: ['34%', '26%', '40%'],
    rows: [
      { header: 'IAM Access Analyzer', cells: ['정책이 부여한 권한', '외부 주체와 공유되는 리소스와 최소 권한에서 벗어난 부분을 찾는다'] },
      { header: 'Network Access Analyzer', cells: ['VPC 네트워크 경로', 'VPC 안에서 통신이 어디까지 닿는지 분석한다. 권한 정책은 다루지 않는다'] },
      { header: '변경 경보 구성', cells: ['리소스 생성과 변경', '일이 일어났다는 사실을 알린다. 권한이 얼마나 넓은지는 분석하지 못한다'] },
      { header: '권한 경계', cells: ['주체 하나의 권한 상한', '그 주체가 가질 수 있는 권한의 최대치를 정한다'] },
    ],
    sources: [P + 'iam-access-analyzer', P + 'network-access-analyzer', P + 'permissions-boundary'],
  },
}

// 개념 순서대로 registry에 붙는 자리
export const order = [
  'group-policy', 'group-members', 'credentials', 'role-paths', 'abac', 'boundary',
  'policy-evaluation', 'notaction', 'region-condition', 'delegated-admin', 'analyzer-tools',
]
