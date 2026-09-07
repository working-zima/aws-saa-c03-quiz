import { describe, expect, it } from 'vitest'

import { questions, topics } from './index'

describe('학습 데이터 무결성', () => {
  it('보안·비용 보충 개념 23개가 지정된 주제의 개념 배열 끝에 추가된다', () => {
    const expectedSlugs: Record<string, string[]> = {
      'security-groups-nacl': [
        'security-group-referencing',
        'nacl-rule-limit',
        'web-acl-vs-nacl',
      ],
      'secrets-encryption': [
        'acm-cloudfront-region',
        'lambda-env-var-kms',
        'cloudhsm',
        'rotation-heuristic',
      ],
      'threat-protection': [
        'waf-attach-targets',
        'waf-bot-control',
        'waf-rule-types',
        'shield-advanced-drt',
        'guardduty-db-login',
        'security-service-lineup',
      ],
      'identity-access': [
        'least-privilege',
        'instance-profile',
        'iam-group-users-only',
        'sts-assume-role',
        'cognito-pools',
        'organizations-scp',
      ],
      'cost-management': [
        'cost-allocation-tag-activation',
        'savings-plan-details',
        'cost-anomaly-detection',
        'compute-optimizer',
      ],
    }

    Object.entries(expectedSlugs).forEach(([topicId, slugs]) => {
      const topic = topics.find(({ id }) => id === topicId)
      const addedConcepts = topic?.concepts.slice(-slugs.length) ?? []

      expect(addedConcepts.map(({ id }) => id)).toEqual(
        slugs.map((slug) => `${topicId}.${slug}`),
      )
    })
  })

  it('네트워크·라우팅·분석 보충 개념 15개가 지정된 주제의 개념 배열 끝에 추가된다', () => {
    const expectedSlugs: Record<string, string[]> = {
      'vpc-networking': [
        'endpoint-pricing',
        'egress-only-igw',
        'nat-instance',
        'vpc-peering-scaling-limit',
        's3-is-regional',
      ],
      'hybrid-connectivity': [
        'direct-connect-caveats',
        'direct-connect-gateway',
        'client-vpn',
        'access-terms',
        'data-locality-cost',
        'onprem-connectivity-heuristic',
      ],
      route53: ['private-hosted-zone', 'multivalue-answer-details'],
      'analytics-monitoring': ['glue-crawler', 'log-analysis-options'],
    }

    Object.entries(expectedSlugs).forEach(([topicId, slugs]) => {
      const topic = topics.find(({ id }) => id === topicId)
      const addedConcepts = topic?.concepts.slice(-slugs.length) ?? []

      expect(addedConcepts.map(({ id }) => id)).toEqual(
        slugs.map((slug) => `${topicId}.${slug}`),
      )
    })
  })

  it('컴퓨팅·메시징 보충 개념 21개가 지정된 주제의 개념 배열 끝에 추가된다', () => {
    const expectedSlugs: Record<string, string[]> = {
      // phase 26 step 8이 compute-delivery에서 EC2·ASG·ELB를 두 주제로 빼냈고,
      // step 9가 남은 CloudFront·Global Accelerator를 cloudfront-global-accelerator로
      // 옮기며 compute-delivery를 없앴다. 개념 본문은 그대로이고 접두사만 새 주제를 따른다.
      'ec2-autoscaling': ['warm-pool', 'scheduled-scaling'],
      'elastic-load-balancing': ['alb-l7-vs-nlb-l4', 'sticky-session-tradeoff'],
      // step 10이 serverless-containers에서 Lambda 계열을 lambda 주제로 빼내고,
      // 엣지에서 도는 lambda-at-edge는 CloudFront 쪽으로 보냈다
      // (topic-plan "step 경계를 넘는 개념").
      'cloudfront-global-accelerator': [
        'global-accelerator-protocols',
        'cloudfront-ttl',
        'edge-keyword',
        'lambda-at-edge',
      ],
      lambda: ['lambda-function-url', 'lambda-vpc-access'],
      // step 11이 serverless-containers의 남은 껍데기를 둘로 갈랐다. 컨테이너 계열은
      // ecs-eks-fargate로, API Gateway·Step Functions 계열은 api-gateway-step-functions로
      // 가고, messaging-backup에 있던 step-functions-features도 후자로 옮겨 온다
      // (topic-plan "step 경계를 넘는 개념").
      'ecs-eks-fargate': ['eks', 'fargate-no-time-limit', 'aws-batch'],
      'api-gateway-step-functions': ['api-gateway-jwt-authorizer', 'step-functions-features'],
      'messaging-backup': [
        'msk',
        'sqs-details',
        'sqs-queue-depth-scaling',
        'eventbridge-scheduler',
        'ses',
        'backup-long-term-retention',
      ],
    }

    // phase 26 step 8·9·10·11이 아래 여섯 주제의 개념을 3단(기본 → 갈림길 → 한계)으로
    // 정렬해, 이 개념들은 더 이상 배열 끝이 아니다. 각 주제의 전체 순서는 아래
    // 「EC2·Auto Scaling 주제가 ...」·「로드 밸런서 주제가 ...」·「CloudFront·Global
    // Accelerator 주제가 ...」·「Lambda 주제가 ...」·「컨테이너 주제가 ...」·
    // 「API Gateway·Step Functions 주제가 ...」가 개념 id 전부로 못박는다.
    const reordered = new Set([
      'ec2-autoscaling',
      'elastic-load-balancing',
      'cloudfront-global-accelerator',
      'lambda',
      'ecs-eks-fargate',
      'api-gateway-step-functions',
    ])

    Object.entries(expectedSlugs).forEach(([topicId, slugs]) => {
      const topic = topics.find(({ id }) => id === topicId)
      const conceptIds = topic?.concepts.map(({ id }) => id) ?? []
      const wanted = slugs.map((slug) => `${topicId}.${slug}`)

      if (reordered.has(topicId)) {
        wanted.forEach((conceptId) => expect(conceptIds).toContain(conceptId))
        return
      }
      expect(conceptIds.slice(-slugs.length)).toEqual(wanted)
    })
  })

  it('데이터베이스 보충 개념 9개가 지정된 주제의 개념 배열 끝에 추가된다', () => {
    const expectedSlugs: Record<string, string[]> = {
      'rds-storage-features': [
        'storage-type-names',
        'multi-az-standby-limits',
        'automated-backup-retention',
        'connection-issue-heuristic',
      ],
      // phase 26 step 7이 aurora-dynamodb-cache를 세 주제로 갈랐다. 개념 본문은
      // 그대로이고 접두사만 새 주제를 따른다.
      aurora: ['aurora-serverless-v2', 'aurora-reader-endpoint'],
      dynamodb: ['dynamodb-pitr'],
      'elasticache-purpose-built-db': ['documentdb', 'dax-dynamodb-only'],
    }

    // phase 26이 아래 주제들의 개념을 3단(기본 → 갈림길 → 한계)으로 다시 정렬해,
    // 이 개념들은 더 이상 배열 끝이 아니다. 각 주제의 전체 순서는 아래
    // 「RDS 주제가 ...」 같은 테스트가 개념 id 전부로 못박는다.
    const reordered = new Set([
      'rds-storage-features',
      'aurora',
      'dynamodb',
      'elasticache-purpose-built-db',
    ])

    Object.entries(expectedSlugs).forEach(([topicId, slugs]) => {
      const topic = topics.find(({ id }) => id === topicId)
      const conceptIds = topic?.concepts.map(({ id }) => id) ?? []
      const wanted = slugs.map((slug) => `${topicId}.${slug}`)

      if (reordered.has(topicId)) {
        wanted.forEach((conceptId) => expect(conceptIds).toContain(conceptId))
        return
      }
      expect(conceptIds.slice(-slugs.length)).toEqual(wanted)
    })
  })

  it('보충 개념 9개가 지정된 주제에 그대로 남아 있다', () => {
    const expectedSlugs: Record<string, string[]> = {
      'aws-core-services': ['exam-heuristics'],
      's3-versioning-lifecycle': ['object-lock-prerequisites', 'event-notification'],
      's3-encryption-batch': ['envelope-encryption', 'sse-kms-cost'],
      // phase 26 step 4가 block-file-storage를 두 주제로 갈랐다. 개념 본문은 그대로이고
      // 접두사만 새 주제를 따른다.
      'ebs-instance-store': ['cluster-placement-group', 'ebs-elastic-volumes'],
      'efs-fsx': ['efs-lifecycle-management', 'fsx-ontap-multi-az'],
    }

    // phase 26이 아래 주제들의 개념을 3단(기본 → 갈림길 → 한계)으로 다시 정렬해,
    // 이 개념들은 더 이상 배열 끝이 아니다. 각 주제의 전체 순서는 아래
    // 「S3 버전 관리 주제가 ...」 같은 테스트가 개념 id 전부로 못박는다.
    const reordered = new Set([
      's3-versioning-lifecycle',
      's3-encryption-batch',
      'ebs-instance-store',
      'efs-fsx',
    ])

    Object.entries(expectedSlugs).forEach(([topicId, slugs]) => {
      const topic = topics.find(({ id }) => id === topicId)
      const conceptIds = topic?.concepts.map(({ id }) => id) ?? []
      const wanted = slugs.map((slug) => `${topicId}.${slug}`)

      if (reordered.has(topicId)) {
        wanted.forEach((conceptId) => expect(conceptIds).toContain(conceptId))
        return
      }
      expect(conceptIds.slice(-slugs.length)).toEqual(wanted)
    })
  })

  it('보충 개념 추가 후에도 29개 주제의 메타데이터가 그대로다', () => {
    expect(topics.map(({ id, title, importance, sourcePages }) => ({
      id,
      title,
      importance,
      sourcePages,
    }))).toEqual([
      { id: 'aws-core-services', title: 'AWS 핵심 서비스·리전·가용 영역·온프레미스', importance: 0, sourcePages: [1, 7] },
      { id: 's3-storage-classes', title: 'S3 스토리지 클래스 유형', importance: 3, sourcePages: [8, 9] },
      { id: 's3-versioning-lifecycle', title: 'S3 버전 관리·객체 잠금·수명 주기·복제', importance: 3, sourcePages: [10, 12] },
      { id: 's3-encryption-batch', title: 'S3 암호화(SSE)·Batch Operations·인벤토리', importance: 2, sourcePages: [13, 13] },
      // phase 26 step 3이 신설했다. 근거가 dump-gaps에만 있어 concepts-raw.md 페이지가 없다.
      { id: 's3-access-control', title: 'S3 접근 제어·액세스 포인트·Storage Lens', importance: 3, sourcePages: [0, 0] },
      // phase 26 step 4가 block-file-storage를 둘로 갈랐다. EFS ↔ FSx는 공유 파일
      // 스토리지 선택이라 한 주제에 둔다(PRD "사용자").
      { id: 'ebs-instance-store', title: 'EBS·인스턴스 스토어·스냅샷·배치 그룹', importance: 3, sourcePages: [14, 15] },
      { id: 'efs-fsx', title: 'EFS·FSx(Windows·Lustre·ONTAP)', importance: 3, sourcePages: [14, 15] },
      // phase 26 step 5가 data-transfer-services를 둘로 갈랐다. "이미 있는 것을 옮긴다"는
      // Storage Gateway·DMS·MGN이 뒤쪽 주제로 나가고, 앞쪽은 전송 도구만 남는다.
      { id: 'data-transfer-services', title: 'DataSync·Snowball Edge·Transfer Family·S3 전송', importance: 3, sourcePages: [16, 18] },
      { id: 'storage-gateway-migration', title: 'Storage Gateway·DMS·Application Migration Service', importance: 3, sourcePages: [16, 18] },
      { id: 'rds-storage-features', title: 'RDS 스토리지 유형과 기능', importance: 3, sourcePages: [19, 20] },
      // phase 26 step 7이 aurora-dynamodb-cache를 셋으로 갈랐다. Aurora는 RDS 바로
      // 뒤에 두어 관리형 관계형 DB의 두 갈래가 맞붙게 하고, 캐시 갈림길
      // (ElastiCache ↔ DAX)은 목적별 데이터베이스와 한 주제에 남는다.
      { id: 'aurora', title: 'Aurora·Aurora Serverless·글로벌 데이터베이스', importance: 3, sourcePages: [21, 21] },
      { id: 'dynamodb', title: 'DynamoDB', importance: 3, sourcePages: [21, 21] },
      { id: 'elasticache-purpose-built-db', title: 'ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream', importance: 3, sourcePages: [21, 21] },
      // phase 26 step 8이 compute-delivery에서 EC2·ASG와 로드 밸런서를 빼내 앞에
      // 놓았고, step 9가 남은 CloudFront·Global Accelerator를 옮기며 그 주제를
      // 없앴다. 셋은 같은 조각이라 배열에서 연속으로 놓인다.
      { id: 'ec2-autoscaling', title: 'EC2 인스턴스 유형·구매 옵션·Auto Scaling', importance: 3, sourcePages: [22, 24] },
      { id: 'elastic-load-balancing', title: 'ALB·NLB·Gateway Load Balancer', importance: 3, sourcePages: [22, 24] },
      { id: 'cloudfront-global-accelerator', title: 'CloudFront·Global Accelerator·엣지 함수', importance: 3, sourcePages: [22, 24] },
      // phase 26 step 10이 serverless-containers에서 Lambda 계열을 빼내 세웠고,
      // step 11이 남은 껍데기를 둘로 갈라 그 자리에 놓으며 주제를 없앴다. 셋은 같은
      // 조각이라 배열에서 연속으로 놓인다.
      { id: 'lambda', title: 'Lambda', importance: 3, sourcePages: [25, 26] },
      { id: 'ecs-eks-fargate', title: 'ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk', importance: 3, sourcePages: [25, 26] },
      { id: 'api-gateway-step-functions', title: 'API Gateway·Step Functions', importance: 3, sourcePages: [25, 26] },
      { id: 'messaging-backup', title: 'SQS·SNS·EventBridge·AWS Backup', importance: 3, sourcePages: [27, 29] },
      { id: 'vpc-networking', title: 'VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링', importance: 3, sourcePages: [30, 33] },
      { id: 'hybrid-connectivity', title: 'Site-to-Site VPN·Direct Connect·Transit Gateway', importance: 3, sourcePages: [34, 35] },
      { id: 'route53', title: 'Route 53', importance: 2, sourcePages: [36, 37] },
      { id: 'analytics-monitoring', title: 'EMR·Spark·Redshift·Athena·Kinesis·Glue·X-Ray·CloudWatch', importance: 2, sourcePages: [38, 40] },
      { id: 'security-groups-nacl', title: '보안 그룹·NACL', importance: 3, sourcePages: [41, 43] },
      { id: 'secrets-encryption', title: 'Secrets Manager·Parameter Store·KMS·ACM', importance: 3, sourcePages: [44, 44] },
      { id: 'threat-protection', title: 'WAF·Shield·GuardDuty·Macie·CloudFront', importance: 3, sourcePages: [45, 47] },
      { id: 'identity-access', title: 'IAM·Identity Center·STS·Cognito·CloudTrail', importance: 3, sourcePages: [48, 49] },
      { id: 'cost-management', title: '절약 플랜·Budgets·Cost Explorer·Billing and Cost Management·Trusted Advisor', importance: 2, sourcePages: [50, 50] },
    ])
  })

  it('보안·운영 주제 문제 53개가 지정된 id 범위와 주제별 문항 수로 이어진다', () => {
    const expectedTopics = [
      ...Array(6).fill('route53'),
      ...Array(6).fill('analytics-monitoring'),
      ...Array(9).fill('security-groups-nacl'),
      ...Array(8).fill('secrets-encryption'),
      ...Array(9).fill('threat-protection'),
      ...Array(9).fill('identity-access'),
      ...Array(6).fill('cost-management'),
    ]
    const addedQuestions = questions.slice(116, 169)

    expect(addedQuestions).toHaveLength(53)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 53 }, (_, index) => `q${String(index + 117).padStart(3, '0')}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual(expectedTopics)
  })

  it('보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(116, 169)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => addedQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )
    const learnerFacingText = addedQuestions
      .flatMap((question) => [question.prompt, ...question.choices, question.explanation])
      .join(' ')

    answerCounts.forEach((count) => {
      expect(count / addedQuestions.length).toBeGreaterThanOrEqual(0.2)
      expect(count / addedQuestions.length).toBeLessThanOrEqual(0.3)
    })
    expect(learnerFacingText).not.toMatch(/원본에서|원본은|문서에서|본문에서|위 글에 따르면/)
  })

  it('기초·스토리지 보충 문제 9개가 새 개념과 일대일로 이어진다', () => {
    const addedQuestions = questions.slice(169, 178)
    const expectedConceptIds = [
      'aws-core-services.exam-heuristics',
      's3-versioning-lifecycle.object-lock-prerequisites',
      's3-versioning-lifecycle.event-notification',
      's3-encryption-batch.envelope-encryption',
      's3-encryption-batch.sse-kms-cost',
      'ebs-instance-store.cluster-placement-group',
      'ebs-instance-store.ebs-elastic-volumes',
      'efs-fsx.efs-lifecycle-management',
      'efs-fsx.fsx-ontap-multi-az',
    ]

    expect(addedQuestions).toHaveLength(9)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 9 }, (_, index) => `q${index + 170}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      'aws-core-services',
      's3-versioning-lifecycle',
      's3-versioning-lifecycle',
      's3-encryption-batch',
      's3-encryption-batch',
      'ebs-instance-store',
      'ebs-instance-store',
      'efs-fsx',
      'efs-fsx',
    ])
    expect(addedQuestions.map(({ conceptId }) => conceptId)).toEqual(expectedConceptIds)
    expect(new Set(addedQuestions.map(({ conceptId }) => conceptId)).size).toBe(9)
  })

  it('기초·스토리지 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(169, 178)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => addedQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )
    const learnerFacingText = addedQuestions
      .flatMap((question) => [question.prompt, ...question.choices, question.explanation])
      .join(' ')

    expect(answerCounts).toEqual([2, 2, 2, 3])
    addedQuestions.forEach(({ choices }) => {
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
    })
    expect(learnerFacingText).not.toMatch(
      /원본에서|원본은|문서에서|본문에서|위 글에 따르면|덤프|해설지|\[섹션/,
    )
  })

  it('데이터베이스 보충 문제 9개가 새 개념과 일대일로 이어진다', () => {
    const addedQuestions = questions.slice(178, 187)
    const expectedConceptIds = [
      'rds-storage-features.storage-type-names',
      'rds-storage-features.multi-az-standby-limits',
      'rds-storage-features.automated-backup-retention',
      'rds-storage-features.connection-issue-heuristic',
      // phase 26 step 7이 aurora-dynamodb-cache를 셋으로 갈라 접두사가 바뀌었다.
      'aurora.aurora-serverless-v2',
      'aurora.aurora-reader-endpoint',
      'elasticache-purpose-built-db.documentdb',
      'dynamodb.dynamodb-pitr',
      'elasticache-purpose-built-db.dax-dynamodb-only',
    ]

    expect(addedQuestions).toHaveLength(9)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 9 }, (_, index) => `q${index + 179}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(4).fill('rds-storage-features'),
      'aurora',
      'aurora',
      'elasticache-purpose-built-db',
      'dynamodb',
      'elasticache-purpose-built-db',
    ])
    expect(addedQuestions.map(({ conceptId }) => conceptId).sort()).toEqual(
      [...expectedConceptIds].sort(),
    )
    expect(new Set(addedQuestions.map(({ conceptId }) => conceptId)).size).toBe(9)
  })

  it('데이터베이스 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(178, 187)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => addedQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )
    const learnerFacingText = addedQuestions
      .flatMap((question) => [question.prompt, ...question.choices, question.explanation])
      .join(' ')

    expect(answerCounts).toEqual([3, 2, 2, 2])
    addedQuestions.forEach(({ choices }) => {
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
    })
    expect(learnerFacingText).not.toMatch(
      /원본에서|원본은|문서에서|본문에서|위 글에 따르면|덤프|해설지|\[섹션/,
    )
  })

  it('컴퓨팅·메시징 보충 문제 21개가 새 개념과 일대일로 이어진다', () => {
    const addedQuestions = questions.slice(187, 208)
    const expectedConceptIds = [
      // phase 26 step 8이 앞의 넷을 두 새 주제로 옮겼다. 문항 본문은 그대로이고
      // topicId·conceptId만 따라 바뀐다.
      'ec2-autoscaling.warm-pool',
      'ec2-autoscaling.scheduled-scaling',
      'elastic-load-balancing.alb-l7-vs-nlb-l4',
      'elastic-load-balancing.sticky-session-tradeoff',
      'cloudfront-global-accelerator.global-accelerator-protocols',
      'cloudfront-global-accelerator.cloudfront-ttl',
      'cloudfront-global-accelerator.edge-keyword',
      // phase 26 step 11이 serverless-containers를 둘로 갈랐다.
      'ecs-eks-fargate.eks',
      'ecs-eks-fargate.fargate-no-time-limit',
      // phase 26 step 10이 Lambda 계열 셋을 옮겼다. 함수 URL과 VPC 연결은 lambda로,
      // 엣지에서 도는 Lambda@Edge는 CloudFront 쪽으로 간다.
      'lambda.lambda-function-url',
      'cloudfront-global-accelerator.lambda-at-edge',
      'lambda.lambda-vpc-access',
      'api-gateway-step-functions.api-gateway-jwt-authorizer',
      'ecs-eks-fargate.aws-batch',
      'messaging-backup.msk',
      'messaging-backup.sqs-details',
      'messaging-backup.sqs-queue-depth-scaling',
      'messaging-backup.eventbridge-scheduler',
      // step 11이 messaging-backup에서 함께 가져왔다.
      'api-gateway-step-functions.step-functions-features',
      'messaging-backup.ses',
      'messaging-backup.backup-long-term-retention',
    ]

    expect(addedQuestions).toHaveLength(21)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 21 }, (_, index) => `q${index + 188}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(2).fill('ec2-autoscaling'),
      ...Array(2).fill('elastic-load-balancing'),
      ...Array(3).fill('cloudfront-global-accelerator'),
      // step 10이 Lambda 계열을 옮기고 step 11이 serverless-containers를 둘로 가르면서
      // 이 구간이 다섯 주제로 갈라졌다. 문항의 id 순서는 그대로이고 topicId만
      // 자기 conceptId를 담은 주제를 따른다.
      ...Array(2).fill('ecs-eks-fargate'),
      'lambda',
      'cloudfront-global-accelerator',
      'lambda',
      'api-gateway-step-functions',
      'ecs-eks-fargate',
      ...Array(4).fill('messaging-backup'),
      'api-gateway-step-functions',
      ...Array(2).fill('messaging-backup'),
    ])
    expect(addedQuestions.map(({ conceptId }) => conceptId).sort()).toEqual(
      [...expectedConceptIds].sort(),
    )
    expect(new Set(addedQuestions.map(({ conceptId }) => conceptId)).size).toBe(21)
  })

  it('컴퓨팅·메시징 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(187, 208)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => addedQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )
    const learnerFacingText = addedQuestions
      .flatMap((question) => [question.prompt, ...question.choices, question.explanation])
      .join(' ')

    expect(answerCounts).toEqual([5, 5, 5, 6])
    addedQuestions.forEach(({ choices }) => {
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
    })
    expect(learnerFacingText).not.toMatch(
      /원본에서|원본은|문서에서|본문에서|위 글에 따르면|덤프|해설지|\[섹션/,
    )
  })

  it('네트워크·라우팅·분석 보충 문제 15개가 새 개념과 일대일로 이어진다', () => {
    const addedQuestions = questions.slice(208, 223)
    const expectedConceptIds = [
      'vpc-networking.endpoint-pricing',
      'vpc-networking.egress-only-igw',
      'vpc-networking.nat-instance',
      'vpc-networking.vpc-peering-scaling-limit',
      'vpc-networking.s3-is-regional',
      'hybrid-connectivity.direct-connect-caveats',
      'hybrid-connectivity.direct-connect-gateway',
      'hybrid-connectivity.client-vpn',
      'hybrid-connectivity.access-terms',
      'hybrid-connectivity.data-locality-cost',
      'hybrid-connectivity.onprem-connectivity-heuristic',
      'route53.private-hosted-zone',
      'route53.multivalue-answer-details',
      'analytics-monitoring.glue-crawler',
      'analytics-monitoring.log-analysis-options',
    ]

    expect(addedQuestions).toHaveLength(15)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 15 }, (_, index) => `q${index + 209}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(5).fill('vpc-networking'),
      ...Array(6).fill('hybrid-connectivity'),
      ...Array(2).fill('route53'),
      ...Array(2).fill('analytics-monitoring'),
    ])
    expect(addedQuestions.map(({ conceptId }) => conceptId).sort()).toEqual(
      [...expectedConceptIds].sort(),
    )
    expect(new Set(addedQuestions.map(({ conceptId }) => conceptId)).size).toBe(15)
  })

  it('네트워크·라우팅·분석 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(208, 223)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => addedQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )
    const learnerFacingText = addedQuestions
      .flatMap((question) => [question.prompt, ...question.choices, question.explanation])
      .join(' ')

    expect(answerCounts).toEqual([4, 4, 4, 3])
    addedQuestions.forEach(({ choices }) => {
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
    })
    expect(learnerFacingText).not.toMatch(
      /원본에서|원본은|문서에서|본문에서|위 글에 따르면|덤프|해설지|\[섹션/,
    )
  })

  it('보안·자격 증명·비용 관리 보충 문제 23개가 새 개념과 일대일로 이어진다', () => {
    const addedQuestions = questions.slice(223, 246)
    const expectedConceptIds = [
      'security-groups-nacl.security-group-referencing',
      'security-groups-nacl.nacl-rule-limit',
      'security-groups-nacl.web-acl-vs-nacl',
      'secrets-encryption.acm-cloudfront-region',
      'secrets-encryption.lambda-env-var-kms',
      'secrets-encryption.cloudhsm',
      'secrets-encryption.rotation-heuristic',
      'threat-protection.waf-attach-targets',
      'threat-protection.waf-bot-control',
      'threat-protection.waf-rule-types',
      'threat-protection.shield-advanced-drt',
      'threat-protection.guardduty-db-login',
      'threat-protection.security-service-lineup',
      'identity-access.least-privilege',
      'identity-access.instance-profile',
      'identity-access.iam-group-users-only',
      'identity-access.sts-assume-role',
      'identity-access.cognito-pools',
      'identity-access.organizations-scp',
      'cost-management.cost-allocation-tag-activation',
      'cost-management.savings-plan-details',
      'cost-management.cost-anomaly-detection',
      'cost-management.compute-optimizer',
    ]

    expect(addedQuestions).toHaveLength(23)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 23 }, (_, index) => `q${index + 224}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(3).fill('security-groups-nacl'),
      ...Array(4).fill('secrets-encryption'),
      ...Array(6).fill('threat-protection'),
      ...Array(6).fill('identity-access'),
      ...Array(4).fill('cost-management'),
    ])
    expect(addedQuestions.map(({ conceptId }) => conceptId).sort()).toEqual(
      [...expectedConceptIds].sort(),
    )
    expect(new Set(addedQuestions.map(({ conceptId }) => conceptId)).size).toBe(23)
  })

  it('보안·자격 증명·비용 관리 보충 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(223, 246)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => addedQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )
    const learnerFacingText = addedQuestions
      .flatMap((question) => [question.prompt, ...question.choices, question.explanation])
      .join(' ')

    expect(answerCounts).toEqual([6, 6, 6, 5])
    addedQuestions.forEach(({ choices }) => {
      expect(choices).toHaveLength(4)
      expect(new Set(choices).size).toBe(4)
    })
    expect(learnerFacingText).not.toMatch(
      /원본에서|원본은|문서에서|본문에서|위 글에 따르면|덤프|해설지|\[섹션/,
    )
  })

  it('전체 보충 문제 q170~q246의 정답 위치가 고르게 퍼져 있다', () => {
    const gapQuestions = questions.slice(169, 246)
    const answerCounts = [0, 1, 2, 3].map(
      (answerIndex) => gapQuestions.filter((question) => question.answerIndex === answerIndex).length,
    )

    expect(gapQuestions).toHaveLength(77)
    answerCounts.forEach((count) => {
      expect(count / gapQuestions.length).toBeGreaterThanOrEqual(0.2)
      expect(count / gapQuestions.length).toBeLessThanOrEqual(0.3)
    })
  })

  // slice의 시작 위치는 phase 26이 주제를 넣고 뺄 때마다 밀린다. 지금은 step 3이
  // s3-access-control을 4번 자리에 넣어 뒤쪽 주제가 한 칸씩 내려갔고,
  // block-file-storage가 ebs-instance-store·efs-fsx 둘로 갈리면서 한 칸 더,
  // data-transfer-services가 storage-gateway-migration을 내놓으며 또 한 칸 더 내려갔고,
  // aurora-dynamodb-cache가 셋으로 갈리면서 두 칸이 더 내려갔다.
  it('보안·운영 데이터 주제가 지정된 순서와 메타데이터로 추가된다', () => {
    expect(topics.slice(22, 29).map(({ id, title, importance, sourcePages }) => ({
      id,
      title,
      importance,
      sourcePages,
    }))).toEqual([
      { id: 'route53', title: 'Route 53', importance: 2, sourcePages: [36, 37] },
      { id: 'analytics-monitoring', title: 'EMR·Spark·Redshift·Athena·Kinesis·Glue·X-Ray·CloudWatch', importance: 2, sourcePages: [38, 40] },
      { id: 'security-groups-nacl', title: '보안 그룹·NACL', importance: 3, sourcePages: [41, 43] },
      { id: 'secrets-encryption', title: 'Secrets Manager·Parameter Store·KMS·ACM', importance: 3, sourcePages: [44, 44] },
      { id: 'threat-protection', title: 'WAF·Shield·GuardDuty·Macie·CloudFront', importance: 3, sourcePages: [45, 47] },
      { id: 'identity-access', title: 'IAM·Identity Center·STS·Cognito·CloudTrail', importance: 3, sourcePages: [48, 49] },
      { id: 'cost-management', title: '절약 플랜·Budgets·Cost Explorer·Billing and Cost Management·Trusted Advisor', importance: 2, sourcePages: [50, 50] },
    ])
  })

  it('보안·운영 데이터 주제는 원본 항목 수만큼 개념을 가진다', () => {
    expect(topics.slice(22, 29).map((topic) => topic.concepts.length)).toEqual([
      5, 14, 5, 9, 11, 12, 9,
    ])
  })

  it('네트워크 데이터 주제가 지정된 순서와 메타데이터로 추가된다', () => {
    expect(topics.slice(9, 22).map(({ id, title, importance, sourcePages }) => ({
      id,
      title,
      importance,
      sourcePages,
    }))).toEqual([
      { id: 'rds-storage-features', title: 'RDS 스토리지 유형과 기능', importance: 3, sourcePages: [19, 20] },
      { id: 'aurora', title: 'Aurora·Aurora Serverless·글로벌 데이터베이스', importance: 3, sourcePages: [21, 21] },
      { id: 'dynamodb', title: 'DynamoDB', importance: 3, sourcePages: [21, 21] },
      { id: 'elasticache-purpose-built-db', title: 'ElastiCache·DAX·Neptune·DocumentDB·QLDB·Timestream', importance: 3, sourcePages: [21, 21] },
      { id: 'ec2-autoscaling', title: 'EC2 인스턴스 유형·구매 옵션·Auto Scaling', importance: 3, sourcePages: [22, 24] },
      { id: 'elastic-load-balancing', title: 'ALB·NLB·Gateway Load Balancer', importance: 3, sourcePages: [22, 24] },
      { id: 'cloudfront-global-accelerator', title: 'CloudFront·Global Accelerator·엣지 함수', importance: 3, sourcePages: [22, 24] },
      // phase 26 step 10이 serverless-containers에서 Lambda 계열을 빼내 세웠고,
      // step 11이 남은 껍데기를 ECS 계열과 API Gateway 계열로 갈랐다.
      { id: 'lambda', title: 'Lambda', importance: 3, sourcePages: [25, 26] },
      { id: 'ecs-eks-fargate', title: 'ECS·EKS·Fargate·Batch·ECR·Elastic Beanstalk', importance: 3, sourcePages: [25, 26] },
      { id: 'api-gateway-step-functions', title: 'API Gateway·Step Functions', importance: 3, sourcePages: [25, 26] },
      { id: 'messaging-backup', title: 'SQS·SNS·EventBridge·AWS Backup', importance: 3, sourcePages: [27, 29] },
      { id: 'vpc-networking', title: 'VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링', importance: 3, sourcePages: [30, 33] },
      { id: 'hybrid-connectivity', title: 'Site-to-Site VPN·Direct Connect·Transit Gateway', importance: 3, sourcePages: [34, 35] },
    ])
  })

  it('네트워크 데이터 주제는 원본 항목 수만큼 개념을 가진다', () => {
    // 첫 값 21은 원본 7에 phase 26 step 6이 dump-gaps에서 옮긴 신규 14를 더한 것이고,
    // 이어지는 18·18·14는 step 7이 원본 8개념을 셋으로 갈라 신규 42를 더한 결과다.
    // 17·16은 step 8이 compute-delivery의 11개념 중 EC2·ASG 쪽 3개와 ELB 쪽 3개를
    // 빼내 신규 27을 더한 결과이고, 24는 step 9가 남은 5개념을 옮겨 신규 16을 더한 데에
    // step 10이 엣지 함수 셋(기존 lambda-at-edge + 신규 2)을 보태 나온 값이다.
    // 18은 step 10이 serverless-containers의 11개념에서 Lambda 계열 4개를 빼내 신규 15를
    // 더한 결과이고, 23·19는 step 11이 남은 7개념을 둘로 가르며 messaging-backup의
    // step-functions-features를 함께 가져와 신규 34를 더한 결과다. 그 바람에
    // messaging-backup은 11에서 10으로 줄었다. 나머지 둘은 아직 자기 step을 기다리고 있다.
    expect(topics.slice(9, 22).map((topic) => topic.concepts.length)).toEqual([
      21, 18, 18, 14, 17, 16, 24, 18, 23, 19, 10, 12, 10,
    ])
  })

  it('S3 스토리지 클래스 주제가 클래스 8개 다음에 갈림길 7개와 비용 개념 2개를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-storage-classes')

    // 1단 클래스 여덟 → 2단 어느 클래스를 고르는가 → 3단 클래스별 비용 항목.
    // Glacier 3종을 포함한 클래스 전부가 한 주제 안에 있어야 한다 — 헷갈리는 짝을 가르면
    // "언제 무엇을 쓰는가"를 비교할 자리가 없어진다(PRD "사용자").
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-storage-classes.standard',
      's3-storage-classes.intelligent-tiering',
      's3-storage-classes.standard-ia',
      's3-storage-classes.one-zone-ia',
      's3-storage-classes.glacier-instant-retrieval',
      's3-storage-classes.glacier-flexible-retrieval',
      's3-storage-classes.glacier-deep-archive',
      's3-storage-classes.s3-express-one-zone',
      's3-storage-classes.retrieval-time',
      's3-storage-classes.glacier-or-standard-ia',
      's3-storage-classes.glacier-flexible-retrieval-standard-time',
      's3-storage-classes.glacier-flexible-retrieval-expedited',
      's3-storage-classes.s3-storage-class-cost-order',
      's3-storage-classes.lifecycle-vs-intelligent-tiering',
      's3-storage-classes.s3-storage-class-analysis',
      's3-storage-classes.s3-retrieval-fee-by-class',
      's3-storage-classes.intelligent-tiering-monitoring-fee',
    ])
    expect(topic?.concepts.slice(0, 8).map((concept) => concept.name)).toEqual([
      'S3 Standard',
      'S3 Intelligent-Tiering',
      'S3 Standard-IA (Infrequent Access)',
      'S3 One Zone-IA',
      'S3 Glacier Instant Retrieval',
      'S3 Glacier Flexible Retrieval',
      'S3 Glacier Deep Archive',
      'S3 Express One Zone',
    ])
    expect(topic?.concepts.slice(8).map((concept) => concept.name)).toEqual([
      '즉시 조회와 대기 조회',
      'Glacier와 Standard-IA 중 고르기',
      'Glacier Flexible Retrieval의 표준 검색 시간',
      'Glacier Flexible Retrieval의 신속 검색',
      '아카이브 계열의 비용 순서',
      '수명 주기 규칙과 자동 계층화의 갈림길',
      'S3 스토리지 클래스 분석',
      '스토리지 클래스마다 갈리는 검색 요금',
      'Intelligent-Tiering의 객체별 감시 요금',
    ])
  })

  it('S3 버전 관리 주제가 기능 다섯 다음에 복제의 갈래와 구성 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-versioning-lifecycle')

    // 1단 각각 무엇인가 → 2단 리전을 넘는 복제와 같은 리전 복제 → 3단 전제 조건과 구성 한계.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-versioning-lifecycle.versioning',
      's3-versioning-lifecycle.object-lock',
      's3-versioning-lifecycle.lifecycle-policy',
      's3-versioning-lifecycle.event-notification',
      's3-versioning-lifecycle.s3-replication',
      's3-versioning-lifecycle.s3-same-region-replication',
      's3-versioning-lifecycle.s3-replication-time-control',
      's3-versioning-lifecycle.s3-replication-cross-account-kms',
      's3-versioning-lifecycle.object-lock-prerequisites',
      's3-versioning-lifecycle.s3-lifecycle-rules-and-size-filter',
    ])
  })

  it('S3 암호화 주제가 암호화·배치·인벤토리 다음에 갈림길과 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-encryption-batch')

    // 1단 SSE와 배치·인벤토리·Object Lambda가 각각 무엇인가 → 2단 어느 SSE를 고르는가와
    // 일회성 복사 대 지속 복제 → 3단 비용 구조·SSE-C에 없는 것·전송 구간 강제.
    // SSE-S3 ↔ SSE-KMS ↔ SSE-C가 한 주제 안에 있어야 한다(PRD "사용자").
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-encryption-batch.sse',
      's3-encryption-batch.sse-types',
      's3-encryption-batch.client-side-encryption',
      's3-encryption-batch.batch-operations',
      's3-encryption-batch.s3-inventory-report',
      's3-encryption-batch.s3-object-lambda',
      's3-encryption-batch.envelope-encryption',
      's3-encryption-batch.sse-kms-audit-trail',
      's3-encryption-batch.batch-copy-vs-replication',
      's3-encryption-batch.s3-batch-operations-lambda-invoke',
      's3-encryption-batch.sse-kms-cost',
      's3-encryption-batch.sse-c-no-rotation-or-audit',
      's3-encryption-batch.s3-secure-transport-condition',
    ])
  })

  it('S3 접근 제어 주제가 접근 경로 여섯 다음에 갈림길 둘과 한계 다섯을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-access-control')

    // 1단 버킷 정책·사전 서명된 URL·액세스 권한·액세스 포인트·Storage Lens가 각각
    // 무엇인가 → 2단 CORS와 요청자 부담이 무엇을 맡는가 → 3단 설정 항목과 제약.
    // 버킷 정책 ↔ 액세스 포인트 ↔ 퍼블릭 액세스 차단은 서로 갈림길이라 흩지 않는다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-access-control.s3-cross-account-bucket-policy',
      's3-access-control.s3-presigned-url',
      's3-access-control.s3-access-grants',
      's3-access-control.s3-access-point',
      's3-access-control.s3-multi-region-access-point',
      's3-access-control.s3-storage-lens',
      's3-access-control.s3-cors-not-authorization',
      's3-access-control.s3-requester-pays',
      's3-access-control.s3-storage-lens-advanced-activity-metrics',
      's3-access-control.s3-account-level-public-access-block',
      's3-access-control.block-public-access-allows-explicit-grants',
      's3-access-control.s3-bucket-policy-source-vpc-condition',
      's3-access-control.s3-website-endpoint-no-https',
    ])
  })

  it('EBS 주제가 기본 다섯 다음에 볼륨 유형의 갈림길과 스냅샷 운영을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ebs-instance-store')

    // 1단 EBS·인스턴스 스토어·배치 그룹이 무엇인가 → 2단 볼륨 유형끼리의 갈림길과
    // 클러스터 ↔ 분산 배치 그룹 → 3단 IOPS 상한·계정 속성인 기본 암호화·스냅샷 운영.
    // gp2 ↔ gp3 ↔ io1 ↔ io2는 서로 갈림길이라 한 주제 안에 둔다(PRD "사용자").
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ebs-instance-store.ebs',
      'ebs-instance-store.ebs-elastic-volumes',
      'ebs-instance-store.instance-store',
      'ebs-instance-store.cluster-placement-group',
      'ebs-instance-store.elastic-fabric-adapter',
      'ebs-instance-store.ebs-volume-type-names',
      'ebs-instance-store.gp3-iops-independent-of-size',
      'ebs-instance-store.spread-placement-group',
      'ebs-instance-store.io2-block-express-iops-ceiling',
      'ebs-instance-store.ebs-encryption-by-default',
      'ebs-instance-store.ebs-encryption-performance',
      'ebs-instance-store.ebs-recycle-bin',
      'ebs-instance-store.ebs-snapshot-block-public-access',
      'ebs-instance-store.data-lifecycle-manager',
      'ebs-instance-store.ebs-fast-snapshot-restore',
    ])
  })

  it('EFS·FSx 주제가 파일 시스템 여섯 다음에 선택 기준과 구성 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'efs-fsx')

    // 1단 EFS와 FSx 네 갈래가 각각 무엇인가 → 2단 어느 프로토콜·어느 지연 시간에
    // 무엇을 고르는가 → 3단 IA 전환 조건·마운트 대상·복제가 한 방향이라는 것.
    // EFS ↔ FSx(Windows·Lustre·ONTAP)는 공유 파일 스토리지 선택 그 자체라 흩지 않는다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'efs-fsx.efs',
      'efs-fsx.efs-lifecycle-management',
      'efs-fsx.fsx',
      'efs-fsx.fsx-windows-file-server',
      'efs-fsx.fsx-for-lustre',
      'efs-fsx.fsx-file-gateway',
      'efs-fsx.efs-throughput-modes',
      'efs-fsx.efs-elastic-throughput',
      'efs-fsx.efs-performance-modes',
      'efs-fsx.efs-one-zone',
      'efs-fsx.efs-posix-permissions',
      'efs-fsx.fsx-lustre-sub-millisecond-latency',
      'efs-fsx.fsx-lustre-persistent-deployment',
      'efs-fsx.fsx-ontap-multi-az',
      'efs-fsx.fsx-ontap-multi-protocol-tiering',
      'efs-fsx.fsx-ontap-iscsi-block',
      'efs-fsx.fsx-ontap-snapmirror',
      'efs-fsx.sql-server-always-on-shared-storage',
      'efs-fsx.efs-ia-file-size-threshold',
      'efs-fsx.efs-lifecycle-transition-to-primary',
      'efs-fsx.efs-mount-target-per-az',
      'efs-fsx.efs-cross-account-mount',
      'efs-fsx.efs-replication-one-way',
      'efs-fsx.fsx-windows-storage-auto-scaling',
      'efs-fsx.fsx-lustre-s3-data-repository-association',
    ])
  })

  it('데이터 전송 주제가 전송 도구 넷 다음에 선택 기준과 설정 항목을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'data-transfer-services')

    // 1단 DataSync·Snowball Edge·Transfer Family·S3 전송이 각각 무엇인가 → 2단 기한과
    // 대역폭을 먼저 곱해 보기, 지속 수집 ↔ 예약 전송, 어느 ID 공급자를 쓰는가 →
    // 3단 DataSync가 맡지 않는 일·워크플로 기본 액션·멀티파트 업로드의 조건.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'data-transfer-services.datasync',
      'data-transfer-services.snowball-edge',
      'data-transfer-services.snowball-edge-compute',
      'data-transfer-services.transfer-family',
      'data-transfer-services.transfer-family-workflow',
      'data-transfer-services.s3-transfer-acceleration',
      'data-transfer-services.transfer-deadline-vs-bandwidth',
      'data-transfer-services.file-gateway-vs-datasync-continuous',
      'data-transfer-services.transfer-family-custom-hostname',
      'data-transfer-services.transfer-family-directory-service-identity-provider',
      'data-transfer-services.transfer-family-service-managed-users',
      'data-transfer-services.datasync-scope-limits',
      'data-transfer-services.datasync-in-transit-encryption',
      'data-transfer-services.datasync-manifest',
      'data-transfer-services.datasync-transfer-mode',
      'data-transfer-services.datasync-task-status-event',
      'data-transfer-services.transfer-family-workflow-actions',
      'data-transfer-services.transfer-family-structured-logging',
      'data-transfer-services.s3-multipart-upload',
    ])
  })

  it('Storage Gateway·마이그레이션 주제가 서비스 셋 다음에 유형 선택과 설정을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'storage-gateway-migration')

    // 1단 Storage Gateway·DMS·SCT·MGN이 각각 무엇인가 → 2단 게이트웨이 유형 셋과
    // 저장 볼륨 ↔ 캐시된 볼륨 → 3단 가상 테이프의 아카이브 계층·전체 로드와 CDC.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'storage-gateway-migration.storage-gateway',
      'storage-gateway-migration.dms-sct',
      'storage-gateway-migration.application-migration-service',
      'storage-gateway-migration.storage-gateway-gateway-types',
      'storage-gateway-migration.storage-gateway-volume-modes',
      'storage-gateway-migration.tape-gateway-archive-tiers',
      'storage-gateway-migration.dms-full-load-and-cdc-task',
    ])
  })

  it('전송 서비스를 가르는 갈림길이 두 주제 양쪽에서 보인다', () => {
    // step 5가 data-transfer-services를 둘로 갈랐다. DataSync ↔ Snowball ↔ Transfer
    // Family ↔ Storage Gateway는 "언제 무엇을 쓰는가"가 그대로 문항이므로, 쪼갠 뒤에도
    // 갈림길 개념이 양쪽에 남아야 한다(PRD "사용자").
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    expect(bodyOf('data-transfer-services.transfer-deadline-vs-bandwidth')).toContain(
      'DataSync·Storage Gateway·DMS',
    )
    expect(bodyOf('data-transfer-services.file-gateway-vs-datasync-continuous')).toContain(
      '파일 게이트웨이',
    )
    expect(bodyOf('storage-gateway-migration.storage-gateway')).toContain('DataSync·Snowball Edge와 달리')
    expect(bodyOf('storage-gateway-migration.dms-full-load-and-cdc-task')).toContain('DataSync')
  })

  it('RDS 주제가 서비스와 기능 다음에 선택 기준과 한계값을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'rds-storage-features')

    // 1단 RDS와 스토리지 유형·기능(블루/그린·Custom·IAM 인증·암호화 범위) → 2단 볼륨
    // 유형의 갈림길, 다중 AZ ↔ 읽기 전용 복제본 ↔ 다중 AZ DB 클러스터, 캐시가 듣지
    // 않는 조건, 연결 문제와 프록시, 리전 간 스냅샷 복사 → 3단 백업 보존 한계·수동
    // 스냅샷·특정 시점 복구의 정밀도·장애 조치 시간·7일 자동 재시작·나중에 켤 수 없는
    // 암호화·보유 라이선스.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'rds-storage-features.rds',
      'rds-storage-features.storage-types',
      'rds-storage-features.features',
      'rds-storage-features.rds-blue-green-deployment',
      'rds-storage-features.rds-custom',
      'rds-storage-features.rds-iam-database-authentication',
      'rds-storage-features.rds-encryption-scope-and-in-transit',
      'rds-storage-features.storage-type-names',
      'rds-storage-features.multi-az-standby-limits',
      'rds-storage-features.rds-multi-az-db-cluster',
      'rds-storage-features.read-replica-vs-cache',
      'rds-storage-features.connection-issue-heuristic',
      'rds-storage-features.rds-proxy-failover',
      'rds-storage-features.rds-snapshot-cross-region-copy',
      'rds-storage-features.automated-backup-retention',
      'rds-storage-features.rds-manual-snapshot-retention',
      'rds-storage-features.rds-pitr-transaction-log-interval',
      'rds-storage-features.rds-multi-az-failover-rto',
      'rds-storage-features.rds-stop-instance-restart',
      'rds-storage-features.rds-encrypt-existing-instance',
      'rds-storage-features.rds-custom-byol',
    ])
  })

  it('RDS와 Aurora가 배열에서 맞붙어 있다', () => {
    // 관리형 관계형 데이터베이스의 두 갈래다. 다른 주제로 떼어 놓으면 "언제 무엇을
    // 쓰는가"를 비교할 자리가 없어진다(PRD "사용자", topic-plan "헷갈리는 짝 배치").
    // Aurora를 담은 주제의 id는 step 7이 바꾸므로 개념 이름으로 찾는다.
    const rdsIndex = topics.findIndex(({ id }) => id === 'rds-storage-features')
    const auroraIndex = topics.findIndex((topic) =>
      topic.concepts.some(({ name }) => name === 'Aurora'),
    )

    expect(rdsIndex).toBeGreaterThanOrEqual(0)
    expect(auroraIndex).toBe(rdsIndex + 1)
  })

  it('다중 AZ 배포의 두 형태가 대기 인스턴스의 역할로 갈린다', () => {
    // 기존 multi-az-standby-limits는 대기 인스턴스가 아무 트래픽도 처리하지 않는다고
    // 못박는다. step 6이 들여온 rds-multi-az-db-cluster는 그 서술이 DB 인스턴스 배포에
    // 대한 것이고 DB 클러스터 배포는 다르다는 것을 같은 주제 안에서 잇는다.
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    expect(bodyOf('rds-storage-features.multi-az-standby-limits')).toContain(
      '아무 트래픽도 처리하지 않으므로',
    )
    expect(bodyOf('rds-storage-features.rds-multi-az-db-cluster')).toContain(
      '다중 AZ DB 인스턴스 배포',
    )
    expect(bodyOf('rds-storage-features.rds-multi-az-db-cluster')).toContain(
      'DB 클러스터 배포까지 부정하지는 않는다',
    )
    expect(bodyOf('rds-storage-features.read-replica-vs-cache')).toContain('ElastiCache')
  })

  it('Aurora 주제가 서비스와 기능 다음에 선택 기준과 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'aurora')

    // 1단 Aurora와 Serverless v2·엔드포인트·오토 스케일링·Babelfish·pgvector·S3 내보내기
    // → 2단 글로벌 데이터베이스와 리전 간 복제본, 지속적 백업과 스냅샷 주기, 클론,
    // 스토리지 구성, 어느 엔진으로 가는가 → 3단 쓰기 리전 하나·ACU 상한·복제본의 제약.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'aurora.aurora',
      'aurora.aurora-serverless-v2',
      'aurora.aurora-reader-endpoint',
      'aurora.aurora-endpoint-types',
      'aurora.aurora-replica-auto-scaling',
      'aurora.babelfish',
      'aurora.aurora-pgvector',
      'aurora.aurora-select-into-outfile-s3',
      'aurora.aurora-global-database-dr-targets',
      'aurora.aurora-cross-region-read-replica',
      'aurora.aurora-continuous-backup-rpo',
      'aurora.aurora-clone',
      'aurora.aurora-storage-configurations',
      'aurora.sql-server-license-cost',
      'aurora.aurora-zdr-and-activity-streams',
      'aurora.aurora-global-database-write-region',
      'aurora.aurora-serverless-max-acu',
      'aurora.read-replica-no-schema-change',
    ])
  })

  it('DynamoDB 주제가 서비스와 기능 다음에 선택 기준과 한계값을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'dynamodb')

    // 1단 DynamoDB와 응답 시간·스트림·글로벌 테이블·TTL·GSI → 2단 용량 모드와 오토
    // 스케일링, 읽기 일관성, 적재 경로 → 3단 보존 한계·전제 조건·크기 제한·설정 항목.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'dynamodb.dynamodb',
      'dynamodb.dynamodb-single-digit-latency',
      'dynamodb.dynamodb-streams',
      'dynamodb.dynamodb-global-tables',
      'dynamodb.dynamodb-ttl',
      'dynamodb.dynamodb-global-secondary-index',
      'dynamodb.dynamodb-capacity-modes',
      'dynamodb.dynamodb-auto-scaling-target-utilization',
      'dynamodb.dynamodb-read-consistency',
      'dynamodb.dynamodb-s3-export-vs-streams',
      'dynamodb.dynamodb-incremental-export',
      'dynamodb.dynamodb-export-no-read-capacity',
      'dynamodb.dynamodb-pitr',
      'dynamodb.dynamodb-export-requires-pitr',
      'dynamodb.dynamodb-item-size-limit',
      'dynamodb.dynamodb-ttl-deletion-delay',
      'dynamodb.dynamodb-streams-retention-24h',
      'dynamodb.dynamodb-streams-batch-size',
    ])
  })

  it('캐시·목적별 DB 주제가 서비스 여섯 다음에 갈림길 다섯과 한계 셋을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'elasticache-purpose-built-db')

    // 1단 캐시와 목적별 데이터베이스 넷이 각각 무엇인가 → 2단 캐시 엔진과 리전 간
    // 구성의 갈림길 → 3단 캐시로 풀리지 않는 것과 설정 시점의 제약.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'elasticache-purpose-built-db.elasticache',
      'elasticache-purpose-built-db.documentdb',
      'elasticache-purpose-built-db.neptune',
      'elasticache-purpose-built-db.neptune-streams',
      'elasticache-purpose-built-db.qldb',
      'elasticache-purpose-built-db.timestream',
      'elasticache-purpose-built-db.elasticache-redis-vs-memcached',
      'elasticache-purpose-built-db.dax-dynamodb-only',
      'elasticache-purpose-built-db.elasticache-multi-az-failover',
      'elasticache-purpose-built-db.elasticache-global-datastore',
      'elasticache-purpose-built-db.documentdb-global-cluster',
      'elasticache-purpose-built-db.cache-requires-application-change',
      'elasticache-purpose-built-db.elasticache-not-a-durable-store',
      'elasticache-purpose-built-db.dax-encryption-at-rest',
    ])
  })

  it('캐시 갈림길이 한 주제 안에 함께 있다', () => {
    // ElastiCache(Redis ↔ Memcached) ↔ DAX는 "언제 무엇을 쓰는가"가 그대로 문항이다.
    // step 7이 aurora-dynamodb-cache를 셋으로 가를 때 이 셋을 떼어 놓으면 비교할
    // 자리가 없어진다(PRD "사용자", topic-plan "헷갈리는 짝 배치").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id

    const engines = ownerOf('elasticache-purpose-built-db.elasticache-redis-vs-memcached')
    expect(engines).toBe('elasticache-purpose-built-db')
    expect(ownerOf('elasticache-purpose-built-db.elasticache')).toBe(engines)
    expect(ownerOf('elasticache-purpose-built-db.dax-dynamodb-only')).toBe(engines)
    expect(ownerOf('elasticache-purpose-built-db.dax-encryption-at-rest')).toBe(engines)
  })

  it('EC2·Auto Scaling 주제가 서비스와 재료 다음에 선택 기준과 설정 항목을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ec2-autoscaling')

    // 1단 EC2와 Auto Scaling, 인스턴스를 띄우는 재료 → 2단 어느 제품군·어느 구매
    // 옵션·어느 조정 방식인가 → 3단 설정 항목과 주의점.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ec2-autoscaling.ec2',
      'ec2-autoscaling.ami-and-launch-template',
      'ec2-autoscaling.ec2-image-builder',
      'ec2-autoscaling.memory-optimized-instance-family',
      'ec2-autoscaling.gpu-instance-family',
      'ec2-autoscaling.reserved-instance-types',
      'ec2-autoscaling.spot-workload-fit',
      'ec2-autoscaling.scheduled-scaling',
      'ec2-autoscaling.target-tracking-vs-simple-scaling',
      'ec2-autoscaling.predictive-scaling',
      'ec2-autoscaling.spot-allocation-strategy',
      'ec2-autoscaling.asg-instance-type-override',
      'ec2-autoscaling.asg-on-demand-base-capacity',
      'ec2-autoscaling.warm-pool',
      'ec2-autoscaling.asg-single-instance-self-healing',
      'ec2-autoscaling.elb-health-check-drives-asg-replacement',
      'ec2-autoscaling.enhanced-networking',
    ])
  })

  it('로드 밸런서 주제가 세 로드 밸런서 다음에 선택 기준과 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'elastic-load-balancing')

    // 1단 ELB와 세 로드 밸런서가 각각 무엇인가 → 2단 계층·프로토콜·대상·공개
    // 범위로 갈린다 → 3단 분산 알고리즘·규칙·타임아웃·암호화 구간.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'elastic-load-balancing.elb',
      'elastic-load-balancing.gateway-load-balancer',
      'elastic-load-balancing.alb-l7-vs-nlb-l4',
      'elastic-load-balancing.alb-routing-conditions',
      'elastic-load-balancing.nlb-tls-listener',
      'elastic-load-balancing.nlb-udp-listener',
      'elastic-load-balancing.nlb-ip-targets',
      'elastic-load-balancing.alb-cookie-stickiness',
      'elastic-load-balancing.internal-load-balancer',
      'elastic-load-balancing.sticky-session-tradeoff',
      'elastic-load-balancing.alb-least-outstanding-requests',
      'elastic-load-balancing.alb-target-group-independent-scaling',
      'elastic-load-balancing.alb-listener-rule-fixed-response',
      'elastic-load-balancing.load-balancer-idle-timeout',
      'elastic-load-balancing.end-to-end-encryption-behind-alb',
      'elastic-load-balancing.gwlb-endpoint-cross-account-inspection',
    ])
  })

  it('CloudFront·Global Accelerator 주제가 두 서비스와 오리진 다음에 갈림길과 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'cloudfront-global-accelerator')

    // 1단 CloudFront와 그 오리진, Global Accelerator와 그 진입점, 'Edge'의 뜻,
    // 엣지에서 도는 함수 둘 → 2단 캐싱할 사본이 있느냐·비용·DNS 캐시·접근 통제
    // 장치 넷·엣지 함수로 할 수 있는 일의 갈림길 → 3단 가격 등급, 무효화와 TTL,
    // 오리진 접근 제한, 엣지 함수의 한계.
    // step 10이 lambda-at-edge·cloudfront-functions·응답 압축 셋을 옮겨 왔다.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'cloudfront-global-accelerator.cloudfront',
      'cloudfront-global-accelerator.cloudfront-alb-origin',
      'cloudfront-global-accelerator.cloudfront-multiple-origins',
      'cloudfront-global-accelerator.cloudfront-onprem-origin',
      'cloudfront-global-accelerator.global-accelerator',
      'cloudfront-global-accelerator.global-accelerator-static-ip',
      'cloudfront-global-accelerator.global-accelerator-endpoints',
      'cloudfront-global-accelerator.edge-keyword',
      'cloudfront-global-accelerator.lambda-at-edge',
      'cloudfront-global-accelerator.cloudfront-functions',
      'cloudfront-global-accelerator.global-accelerator-protocols',
      'cloudfront-global-accelerator.cloudfront-reduces-data-transfer-cost',
      'cloudfront-global-accelerator.global-accelerator-vs-dns-failover',
      'cloudfront-global-accelerator.cloudfront-signed-url',
      'cloudfront-global-accelerator.cloudfront-signed-cookie',
      'cloudfront-global-accelerator.cloudfront-geo-restriction',
      'cloudfront-global-accelerator.cloudfront-field-level-encryption',
      'cloudfront-global-accelerator.lambda-at-edge-origin-selection-by-viewer-location',
      'cloudfront-global-accelerator.lambda-at-edge-response-compression',
      'cloudfront-global-accelerator.cloudfront-price-class',
      'cloudfront-global-accelerator.cloudfront-ttl',
      'cloudfront-global-accelerator.cloudfront-s3-upload-with-oac',
      'cloudfront-global-accelerator.cloudfront-alb-origin-access-restriction',
      'cloudfront-global-accelerator.cloudfront-functions-no-external-calls',
    ])
  })

  it('CloudFront와 Global Accelerator가 한 주제 안에 함께 있다', () => {
    // SAA-C03 대표 혼동 짝이다. step 9가 compute-delivery를 비울 때 둘을 다른 주제로
    // 떼어 놓으면 "언제 무엇을 쓰는가"를 비교할 자리가 없어진다
    // (PRD "사용자", topic-plan "헷갈리는 짝 배치").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id

    const fork = ownerOf('cloudfront-global-accelerator.global-accelerator-protocols')
    expect(fork).toBe('cloudfront-global-accelerator')
    expect(ownerOf('cloudfront-global-accelerator.cloudfront')).toBe(fork)
    expect(ownerOf('cloudfront-global-accelerator.global-accelerator')).toBe(fork)
    // 갈림길을 세우는 축이 셋이다 — 사본이 있느냐, 비용, DNS 캐시.
    expect(ownerOf('cloudfront-global-accelerator.cloudfront-reduces-data-transfer-cost')).toBe(fork)
    expect(ownerOf('cloudfront-global-accelerator.global-accelerator-vs-dns-failover')).toBe(fork)
  })

  it('CloudFront의 접근 통제 장치 넷이 서로 무엇으로 갈리는지 한 주제 안에서 읽힌다', () => {
    // 서명된 URL ↔ 서명된 쿠키 ↔ 지리적 제한 ↔ 필드 수준 암호화. 기준이 각각
    // 개별 사용자·URL의 동일성·국가·값 자체라서, 떼어 놓으면 무엇이 무엇의 대안인지
    // 알 수 없게 된다.
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    expect(bodyOf('cloudfront-global-accelerator.cloudfront-signed-url')).toContain('유효 기간 동안만')
    expect(bodyOf('cloudfront-global-accelerator.cloudfront-signed-cookie')).toContain('파일마다 URL이 달라진다')
    expect(bodyOf('cloudfront-global-accelerator.cloudfront-geo-restriction')).toContain('국가를 기준으로 삼지 않는다')
    expect(bodyOf('cloudfront-global-accelerator.cloudfront-field-level-encryption')).toContain('전달되는 값 자체를 가리는')
  })

  it('로드 밸런서 셋의 선택 기준이 한 주제 안에 함께 있다', () => {
    // ALB ↔ NLB ↔ Gateway Load Balancer는 "언제 무엇을 쓰는가"가 그대로 문항이다.
    // step 8이 compute-delivery를 가를 때 셋을 떼어 놓으면 비교할 자리가 없어진다
    // (PRD "사용자", topic-plan "헷갈리는 짝 배치").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id

    const layers = ownerOf('elastic-load-balancing.alb-l7-vs-nlb-l4')
    expect(layers).toBe('elastic-load-balancing')
    expect(ownerOf('elastic-load-balancing.elb')).toBe(layers)
    expect(ownerOf('elastic-load-balancing.gateway-load-balancer')).toBe(layers)
    expect(ownerOf('elastic-load-balancing.nlb-udp-listener')).toBe(layers)
    expect(ownerOf('elastic-load-balancing.gwlb-endpoint-cross-account-inspection')).toBe(layers)
  })

  it('구매 옵션 셋의 갈림길이 한 주제 안에 함께 있다', () => {
    // 스팟 ↔ 온디맨드 ↔ 예약 인스턴스도 갈림길이다. 셋을 처음 소개하는 것은 기존
    // ec2 개념의 문단이고, 고르는 기준은 새로 들어온 개념들이 맡는다.
    const topic = topics.find((candidate) => candidate.id === 'ec2-autoscaling')
    const slugs = new Set(topic?.concepts.map(({ id }) => id.split('.')[1]))
    const body = topic?.concepts
      .find(({ id }) => id === 'ec2-autoscaling.ec2')
      ?.paragraphs.join(' ') ?? ''

    expect(body).toContain('온디맨드 인스턴스')
    expect(body).toContain('스팟 인스턴스')
    expect(body).toContain('예약 인스턴스')
    expect(slugs).toContain('reserved-instance-types')
    expect(slugs).toContain('spot-workload-fit')
    expect(slugs).toContain('spot-allocation-strategy')
    expect(slugs).toContain('asg-on-demand-base-capacity')
  })

  it('오토 스케일링 조정 방식 넷이 한 주제 안에서 이어진다', () => {
    // 예약된 조정 ↔ 대상 추적 ↔ 단순 조정 ↔ 예측 스케일링. 기존 scheduled-scaling이
    // 앞의 둘을 예측 가능성으로 가르고, step 8이 들여온 둘이 남은 축을 세운다.
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    expect(bodyOf('ec2-autoscaling.scheduled-scaling')).toContain('대상 추적')
    expect(bodyOf('ec2-autoscaling.target-tracking-vs-simple-scaling')).toContain('단순 조정')
    expect(bodyOf('ec2-autoscaling.predictive-scaling')).toContain('예약된 조정과 대상 추적')
  })

  it('Lambda 주제가 함수를 만드는 이야기 다음에 갈림길과 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'lambda')

    // 1단 Lambda가 무엇이고 어떻게 부르고 어디에 붙이고 어떻게 배포하는가
    // → 2단 호출 방식, 크기를 정하는 값, 동시성 세 갈래
    // → 3단 콜드 스타트를 줄이는 다른 길, 메모리·레이어 상한, 굳는 설정, 실행 역할.
    // Lambda가 무엇인지 모르는 사람에게 lambda-layer-size-limit은 아무것도 주지 않는다
    // (topic-plan "주제 안의 개념 순서").
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'lambda.lambda',
      'lambda.lambda-function-url',
      'lambda.lambda-function-url-iam-auth',
      'lambda.lambda-vpc-access',
      'lambda.lambda-container-image',
      'lambda.lambda-invocation-types',
      'lambda.lambda-memory-cpu-proportional',
      'lambda.lambda-reserved-concurrency',
      'lambda.lambda-provisioned-concurrency-autoscaling',
      'lambda.lambda-concurrency-limit-throttling',
      'lambda.lambda-kinesis-event-source',
      'lambda.lambda-snapstart',
      'lambda.lambda-memory-ceiling',
      'lambda.lambda-layer-size-limit',
      'lambda.lambda-efs-mount',
      'lambda.lambda-version-alias-config-freeze',
      'lambda.lambda-execution-role-logs',
      'lambda.serverless-runtime-no-os-access',
    ])
  })

  it('컨테이너 주제가 서비스 소개 다음에 실행 방식 갈림길과 설정을 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'ecs-eks-fargate')

    // 1단 컨테이너를 돌리고 담고 옮기는 서비스 여섯이 각각 무엇인가
    // → 2단 세 실행 방식의 관리 책임, 파드와 노드, 클러스터 가시성, 권한을 어디에 붙이나
    // → 3단 네트워크 모드·배치 전략·과금 단위·저장소·시크릿 암호화.
    // ECS가 무엇인지 모르는 사람에게 ecs-task-placement-strategy는 아무것도 주지 않는다
    // (topic-plan "주제 안의 개념 순서").
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'ecs-eks-fargate.ecs',
      'ecs-eks-fargate.eks',
      'ecs-eks-fargate.ecr-image-scan-on-push',
      'ecs-eks-fargate.aws-batch',
      'ecs-eks-fargate.elastic-beanstalk',
      'ecs-eks-fargate.app2container',
      'ecs-eks-fargate.eks-compute-options',
      'ecs-eks-fargate.fargate-no-time-limit',
      'ecs-eks-fargate.fargate-spot',
      'ecs-eks-fargate.batch-fargate-compute-environment',
      'ecs-eks-fargate.eks-fargate-pod-isolation',
      'ecs-eks-fargate.eks-cluster-autoscaler',
      'ecs-eks-fargate.eks-aws-load-balancer-controller',
      'ecs-eks-fargate.eks-connector',
      'ecs-eks-fargate.eks-anywhere',
      'ecs-eks-fargate.ecs-task-role',
      'ecs-eks-fargate.ecs-task-role-vs-task-execution-role',
      'ecs-eks-fargate.eks-irsa',
      'ecs-eks-fargate.ecs-awsvpc-mode',
      'ecs-eks-fargate.ecs-task-placement-strategy',
      'ecs-eks-fargate.fargate-per-second-billing',
      'ecs-eks-fargate.fargate-efs-mount',
      'ecs-eks-fargate.eks-secrets-kms-encryption',
    ])
  })

  it('API Gateway·Step Functions 주제가 두 서비스 다음에 갈림길과 한계를 둔다', () => {
    const topic = topics.find((candidate) => candidate.id === 'api-gateway-step-functions')

    // 1단 API Gateway와 Step Functions가 무엇이고 무엇을 주는가
    // → 2단 API 유형 셋, API 키의 한계, 접근 통제, 노출 위치, 통합 방식, 워크플로 두 유형
    // → 3단 인증서 리전·매핑 템플릿의 한계·보안 그룹을 붙일 수 없다는 것.
    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      'api-gateway-step-functions.api-gateway',
      'api-gateway-step-functions.step-functions',
      'api-gateway-step-functions.step-functions-features',
      'api-gateway-step-functions.api-gateway-jwt-authorizer',
      'api-gateway-step-functions.api-gateway-rest-vs-http-timeout',
      'api-gateway-step-functions.api-gateway-rest-only-features',
      'api-gateway-step-functions.api-gateway-websocket-api',
      'api-gateway-step-functions.api-gateway-api-key-not-auth',
      'api-gateway-step-functions.api-gateway-resource-policy',
      'api-gateway-step-functions.api-gateway-endpoint-types',
      'api-gateway-step-functions.api-gateway-behind-cloudfront',
      'api-gateway-step-functions.api-gateway-lambda-proxy-integration',
      'api-gateway-step-functions.api-gateway-aws-service-integration',
      'api-gateway-step-functions.step-functions-long-running-workflow',
      'api-gateway-step-functions.step-functions-express-workflow',
      'api-gateway-step-functions.step-functions-map-state',
      'api-gateway-step-functions.api-gateway-custom-domain-name',
      'api-gateway-step-functions.api-gateway-mapping-template-limits',
      'api-gateway-step-functions.api-gateway-ip-restriction-by-resource-policy',
    ])
  })

  it('컨테이너 실행 방식 셋의 갈림길이 한 주제 안에서 관리 책임으로 갈린다', () => {
    // ECS ↔ EKS ↔ Fargate. 컨테이너를 어디서 돌리는가가 그대로 문항이므로 떼어 놓으면
    // 비교할 자리가 없어진다(PRD "사용자", topic-plan "헷갈리는 짝 배치").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    const fork = ownerOf('ecs-eks-fargate.ecs')
    expect(fork).toBe('ecs-eks-fargate')
    ;[
      'ecs-eks-fargate.eks',
      'ecs-eks-fargate.eks-compute-options',
      'ecs-eks-fargate.fargate-no-time-limit',
      'ecs-eks-fargate.fargate-spot',
      'ecs-eks-fargate.fargate-per-second-billing',
    ].forEach((conceptId) => expect(ownerOf(conceptId)).toBe(fork))
    // ECS ↔ EKS는 원래 쿠버네티스였는지로 갈리고, 세 실행 방식은 인프라 관리 책임이
    // 어디까지 남는지로 갈린다. Lambda ↔ Fargate는 실행 시간과 최소 과금 단위다.
    expect(bodyOf('ecs-eks-fargate.eks')).toContain('원래 쿠버네티스였는가')
    expect(bodyOf('ecs-eks-fargate.eks-compute-options')).toContain(
      'EC2 인스턴스의 패치와 관리 책임은 여전히 사용자에게 남는다',
    )
    expect(bodyOf('ecs-eks-fargate.fargate-per-second-billing')).toContain('최소 1분을 매긴다')
  })

  it('API 유형 셋과 워크플로 두 유형이 한 주제 안에서 갈린다', () => {
    // API Gateway REST ↔ HTTP ↔ WebSocket, Step Functions 표준 ↔ Express.
    // 엔드포인트 유형과 지원 기능이 갈리는 자리이므로 함께 둔다
    // (topic-plan "헷갈리는 짝 배치").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    const fork = ownerOf('api-gateway-step-functions.api-gateway')
    expect(fork).toBe('api-gateway-step-functions')
    ;[
      'api-gateway-step-functions.api-gateway-jwt-authorizer',
      'api-gateway-step-functions.api-gateway-rest-vs-http-timeout',
      'api-gateway-step-functions.api-gateway-rest-only-features',
      'api-gateway-step-functions.api-gateway-websocket-api',
      'api-gateway-step-functions.step-functions-long-running-workflow',
      'api-gateway-step-functions.step-functions-express-workflow',
    ].forEach((conceptId) => expect(ownerOf(conceptId)).toBe(fork))
    // 두 API 유형은 기능·비용·지연 말고 기다려 주는 시간과 기능 목록으로도 갈리고,
    // WebSocket API는 요청·응답 모델 자체가 다르다.
    expect(bodyOf('api-gateway-step-functions.api-gateway-rest-vs-http-timeout')).toContain(
      '그 시간이 REST API 쪽이 더 길기 때문에',
    )
    expect(bodyOf('api-gateway-step-functions.api-gateway-rest-only-features')).toContain(
      'HTTP API는 이 고급 기능들을 완전히 지원하지 않는다',
    )
    expect(bodyOf('api-gateway-step-functions.api-gateway-websocket-api')).toContain(
      '연결을 오래 유지한 채',
    )
    // 워크플로는 실행 시간 상한과 처리량이 반대편을 맡는다.
    expect(bodyOf('api-gateway-step-functions.step-functions-long-running-workflow')).toContain(
      '최대 1년까지',
    )
    expect(bodyOf('api-gateway-step-functions.step-functions-express-workflow')).toContain(
      '높은 처리량, 짧은 실행 시간, 낮은 비용',
    )
  })

  it('동시성 세 갈래가 한 주제 안에서 서로 무엇으로 갈리는지 읽힌다', () => {
    // 예약된 동시성 ↔ 프로비저닝된 동시성 ↔ 계정의 동시 실행 한도. 이름이 닮아
    // 보기 줄에 나란히 오르므로 떼어 놓으면 무엇이 무엇의 대안인지 알 수 없게 된다
    // (PRD "사용자", topic-plan "헷갈리는 짝 배치").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    const fork = ownerOf('lambda.lambda-reserved-concurrency')
    expect(fork).toBe('lambda')
    expect(ownerOf('lambda.lambda-provisioned-concurrency-autoscaling')).toBe(fork)
    expect(ownerOf('lambda.lambda-concurrency-limit-throttling')).toBe(fork)
    // 콜드 스타트를 줄이는 쪽과 용량만 떼어 두는 쪽이 갈리고, 한도는 넘칠 때 무슨 일이
    // 벌어지는지를 맡는다. 콜드 스타트를 소개하는 것은 기존 lambda 개념의 문단이다.
    expect(bodyOf('lambda.lambda')).toContain('콜드 스타트')
    expect(bodyOf('lambda.lambda-reserved-concurrency')).toContain('콜드 스타트는 그대로 남는다')
    expect(bodyOf('lambda.lambda-provisioned-concurrency-autoscaling')).toContain('수요를 따라 오르내린다')
    expect(bodyOf('lambda.lambda-concurrency-limit-throttling')).toContain('확장을 묶는 쪽으로 작용한다')
  })

  it('엣지에서 코드를 돌리는 두 갈래가 CloudFront 주제 안에 함께 있다', () => {
    // Lambda@Edge ↔ CloudFront Functions. step 10이 serverless-containers에 있던
    // lambda-at-edge를 CloudFront 쪽으로 옮겨 온 이유가 이 갈림길이다
    // (topic-plan "헷갈리는 짝 배치", "step 경계를 넘는 개념").
    const ownerOf = (conceptId: string) =>
      topics.find((topic) => topic.concepts.some(({ id }) => id === conceptId))?.id
    const bodyOf = (conceptId: string) =>
      topics
        .flatMap((topic) => topic.concepts)
        .find(({ id }) => id === conceptId)
        ?.paragraphs.join(' ') ?? ''

    const edge = ownerOf('cloudfront-global-accelerator.lambda-at-edge')
    expect(edge).toBe('cloudfront-global-accelerator')
    expect(ownerOf('cloudfront-global-accelerator.cloudfront-functions')).toBe(edge)
    expect(ownerOf('cloudfront-global-accelerator.cloudfront-functions-no-external-calls')).toBe(edge)
    expect(ownerOf('cloudfront-global-accelerator.lambda-at-edge-response-compression')).toBe(edge)
    // 둘을 가르는 축은 실행 모델이고, 각자 할 수 있는 일이 그 뒤에 이어진다.
    expect(bodyOf('cloudfront-global-accelerator.cloudfront-functions')).toContain('프로그래밍 모델과 배포 방식이 서로 다르다')
    expect(bodyOf('cloudfront-global-accelerator.lambda-at-edge-response-compression')).toContain('전달 직전에 응답을 압축한다')
  })

  it('S3 스토리지 클래스 문제 9개가 클래스별 개념과 일대일로 이어진다', () => {
    const storageClassQuestions = questions.filter(
      (question) => question.topicId === 's3-storage-classes',
    )

    expect(storageClassQuestions.map(({ id }) => id)).toEqual([
      'q016',
      'q017',
      'q018',
      'q019',
      'q020',
      'q021',
      'q022',
      'q023',
      'q024',
    ])
    expect(storageClassQuestions.map(({ conceptId }) => conceptId)).toEqual([
      's3-storage-classes.intelligent-tiering',
      's3-storage-classes.standard',
      's3-storage-classes.standard-ia',
      's3-storage-classes.one-zone-ia',
      's3-storage-classes.glacier-instant-retrieval',
      's3-storage-classes.glacier-flexible-retrieval',
      's3-storage-classes.glacier-deep-archive',
      's3-storage-classes.glacier-or-standard-ia',
      's3-storage-classes.retrieval-time',
    ])
    expect(new Set(storageClassQuestions.map(({ conceptId }) => conceptId)).size).toBe(9)
  })

  it('주제 id가 유일하다', () => {
    const ids = topics.map((topic) => topic.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('주제 중요도가 3, 2 또는 0이다', () => {
    topics.forEach((topic) => {
      expect([3, 2, 0]).toContain(topic.importance)
    })
  })

  it('개념 id가 전역에서 유일하다', () => {
    const ids = topics.flatMap((topic) =>
      topic.concepts.map((concept) => concept.id),
    )

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('모든 주제는 하나 이상의 개념을 가진다', () => {
    topics.forEach((topic) => {
      expect(topic.concepts.length).toBeGreaterThan(0)
    })
  })

  it('모든 개념의 이름과 요약이 빈 문자열이 아니다', () => {
    topics.forEach((topic) => {
      topic.concepts.forEach((concept) => {
        expect(concept.name.trim()).not.toBe('')
        expect(concept.summary.trim()).not.toBe('')
      })
    })
  })

  it('모든 개념은 하나 이상의 빈 문자열이 아닌 문단을 가진다', () => {
    topics.forEach((topic) => {
      topic.concepts.forEach((concept) => {
        expect(concept.paragraphs.length).toBeGreaterThan(0)
        concept.paragraphs.forEach((paragraph) => {
          expect(paragraph.trim()).not.toBe('')
        })
      })
    })
  })

  it('모든 주제의 원본 페이지 범위가 올바르다', () => {
    topics.forEach((topic) => {
      expect(topic.sourcePages).toHaveLength(2)
      expect(topic.sourcePages[0]).toBeLessThanOrEqual(topic.sourcePages[1])
    })
  })

  it('문제 id가 유일하다', () => {
    const ids = questions.map((question) => question.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('모든 문제가 실재하는 주제를 참조한다', () => {
    const topicIds = new Set(topics.map((topic) => topic.id))

    questions.forEach((question) => {
      expect(topicIds.has(question.topicId)).toBe(true)
    })
  })

  it('모든 문제가 실재하는 개념을 참조한다', () => {
    const conceptIds = new Set(
      topics.flatMap((topic) => topic.concepts.map((concept) => concept.id)),
    )

    questions.forEach((question) => {
      expect(conceptIds.has(question.conceptId)).toBe(true)
    })
  })

  it('모든 문제는 서로 다른 보기 4개를 가진다', () => {
    questions.forEach((question) => {
      expect(question.choices).toHaveLength(4)
      expect(new Set(question.choices).size).toBe(4)
    })
  })

  it('모든 문제의 정답 인덱스가 0부터 3 범위다', () => {
    questions.forEach((question) => {
      expect(question.answerIndex).toBeGreaterThanOrEqual(0)
      expect(question.answerIndex).toBeLessThanOrEqual(3)
    })
  })

  it('모든 문제의 해설이 빈 문자열이 아니다', () => {
    questions.forEach((question) => {
      expect(question.explanation.trim()).not.toBe('')
    })
  })

  it('정답이 Glacier 계열인 문항은 모두 법·감사 목적을 문제문에 담는다', () => {
    const glacierAnswered = questions.filter((question) =>
      question.choices[question.answerIndex].includes('Glacier'),
    )

    expect(glacierAnswered.map(({ id }) => id)).toEqual([
      'q020',
      'q021',
      'q022',
      'q023',
      'q024',
    ])
    glacierAnswered.forEach((question) => {
      expect(question.prompt).toContain('법')
      expect(question.prompt).toContain('감사')
    })
  })

  it('법·감사 키워드가 Glacier의 무조건 신호가 되지 않도록 q018이 부정형을 유지한다', () => {
    const question = questions.find(({ id }) => id === 'q018')

    expect(question?.choices[question.answerIndex]).toBe('S3 Standard-IA')
    expect(question?.prompt).toContain('아니면서')
  })

  it('q024는 Glacier 보기를 둘 이상 두어 법 키워드만으로 답이 정해지지 않는다', () => {
    const question = questions.find(({ id }) => id === 'q024')
    const glacierChoices = question?.choices.filter((choice) => choice.includes('Glacier')) ?? []

    expect(glacierChoices.length).toBeGreaterThanOrEqual(2)
    expect(question?.choices[question.answerIndex]).toBe('S3 Glacier Deep Archive')
  })

  const termGlosses: Array<{ conceptId: string; anchor: string }> = [
    { conceptId: 's3-versioning-lifecycle.object-lock-prerequisites', anchor: 'Multi-Factor Authentication' },
    { conceptId: 'efs-fsx.efs', anchor: 'Network File System' },
    { conceptId: 'data-transfer-services.transfer-family', anchor: 'File Transfer Protocol' },
    { conceptId: 'dynamodb.dynamodb', anchor: '키-값' },
    { conceptId: 'dynamodb.dynamodb', anchor: '미리 담아 두었다가' },
    { conceptId: 'aurora.aurora-reader-endpoint', anchor: '애플리케이션이 접속할 주소' },
    { conceptId: 'elastic-load-balancing.elb', anchor: '실어 나를지 정하는' },
    { conceptId: 'elastic-load-balancing.sticky-session-tradeoff', anchor: '차례대로 돌아가며' },
    { conceptId: 'cloudfront-global-accelerator.cloudfront-ttl', anchor: 'Time-to-Live' },
    { conceptId: 'api-gateway-step-functions.api-gateway', anchor: 'JSON Web Token' },
    { conceptId: 'threat-protection.shield', anchor: 'Distributed Denial of Service' },
    { conceptId: 'threat-protection.shield-advanced-drt', anchor: 'DDoS Response Team' },
    { conceptId: 'threat-protection.waf', anchor: 'Cross-Site Scripting' },
    { conceptId: 'threat-protection.security-service-lineup', anchor: 'Common Vulnerabilities' },
    { conceptId: 'secrets-encryption.acm', anchor: 'SSL의 후속' },
  ]

  it('풀이 없이 쓰이던 일반 IT 용어 15종이 첫 등장 개념에서 한 번씩 풀린다', () => {
    const concepts = topics.flatMap((topic) => topic.concepts)

    termGlosses.forEach(({ conceptId, anchor }) => {
      const holders = concepts.filter((concept) =>
        concept.paragraphs.some((paragraph) => paragraph.includes(anchor)),
      )

      expect(holders.map(({ id }) => id)).toEqual([conceptId])
    })
  })

  it('용어 풀이가 개념 요약이 아니라 본문에만 들어간다', () => {
    const concepts = topics.flatMap((topic) => topic.concepts)

    concepts.forEach((concept) => {
      termGlosses.forEach(({ anchor }) => {
        expect(concept.summary).not.toContain(anchor)
        expect(concept.name).not.toContain(anchor)
      })
    })
  })

  it('Storage Gateway 문단이 일회성 전송과의 차이와 S3 저장 사실을 함께 밝힌다', () => {
    const concept = topics
      .flatMap((topic) => topic.concepts)
      .find(({ id }) => id === 'storage-gateway-migration.storage-gateway')

    expect(concept?.paragraphs).toHaveLength(4)
    expect(concept?.paragraphs[0]).toContain('스토리지를 연결한 채 사용하는 데 있다')
    expect(concept?.paragraphs[0]).toContain('세 유형 모두 데이터를 S3에 저장한다')
    expect(concept?.paragraphs[0]).toContain('DataSync·Snowball Edge와 달리')
    expect(concept?.paragraphs[0]).toContain('자체 저장 공간을 제공하지 않으며')
  })

  it('RDS 세 기능의 목적 차이가 Read Replica 문단에 드러난다', () => {
    const concept = topics
      .flatMap((topic) => topic.concepts)
      .find(({ id }) => id === 'rds-storage-features.features')

    expect(concept?.paragraphs).toHaveLength(5)
    expect(concept?.paragraphs[2]).toContain('Multi AZ 배포는 고가용성')
    expect(concept?.paragraphs[2]).toContain('Read Replica는 읽기 확장')
    expect(concept?.paragraphs[2]).toContain('Multi AZ DB Cluster는 그 둘을 함께 얻는 구성이다')
    expect(concept?.paragraphs[2]).toContain('Cross Region Read Replica')
  })

  it('S3·스토리지 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q171).toBe('S3 객체 잠금은 정해진 기간 동안 객체의 수정과 삭제를 막는 기능이다. 이 잠금을 걸려면 버킷에 먼저 활성화해야 하는 기능은?')
    expect(prompts.q172).toBe('S3 이벤트 알림은 파일이 올라오는 즉시 Lambda 같은 서비스를 자동으로 호출한다. 이 알림이 객체 생성 이벤트를 발생시키는 대상은?')
    expect(prompts.q173).toBe('봉투 암호화는 데이터를 데이터 키로 암호화하고 그 키를 다시 마스터 키로 암호화하는 방식이다. 이 방식과 암호화 키의 주기적 자동 교체가 모두 필요할 때 선택할 것은?')
    expect(prompts.q174).toBe('SSE-KMS는 객체를 암호화할 때마다 KMS API를 불러서 객체가 많으면 호출 비용이 급증한다. 암호화 방식은 그대로 두고 이 비용을 줄이는 기능은?')
    expect(prompts.q175).toBe('수천 개 노드가 동시에 데이터를 읽고 쓰는 HPC 워크로드에서 노드 사이의 네트워크 지연을 최대한 줄여야 한다. EC2를 어떻게 배치해야 하는가?')
    expect(prompts.q176).toBe('서비스를 멈추지 않고 EC2에 붙어 있는 EBS 볼륨의 크기를 늘려야 한다. 볼륨을 떼었다 붙이지 않고 확장하는 기능은?')
    expect(prompts.q177).toBe('EFS에 오래 방치된 파일의 보관 비용을 줄이되 필요할 때는 즉시 읽을 수 있어야 한다. 접근이 없는 파일을 자동으로 저렴한 클래스로 옮기는 기능은?')
  })

  it('데이터베이스·확장 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q179).toBe('쓰기 작업량이 급격히 치솟는 RDS 워크로드에서 지연 시간을 보장하려면 IOPS를 직접 지정하는 스토리지를 고른다. 이 프로비저닝된 IOPS SSD의 표기는?')
    expect(prompts.q181).toBe('규정 준수를 위해 백업을 얼마나 오래 둘 수 있는지부터 확인하려 한다. RDS 자동 백업의 최대 보존 기간은?')
    expect(prompts.q183).toBe('플레이어 수가 시시각각 바뀌어 용량을 예측하기 어려운 게임 서버에 관계형 데이터베이스가 필요하다. 용량을 1초 단위로 자동 조정하는 구성은?')
    expect(prompts.q184).toBe('Aurora에 읽기 전용 복제본을 여러 개 두고, 애플리케이션이 어느 쪽으로 보낼지 직접 고르지 않게 하려 한다. 접속 주소 하나로 부하를 자동 분산하는 Aurora 전용 기능은?')
    expect(prompts.q186).toBe('DynamoDB에서 사고가 나기 직전 시점으로 데이터를 되돌리려고 특정 시점 복구(PITR)를 검토한다. PITR로 되돌릴 수 있는 최대 기간은?')
    expect(prompts.q188).toBe('트래픽이 급증할 때 새 EC2가 부팅되고 애플리케이션이 뜰 때까지 응답이 지연된다. 실행 비용은 늘리지 않으면서 이 지연을 없애는 Auto Scaling 기능은?')
  })

  it('전송·서버리스 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q192).toBe('실시간 게임 서버처럼 HTTP가 아닌 트래픽을 전 세계 사용자에게 빠르게 전달하고, 리전에 장애가 나면 정상 리전으로 넘겨야 한다. 적합한 서비스는?')
    expect(prompts.q197).toBe('관리자가 필요할 때 눌러 보고서를 만드는 정도의 단순한 호출이라 API Gateway를 앞에 두기가 과하다. Lambda 함수에 직접 HTTP(S) 주소를 붙이는 기능은?')
    expect(prompts.q198).toBe('로그인 과정의 지연까지 줄이려고 권한 부여 로직을 사용자와 가장 가까운 곳에서 처리하려 한다. CloudFront 엣지 로케이션에서 코드를 실행하는 방식은?')
    expect(prompts.q200).toBe('JWT로 사용자를 인증하는 퍼블릭 API를 ALB와 직접 통합해야 한다. 이 두 가지를 기본 지원하면서 REST API보다 비용과 지연이 낮은 API Gateway 유형은?')
  })

  it('네트워크·분석 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q210).toBe('Egress-only 인터넷 게이트웨이는 NAT 게이트웨이처럼 안에서 밖으로 나가는 통신만 담당한다. 이 게이트웨이가 아웃바운드 통신을 제공하는 IP 버전은?')
    expect(prompts.q213).toBe('S3는 VPC나 서브넷 안에 만들 수 없는 리전 수준 서비스다. 이런 S3 버킷의 접근 제어에 사용하는 것은?')
    expect(prompts.q215).toBe('일관되고 낮은 지연 시간과 수백 개 VPC 연결이 동시에 필요한 하이브리드 네트워크를 만들려 한다. Direct Connect와 Transit Gateway를 묶는 통로는?')
    expect(prompts.q221).toBe('다중값 응답 라우팅은 각 레코드에 연동된 헬스 체크로 장애가 난 곳을 빼고 무작위로 응답한다. 이 정책이 한 번에 반환할 수 있는 정상 레코드의 최댓값은?')
    expect(prompts.q222).toBe('S3에 막 들어온 데이터를 Athena로 곧바로 분석하려 한다. 데이터를 스캔해 구조를 파악하고 쿼리할 수 있는 상태로 준비하는 기능은?')
  })

  it('네트워크 보충 문항의 상황 문장이 오답을 대신 지워주지 않는다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q210).not.toContain('IPv4')
    expect(prompts.q213).not.toContain('보안 그룹')
    expect(prompts.q221).not.toContain('8개')
    expect(prompts.q222).not.toContain('Glue Job')
  })

  it('보안·권한·비용 보충 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q225).toBe('NACL은 규칙 수에 제한이 있어 매장 5만 곳의 IP를 개별 등록할 수 없다. 이 IP에서 오는 웹 요청만 허용할 때 적합한 기능은?')
    expect(prompts.q227).toBe('S3에 올린 정적 사이트를 CloudFront로 서비스하면서 사용자 지정 도메인에 HTTPS를 적용하려 한다. ACM 인증서를 발급해야 하는 리전은?')
    expect(prompts.q232).toBe('전 세계에서 오는 악성 봇이 대량의 요청을 보내 컴퓨팅 리소스를 낭비하고 있다. 요청 속도 같은 행동 패턴으로 이를 탐지하고 제어하는 기능은?')
    expect(prompts.q236).toBe('EC2의 소프트웨어 패치 누락과 공개적으로 알려진 보안 취약점(CVE)을 스캔하는 서비스는?')
    expect(prompts.q239).toBe('EC2에 S3 접근 권한을 주려고 IAM 그룹에 그 인스턴스를 넣으려 한다. IAM 그룹에 직접 추가할 수 있는 대상은?')
    expect(prompts.q241).toBe('Cognito로 로그인을 마친 사용자가 S3에 접근할 수 있게 하려 한다. 인증된 사용자에게 임시 권한을 제공하는 구성 요소는?')
    expect(prompts.q243).toBe('부서별로 비용을 나눠 보려고 리소스에 사용자 정의 태그를 붙였다. Cost Explorer에서 이 태그로 비용을 집계하려면 그다음 무엇을 해야 하는가?')
  })

  it('보안 보충 문항의 상황 문장이 오답을 대신 지워주지 않는다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q225).not.toContain('WAF')
    expect(prompts.q227).not.toContain('us-east-1')
    expect(prompts.q241).not.toContain('사용자 풀')
  })

  it('리드인을 붙인 29문항이 정답을 노출하지 않고 길이 상한을 지킨다', () => {
    const leadInIds = [
      'q171', 'q172', 'q173', 'q174', 'q175', 'q176', 'q177',
      'q179', 'q181', 'q183', 'q184', 'q186', 'q188',
      'q192', 'q197', 'q198', 'q200',
      'q210', 'q213', 'q215', 'q221', 'q222',
      'q225', 'q227', 'q232', 'q236', 'q239', 'q241', 'q243',
    ]

    const targets = questions.filter(({ id }) => leadInIds.includes(id))

    expect(targets).toHaveLength(29)
    targets.forEach((question) => {
      expect(question.prompt.length).toBeLessThanOrEqual(120)
      expect(question.prompt).not.toContain(question.choices[question.answerIndex])
    })
  })
  it('전제 용어를 설명하지 않던 문항이 상황을 세우는 프롬프트로 바뀐다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q131).toBe('보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다. 규칙을 하나도 추가하지 않은 초기 상태의 인바운드는?')
    expect(prompts.q132).toBe('보안 그룹은 리소스에서 밖으로 나가는 트래픽에도 규칙을 적용한다. 규칙을 하나도 추가하지 않은 초기 상태의 아웃바운드는?')
    expect(prompts.q134).toBe('NACL은 개별 리소스가 아니라 서브넷 경계에서 트래픽을 통제한다. 규칙을 손대지 않은 초기 상태의 인바운드와 아웃바운드는?')
    expect(prompts.q156).toBe('Access Key는 만료 시점이 없어 장기 자격 증명으로 분류한다. 이런 키를 서로 전달하지 않고 언제든 해제할 수 있는 권한 부여 방식은?')
  })

  it('정의 자체를 묻는 문항은 상황 문장 없이 그대로 남는다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    // 리드인을 붙이면 개념 summary가 곧 정답이 되는 문항들이다. 바뀌면 정답이 노출된 것이다.
    expect(prompts.q053).toBe('Storage Gateway의 주된 목적은?')
    expect(prompts.q057).toBe('Storage Gateway 자체의 스토리지 기능에 대한 설명으로 맞는 것은?')
    expect(prompts.q144).toBe('Secrets Manager와 Parameter Store의 공통 기능은?')
    expect(prompts.q160).toBe('만료 기간이 있는 Access Key나 Token 형태의 임시 권한을 발급하는 서비스는?')
  })

  it('막연한 일반 명사를 쓰던 문항이 구체적 사례로 바뀐다', () => {
    const question = questions.find(({ id }) => id === 'q088')

    expect(question?.prompt).toBe('이미지 리사이징이나 보고서 발송 같은 처리 여러 개를 정해진 순서로 이어 실행하고, 각 단계의 재시도와 오류 처리를 맡는 서비스는?')
    // 보기에 있는 서비스명을 꺼내면 오답이 소거된다.
    question?.choices.forEach((choice) => {
      expect(question.prompt).not.toContain(choice)
    })
  })

  it('가리키는 대상이 없던 명사와 전제 용어가 문항 안에서 해결된다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    expect(prompts.q039).toBe('수백만~수십억 개의 파일을 한꺼번에 복사하거나 삭제하는 것처럼 동일한 작업을 일괄 실행하는 서비스는?')
    expect(prompts.q043).toBe('EFS IA(Infrequent Access)는 접근이 뜸한 파일을 옮겨 두는 EFS 클래스다. 이 클래스로 옮긴 파일의 접근 특성으로 맞는 것은?')
    expect(prompts.q075).toBe('평균 CPU 사용률 70% 같은 목표값을 유지하도록 서버를 자동으로 확장하거나 축소하는 정책은?')
    expect(prompts.q103).toBe('NAT 게이트웨이는 외부에서 시작하는 접근은 막고 내부에서 인터넷으로 나가는 통신만 가능하게 하는 장치다. 이 게이트웨이를 연결하는 위치는?')
    expect(prompts.q133).toBe('보안 그룹은 리소스에 도달하려는 요청을 문 앞에서 검사하는 방화벽이다. 이 규칙에 추가할 수 있는 동작은?')
    expect(prompts.q135).toBe('NACL은 서브넷 경계에서 트래픽을 허용하거나 거부하는 기능이다. 이 규칙 설정에 사용할 수 있는 대상은?')
    expect(prompts.q217).toBe('Site-to-Site VPN은 인터넷에 암호화된 터널을 만들어 온프레미스와 AWS를 연결한다. 이 연결에서 고객 측 종단을 가리키는 구성 요소는?')
  })

  it('보강한 7문항이 보기를 노출하지 않고 길이 상한을 지킨다', () => {
    const targetIds = ['q039', 'q043', 'q075', 'q103', 'q133', 'q135', 'q217']
    const targets = questions.filter(({ id }) => targetIds.includes(id))

    expect(targets).toHaveLength(7)
    targets.forEach((question) => {
      expect(question.prompt.length).toBeLessThanOrEqual(120)
      // 보기 문자열을 꺼내면 오답이 소거된다.
      question.choices.forEach((choice) => {
        expect(question.prompt).not.toContain(choice)
      })
    })
  })

  it('리드인이 곧 정답이 되는 문항은 그대로 남는다', () => {
    const prompts = Object.fromEntries(questions.map(({ id, prompt }) => [id, prompt]))

    // 전수 읽기에서 후보로 올랐지만 손대면 정답이 드러나는 문항들이다. 바뀌면 노출된 것이다.
    expect(prompts.q066).toBe('Aurora를 가장 잘 설명한 것은?')
    expect(prompts.q115).toBe('높은 대역폭과 빠른 성능을 제공하며 보안성이 높은 Direct Connect의 통신 기반은?')
    expect(prompts.q142).toBe('KMS가 저장하는 대상으로 알맞은 것은?')
    expect(prompts.q147).toBe('WAF가 방어하는 공격이 속한 계층은?')
    expect(prompts.q180).toBe('RDS 다중 AZ 배포의 대기 인스턴스로 할 수 없는 작업은?')
    // q201은 출처에 구체적 사례가 없어 명사를 바꿀 수 없다. 사실을 지어내면 ADR-006·008·009 위반이다.
    expect(prompts.q201).toBe('여러 작업을 한꺼번에 모아서 처리하는 데 적합한 서비스는?')
    expect(prompts.q226).toBe('Web ACL과 네트워크 ACL의 역할을 올바르게 설명한 것은?')
  })

  it('phase 18이 제외했던 q114가 정답을 노출하지 않는 리드인을 받는다', () => {
    const question = questions.find(({ id }) => id === 'q114')

    expect(question?.prompt).toBe('Site-to-Site VPN은 인터넷에 암호화 터널을 구성하고, Direct Connect는 전용선을 설치한다. 이 둘의 공통 목적은?')
    expect(question?.prompt.length).toBeLessThanOrEqual(120)
    // 리드인에 온프레미스가 들어가면 오답 세 개가 한꺼번에 소거된다.
    expect(question?.prompt).not.toContain('온프레미스')
    question?.choices.forEach((choice) => {
      expect(question.prompt).not.toContain(choice)
    })
  })

  it('개념 본문이 Lambda가 하는 일과 비용 할당 태그가 무엇인지 알려준다', () => {
    const concepts = topics.flatMap((topic) => topic.concepts)
    const lambda = concepts.find(({ id }) => id === 'lambda.lambda')
    const tag = concepts.find(({ id }) => id === 'cost-management.cost-allocation-tag-activation')

    expect(lambda?.paragraphs[0]).toContain('S3에 올라온 이미지를 리사이징하거나')
    expect(lambda?.paragraphs[0]).toContain('정해진 시각에 개발용 RDS를 켜고 끄는')
    expect(tag?.paragraphs[0]).toContain('리소스에 직접 붙이는 사용자 정의 태그로')
    expect(tag?.paragraphs[0]).toContain('부서별로 비용을 나눠 보는 데 쓴다')
  })

  it('개념 본문 보강이 요약과 문단 개수를 바꾸지 않는다', () => {
    const concepts = topics.flatMap((topic) => topic.concepts)
    const lambda = concepts.find(({ id }) => id === 'lambda.lambda')
    const tag = concepts.find(({ id }) => id === 'cost-management.cost-allocation-tag-activation')

    // ADR-010이 정한 편집 범위 — summary와 개념 구조는 건드리지 않는다.
    expect(lambda?.paragraphs).toHaveLength(3)
    expect(lambda?.summary).toBe('Lambda는 서버 운영을 AWS에 맡기고 개발자가 올린 코드만 실행하는 서비스다.')
    expect(tag?.paragraphs).toHaveLength(2)
    expect(tag?.summary).toBe('비용 할당 태그는 결제 콘솔에서 활성화해야 Cost Explorer에 보인다.')
  })

  it('오답만으로 소거되던 4문항이 정답과 같은 범주의 보기를 받는다', () => {
    const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

    expect(byId.q034.choices).toEqual(['KMS', 'SSE', 'CloudHSM', 'ACM'])
    expect(byId.q034.prompt).toBe('S3에 저장하는 파일은 암호화로 보호하며 이 과정에는 키가 필요하다. 이때 서버가 자체적으로 데이터를 암호화하는 방식을 무엇이라 하는가?')
    expect(byId.q075.choices).toEqual(['Sticky Session', '대상 추적 정책', '예약 인스턴스', '예약된 조정'])
    expect(byId.q098.choices).toEqual(['AWS Backup', 'RDS 자동 백업', 'EBS 스냅샷', 'S3 버전 관리'])
    expect(byId.q164.choices).toEqual(['AWS Budgets', 'Cost Explorer', '온디맨드 인스턴스', '절약 플랜'])
  })

  it('보기를 고친 4문항의 정답 위치와 프롬프트가 그대로 유지된다', () => {
    const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

    expect(byId.q034.answerIndex).toBe(1)
    expect(byId.q075.answerIndex).toBe(1)
    expect(byId.q098.answerIndex).toBe(0)
    expect(byId.q164.answerIndex).toBe(3)
    // 프롬프트가 보기를 꺼내면 오답이 소거된다.
    ;['q034', 'q075', 'q098', 'q164'].forEach((id) => {
      expect(byId[id].prompt.length).toBeLessThanOrEqual(120)
      byId[id].choices.forEach((choice) => {
        expect(byId[id].prompt).not.toContain(choice)
      })
    })
  })

  it('같은 범주 오답을 만들 수 없어 제외한 문항은 보기가 그대로다', () => {
    const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

    // 출처에 같은 범주의 대체 항목이 없거나, 넣으면 정답이 애매해지는 문항들이다.
    expect(byId.q083.choices).toEqual(['Lambda', 'ECS', 'Step Functions', 'API Gateway'])
    expect(byId.q085.choices).toEqual(['Sticky Session', '대상 추적', '엣지 최적화', '콜드 스타트'])
    expect(byId.q100.choices).toEqual(['인터넷 게이트웨이', 'VPC 피어링', '서브넷', 'PrivateLink'])
    expect(byId.q175.choices).toEqual(['클러스터 배치 그룹', 'EFS 수명 주기 관리', 'EBS Elastic Volumes', 'FSx for NetApp ONTAP'])
  })

  it('q034의 오답이 서버 측 암호화의 하위 방식이 아니다', () => {
    const question = questions.find(({ id }) => id === 'q034')
    const wrongChoices = question?.choices.filter((_, index) => index !== question.answerIndex) ?? []

    expect(wrongChoices).toHaveLength(3)
    // SSE-S3·SSE-KMS·SSE-C는 모두 서버 측 암호화라 오답이 될 수 없다.
    wrongChoices.forEach((choice) => {
      expect(choice.startsWith('SSE')).toBe(false)
    })
  })

  it('SQS 개념의 잘못된 표기가 바로잡혀 있다', () => {
    const concept = topics
      .flatMap((topic) => topic.concepts)
      .find(({ id }) => id === 'messaging-backup.sqs-details')

    expect(concept?.summary).toContain('중복과 순서 뒤바뀜이 생길 수 있다')
    expect(concept?.paragraphs[1]).toContain('순서가 바뀔 수 있다')
    expect(concept?.paragraphs[1]).toContain('(Exactly-Once)" 처리가')
  })

  it('TCP와 UDP 풀이가 이름과 계층뿐 아니라 둘의 차이까지 알려준다', () => {
    const concept = topics
      .flatMap((topic) => topic.concepts)
      .find(({ id }) => id === 'elastic-load-balancing.elb')

    expect(concept?.paragraphs[1]).toContain('빠진 것은 다시 보낸다')
    expect(concept?.paragraphs[1]).toContain('일부가 유실될 수 있다')
  })

  it('CloudFront와 Global Accelerator의 갈림길이 추상적인 대비 대신 구체적인 기준으로 쓰인다', () => {
    const concept = topics
      .flatMap((topic) => topic.concepts)
      .find(({ id }) => id === 'cloudfront-global-accelerator.global-accelerator-protocols')

    // "캐싱할 콘텐츠인가, 가속할 연결인가"는 두 말을 이미 아는 사람에게만 읽힌다.
    expect(concept?.paragraphs[1]).not.toContain('가속할 연결인가')
    expect(concept?.paragraphs[1]).toContain('미리 복사해 둘 이미지나 파일이 있느냐')
  })

  it('용어 풀이를 더해도 개념 요약과 문단 개수는 그대로다', () => {
    const byId = Object.fromEntries(
      topics.flatMap((topic) => topic.concepts).map((concept) => [concept.id, concept]),
    )

    // ADR-010이 정한 편집 범위 — paragraphs 안에서만 문장을 손본다.
    expect(byId['elastic-load-balancing.elb'].paragraphs).toHaveLength(3)
    expect(byId['elastic-load-balancing.sticky-session-tradeoff'].paragraphs).toHaveLength(2)
    expect(byId['cloudfront-global-accelerator.global-accelerator-protocols'].paragraphs).toHaveLength(2)
    expect(byId['cloudfront-global-accelerator.cloudfront-ttl'].paragraphs).toHaveLength(2)
    expect(byId['cloudfront-global-accelerator.cloudfront-ttl'].summary).toBe(
      'TTL이 만료되기 전에는 원본이 바뀌어도 엣지가 옛 파일을 계속 내보낸다.',
    )
  })

  // ADR-015 — 해설에 나오는 약어와 괄호로 붙일 풀네임.
  // AWS·DB·CPU·MB·KB·IP처럼 상식으로 통하는 약어와, API·URL·SSD처럼 제품이나 유형
  // 이름의 일부로만 쓰이는 약어는 대상이 아니다.
  const acronymFullNames: Record<string, string> = {
    S3: 'Simple Storage Service',
    EC2: 'Elastic Compute Cloud',
    RDS: 'Relational Database Service',
    KMS: 'Key Management Service',
    WAF: 'Web Application Firewall',
    NACL: 'Network Access Control List',
    ACL: 'Access Control List',
    IAM: 'Identity And Access Management',
    EBS: 'Elastic Block Store',
    EFS: 'Elastic File System',
    FSx: 'File System for Extended use',
    SQS: 'Simple Queue Service',
    SNS: 'Simple Notification Service',
    SES: 'Simple Email Service',
    DNS: 'Domain Name System',
    ACM: 'AWS Certificate Manager',
    ELB: 'Elastic Load Balancer',
    ALB: 'Application Load Balancer',
    NLB: 'Network Load Balancer',
    GLB: 'Gateway Load Balancer',
    DDoS: 'Distributed Denial of Service',
    DRT: 'DDoS Response Team',
    STS: 'Security Token Service',
    SSE: 'Server Side Encryption',
    JWT: 'JSON Web Token',
    DAX: 'DynamoDB Accelerator',
    PITR: 'Point-in-Time Recovery',
    CDN: 'Content Delivery Network',
    EMR: 'Elastic MapReduce',
    XSS: 'Cross-Site Scripting',
    MFA: 'Multi-Factor Authentication',
    TTL: 'Time-to-Live',
    EKS: 'Elastic Kubernetes Service',
    MSK: 'Managed Streaming for Apache Kafka',
    CVE: 'Common Vulnerabilities and Exposures',
    NFS: 'Network File System',
    AZ: 'Availability Zone',
    IA: 'Infrequent Access',
    FTP: 'File Transfer Protocol',
    SFTP: 'SSH File Transfer Protocol',
    FTPS: 'File Transfer Protocol Secure',
    HTTP: 'HyperText Transfer Protocol',
    HTTPS: 'HyperText Transfer Protocol Secure',
    TCP: 'Transmission Control Protocol',
    UDP: 'User Datagram Protocol',
    SSL: 'Secure Sockets Layer',
    TLS: 'Transport Layer Security',
    VPN: 'Virtual Private Network',
    NAT: 'Network Address Translation',
    SMB: 'Server Message Block',
    SQL: 'Structured Query Language',
    RDBMS: 'Relational Database Management System',
    CIDR: 'Classless Inter-Domain Routing',
    REST: 'Representational State Transfer',
    FIFO: 'First In First Out',
    ETL: 'Extract, Transform, Load',
    IOPS: 'Input/Output Operations Per Second',
    HPC: 'High Performance Computing',
    VPC: 'Virtual Private Cloud',
    ECS: 'Elastic Container Service',
    OAC: 'Origin Access Control',
    SCP: 'Service Control Policy',
  }

  // 풀네임이 서로를 품는 묶음. 한 해설에서 먼저 나온 하나만 풀어야 되풀이가 생기지 않는다.
  const acronymFamilies = [
    ['HTTP', 'HTTPS'],
    ['FTP', 'SFTP', 'FTPS'],
  ]

  // 괄호 안에 든 약어는 이미 다른 풀이의 일부이므로 대상이 아니다.
  function usedOutsideParens(text: string, acronym: string) {
    const pattern = new RegExp(`(?<![A-Za-z0-9-])${acronym}(?![A-Za-z0-9-])`, 'g')

    return [...text.matchAll(pattern)].some(({ index }) => {
      const before = text.slice(0, index)

      return before.split('(').length === before.split(')').length
    })
  }

  it('해설에 나오는 약어가 풀네임을 괄호로 달고 나온다', () => {
    const singles = Object.keys(acronymFullNames)
      .filter((acronym) => !acronymFamilies.some((family) => family.includes(acronym)))
      .map((acronym) => [acronym])
    const groups = [...acronymFamilies, ...singles]

    questions.forEach((question) => {
      groups.forEach((family) => {
        if (!family.some((acronym) => usedOutsideParens(question.explanation, acronym))) return

        const glossed = family.some((acronym) =>
          question.explanation.includes(`${acronym}(${acronymFullNames[acronym]})`),
        )

        expect(glossed ? '' : `${question.id}에 ${family.join('/')} 풀이 없음`).toBe('')
      })
    })
  })

  it('한 해설에서 같은 약어를 두 번 풀지 않는다', () => {
    questions.forEach((question) => {
      Object.entries(acronymFullNames).forEach(([acronym, fullName]) => {
        const gloss = `${acronym}(${fullName})`

        expect(question.explanation.split(gloss).length - 1).toBeLessThanOrEqual(1)
      })
    })
  })

  it('상식으로 통하는 약어와 제품 이름 속 약어는 해설에서 풀지 않는다', () => {
    const allExplanations = questions.map(({ explanation }) => explanation).join(' ')

    const outOfScope = [
      'Amazon Web Services',
      'Central Processing Unit',
      'Internet Protocol',
      'Uniform Resource Locator',
      'Solid State Drive',
    ]

    outOfScope.forEach((fullName) => {
      expect(allExplanations).not.toContain(fullName)
    })
  })

  it('풀이가 그 약어의 첫 등장 자리에 붙는다', () => {
    const byId = Object.fromEntries(questions.map((question) => [question.id, question]))

    expect(byId.q130.explanation).toBe(
      'NACL(Network Access Control List)은 서브넷에 대해 트래픽을 허용하거나 거부한다. 보안 그룹은 AWS 리소스의 트래픽을 제어한다.',
    )
    expect(byId.q080.explanation).toBe(
      'NLB(Network Load Balancer)는 TCP(Transmission Control Protocol)와 UDP(User Datagram Protocol) 트래픽을 모두 처리하며 빠른 응답 속도를 제공한다. ALB(Application Load Balancer)는 HTTP(HyperText Transfer Protocol)와 HTTPS에 사용하고 GLB(Gateway Load Balancer)는 보안 장비용이다.',
    )
  })

  // ADR-019. 표기와 배치의 근거는 docs/source/service-categories.md 하나뿐이다.
  const categories = {
    compute: '컴퓨팅(Compute)',
    containers: '컨테이너(Containers)',
    storage: '스토리지(Storage)',
    databases: '데이터베이스(Databases)',
    analytics: '분석(Analytics)',
    networking: '네트워킹 및 콘텐츠 전송(Networking and Content Delivery)',
    appIntegration: '애플리케이션 통합(Application Integration)',
    management: '관리 및 거버넌스(Management and Governance)',
    security: '보안·자격 증명·규정 준수(Security, Identity, and Compliance)',
    migration: '마이그레이션 및 전송(Migration and Transfer)',
    finance: '클라우드 재무 관리(Cloud Financial Management)',
    devTools: '개발자 도구(Developer Tools)',
    business: '비즈니스 애플리케이션(Business Applications)',
    // ADR-022로 더한 둘. phase 26이 개념을 만들기 전까지는 아직 쓰이지 않는다.
    machineLearning: '기계 학습(Machine Learning and Artificial Intelligence)',
    frontend: '프런트엔드 웹 및 모바일(Front-end Web and Mobile)',
  } as const

  // 절약 플랜만 서술이 다르다. 백서가 서비스가 아니라 pricing model로 소개하기 때문이다.
  const predicateExceptions: Record<string, string> = {
    'cost-management.savings-plan': '쪽에 속한다',
  }

  const serviceCategories: Array<[string, string, keyof typeof categories]> = [
    ['aws-core-services.ec2', 'EC2는', 'compute'],
    ['aws-core-services.rds', 'RDS는', 'databases'],
    ['aws-core-services.s3', 'S3는', 'storage'],
    ['aws-core-services.route-53', 'Route 53은', 'networking'],
    ['aws-core-services.elb', 'ELB는', 'networking'],
    ['aws-core-services.cloudfront', 'CloudFront는', 'networking'],
    ['aws-core-services.lambda', 'Lambda는', 'compute'],
    ['ebs-instance-store.ebs', 'EBS는', 'storage'],
    ['efs-fsx.efs', 'EFS는', 'storage'],
    ['efs-fsx.fsx', 'FSx는', 'storage'],
    ['data-transfer-services.datasync', 'DataSync는', 'migration'],
    ['data-transfer-services.snowball-edge', 'Snowball Edge는', 'migration'],
    ['data-transfer-services.transfer-family', 'Transfer Family는', 'migration'],
    ['storage-gateway-migration.storage-gateway', 'Storage Gateway는', 'storage'],
    // phase 26 step 5. DMS와 SCT는 한 개념이 둘을 함께 소개하므로 주어도 함께 적는다.
    ['storage-gateway-migration.dms-sct', 'DMS와 SCT는', 'migration'],
    ['storage-gateway-migration.application-migration-service', 'Application Migration Service는', 'migration'],
    ['rds-storage-features.rds', 'RDS는', 'databases'],
    ['aurora.aurora', 'Aurora는', 'databases'],
    ['dynamodb.dynamodb', 'DynamoDB는', 'databases'],
    ['elasticache-purpose-built-db.elasticache', 'ElastiCache는', 'databases'],
    ['elasticache-purpose-built-db.documentdb', 'DocumentDB는', 'databases'],
    // phase 26 step 7. QLDB는 백서에도 보조 출처에도 카테고리가 없어 붙이지 않는다
    // (docs/source/service-categories.md "카테고리 없음").
    ['elasticache-purpose-built-db.neptune', 'Neptune은', 'databases'],
    ['elasticache-purpose-built-db.timestream', 'Timestream은', 'databases'],
    ['ec2-autoscaling.ec2', 'EC2는', 'compute'],
    // phase 26 step 8. GWLB는 ELB 계열의 한 종류라 별도 항목이 아니고,
    // ASG 개념들은 서비스를 소개하는 자리가 아니라 갈림길·한계 개념이라 붙이지 않는다
    // (docs/source/service-categories.md "카테고리 문장을 붙이지 않는 개념").
    ['ec2-autoscaling.ec2-image-builder', 'EC2 Image Builder는', 'compute'],
    ['elastic-load-balancing.elb', 'ELB는', 'networking'],
    ['cloudfront-global-accelerator.cloudfront', 'CloudFront는', 'networking'],
    ['cloudfront-global-accelerator.global-accelerator', 'Global Accelerator는', 'networking'],
    // phase 26 step 10이 Lambda를 자기 주제로 빼냈다. 신규 15개념은 전부 Lambda의
    // 기능·설정·한계·갈림길이라 카테고리 한 줄을 붙이지 않는다
    // (docs/source/service-categories.md "카테고리 문장을 붙이지 않는 개념").
    ['lambda.lambda', 'Lambda는', 'compute'],
    // phase 26 step 11이 serverless-containers를 둘로 갈랐다. 신규 34개념 중 셋만
    // 서비스를 소개하는 자리이고, 나머지는 ECS·EKS·Fargate·API Gateway·Step Functions의
    // 기능·설정·한계·갈림길이라 카테고리 한 줄을 붙이지 않는다
    // (docs/source/service-categories.md "카테고리 문장을 붙이지 않는 개념").
    ['ecs-eks-fargate.ecs', 'ECS는', 'containers'],
    ['ecs-eks-fargate.eks', 'EKS는', 'containers'],
    ['ecs-eks-fargate.ecr-image-scan-on-push', 'ECR은', 'containers'],
    ['ecs-eks-fargate.aws-batch', 'AWS Batch는', 'compute'],
    // 백서 카테고리가 이 앱의 주제 배치와 갈리는 자리다. 주제는 옮기지 않고
    // 카테고리만 밝힌다(service-categories.md "주제 배치와 어긋나는 자리").
    ['ecs-eks-fargate.elastic-beanstalk', 'Elastic Beanstalk는', 'compute'],
    ['ecs-eks-fargate.app2container', 'App2Container는', 'containers'],
    ['api-gateway-step-functions.api-gateway', 'API Gateway는', 'networking'],
    ['api-gateway-step-functions.step-functions', 'Step Functions는', 'appIntegration'],
    ['messaging-backup.sqs', 'SQS는', 'appIntegration'],
    ['messaging-backup.sns', 'SNS는', 'appIntegration'],
    ['messaging-backup.eventbridge', 'EventBridge는', 'appIntegration'],
    ['messaging-backup.backup', 'AWS Backup은', 'storage'],
    ['messaging-backup.msk', 'MSK는', 'analytics'],
    ['messaging-backup.ses', 'SES는', 'business'],
    ['vpc-networking.vpc-subnet', 'VPC는', 'networking'],
    ['vpc-networking.privatelink', 'PrivateLink는', 'networking'],
    ['hybrid-connectivity.site-to-site-vpn', 'Site-to-Site VPN은', 'networking'],
    ['hybrid-connectivity.direct-connect', 'Direct Connect는', 'networking'],
    ['hybrid-connectivity.transit-gateway', 'Transit Gateway는', 'networking'],
    ['hybrid-connectivity.client-vpn', 'Client VPN은', 'networking'],
    ['route53.route53', 'Route53은', 'networking'],
    ['analytics-monitoring.emr', 'EMR은', 'analytics'],
    ['analytics-monitoring.redshift', 'RedShift는', 'analytics'],
    ['analytics-monitoring.athena', 'Athena는', 'analytics'],
    ['analytics-monitoring.cloudwatch', 'CloudWatch는', 'management'],
    ['analytics-monitoring.glue', 'Glue는', 'analytics'],
    ['analytics-monitoring.x-ray', 'X-Ray는', 'devTools'],
    ['analytics-monitoring.data-firehose', 'Data Firehose는', 'analytics'],
    ['analytics-monitoring.kinesis-data-streams', 'Kinesis Data Streams는', 'analytics'],
    ['analytics-monitoring.managed-service-apache-flink', 'Managed Service for Apache Flink는', 'analytics'],
    ['secrets-encryption.secrets-manager', 'Secrets Manager는', 'security'],
    ['secrets-encryption.parameter-store', 'Parameter Store는', 'management'],
    ['secrets-encryption.kms', 'KMS는', 'security'],
    ['secrets-encryption.acm', 'ACM은', 'security'],
    ['secrets-encryption.cloudhsm', 'CloudHSM은', 'security'],
    ['threat-protection.waf', 'WAF는', 'security'],
    ['threat-protection.shield', 'Shield는', 'security'],
    ['threat-protection.guardduty', 'GuardDuty는', 'security'],
    ['threat-protection.macie', 'Macie는', 'security'],
    ['threat-protection.cloudfront', 'CloudFront는', 'networking'],
    ['identity-access.iam', 'IAM은', 'security'],
    ['identity-access.identity-center', 'Identity Center는', 'security'],
    ['identity-access.sts', 'STS는', 'security'],
    ['identity-access.cognito', 'Cognito는', 'security'],
    ['identity-access.cloudtrail', 'CloudTrail은', 'management'],
    ['identity-access.aws-config', 'AWS Config는', 'management'],
    ['identity-access.organizations-scp', 'AWS Organizations는', 'management'],
    ['cost-management.savings-plan', '절약 플랜은', 'finance'],
    ['cost-management.aws-budgets', 'AWS Budgets는', 'finance'],
    ['cost-management.cost-explorer', 'Cost Explorer는', 'finance'],
    ['cost-management.billing-and-cost-management', 'Billing and Cost Management는', 'finance'],
    ['cost-management.trusted-advisor', 'Trusted Advisor는', 'management'],
    ['cost-management.compute-optimizer', 'Compute Optimizer는', 'management'],
    ['cost-management.cost-anomaly-detection', 'Cost Anomaly Detection은', 'finance'],
  ]

  it('서비스 개념 83개가 AWS 공식 카테고리 한 줄로 시작한다', () => {
    const byConceptId = Object.fromEntries(
      topics.flatMap((topic) => topic.concepts).map((concept) => [concept.id, concept]),
    )

    expect(serviceCategories).toHaveLength(83)

    serviceCategories.forEach(([conceptId, subject, key]) => {
      const concept = byConceptId[conceptId]
      const predicate = predicateExceptions[conceptId] ?? '쪽 서비스다'

      expect(concept).toBeDefined()
      expect(concept.paragraphs[0]).toContain(
        `${subject} AWS 분류로는 ${categories[key]} ${predicate}.`,
      )
      expect(concept.paragraphs[0].startsWith(`${subject} AWS 분류로는`)).toBe(true)
    })
  })

  it('카테고리 문장이 그 83개 개념의 본문에만 한 번씩 들어간다', () => {
    const concepts = topics.flatMap((topic) => topic.concepts)
    const marker = 'AWS 분류로는'
    const holders = concepts.filter((concept) =>
      concept.paragraphs.some((paragraph) => paragraph.includes(marker)),
    )

    expect(holders.map(({ id }) => id).sort()).toEqual(
      serviceCategories.map(([conceptId]) => conceptId).sort(),
    )

    holders.forEach((concept) => {
      const carrying = concept.paragraphs.filter((paragraph) => paragraph.includes(marker))
      expect(carrying).toHaveLength(1)
    })

    concepts.forEach((concept) => {
      expect(concept.summary).not.toContain(marker)
      expect(concept.name).not.toContain(marker)
    })
  })

  it('카테고리 표기가 백서의 15종을 벗어나지 않는다', () => {
    const declared = Object.values(categories)
    const used = new Set(serviceCategories.map(([, , key]) => categories[key]))

    // ADR-022. 선언한 15종 밖의 표기를 쓰지 않는지만 본다. 등식이 아닌 이유는
    // 기계 학습·프런트엔드 웹 및 모바일이 아직 어느 개념에도 쓰이지 않아서다.
    expect(declared).toHaveLength(15)
    used.forEach((name) => expect(declared).toContain(name))
  })

  it('카테고리 문장이 문항 프롬프트나 해설로 새지 않는다', () => {
    questions.forEach((question) => {
      expect(question.prompt).not.toContain('AWS 분류로는')
      expect(question.explanation).not.toContain('AWS 분류로는')
    })
  })
})
