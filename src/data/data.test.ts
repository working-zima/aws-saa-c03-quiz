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
      'compute-delivery': [
        'warm-pool',
        'scheduled-scaling',
        'alb-l7-vs-nlb-l4',
        'sticky-session-tradeoff',
        'global-accelerator-protocols',
        'cloudfront-ttl',
        'edge-keyword',
      ],
      'serverless-containers': [
        'eks',
        'fargate-no-time-limit',
        'lambda-function-url',
        'lambda-at-edge',
        'lambda-vpc-access',
        'api-gateway-jwt-authorizer',
        'aws-batch',
      ],
      'messaging-backup': [
        'msk',
        'sqs-details',
        'sqs-queue-depth-scaling',
        'eventbridge-scheduler',
        'step-functions-features',
        'ses',
        'backup-long-term-retention',
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

  it('데이터베이스 보충 개념 9개가 지정된 주제의 개념 배열 끝에 추가된다', () => {
    const expectedSlugs: Record<string, string[]> = {
      'rds-storage-features': [
        'storage-type-names',
        'multi-az-standby-limits',
        'automated-backup-retention',
        'connection-issue-heuristic',
      ],
      'aurora-dynamodb-cache': [
        'aurora-serverless-v2',
        'aurora-reader-endpoint',
        'documentdb',
        'dynamodb-pitr',
        'dax-dynamodb-only',
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

  it('보충 개념 9개가 지정된 주제의 개념 배열 끝에 추가된다', () => {
    const expectedSlugs: Record<string, string[]> = {
      'aws-core-services': ['exam-heuristics'],
      's3-versioning-lifecycle': ['object-lock-prerequisites', 'event-notification'],
      's3-encryption-batch': ['envelope-encryption', 'sse-kms-cost'],
      'block-file-storage': [
        'cluster-placement-group',
        'ebs-elastic-volumes',
        'efs-lifecycle-management',
        'fsx-ontap-multi-az',
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

  it('보충 개념 추가 후에도 20개 주제의 메타데이터가 그대로다', () => {
    expect(topics.map(({ id, title, importance, sourcePages }) => ({
      id,
      title,
      importance,
      sourcePages,
    }))).toEqual([
      { id: 'aws-core-services', title: 'AWS 핵심 서비스·리전·가용 영역·온프레미스', importance: 0, sourcePages: [1, 7] },
      { id: 's3-storage-classes', title: 'S3 스토리지 클래스 유형', importance: 3, sourcePages: [8, 9] },
      { id: 's3-versioning-lifecycle', title: 'S3 버전 관리·객체 잠금·수명 주기 정책', importance: 3, sourcePages: [10, 12] },
      { id: 's3-encryption-batch', title: 'S3 암호화(SSE)·S3 Batch Operations', importance: 2, sourcePages: [13, 13] },
      { id: 'block-file-storage', title: 'EBS·EFS·FSx·인스턴스 스토어', importance: 3, sourcePages: [14, 15] },
      { id: 'data-transfer-services', title: 'DataSync·Snowball Edge·Transfer Family·Storage Gateway', importance: 3, sourcePages: [16, 18] },
      { id: 'rds-storage-features', title: 'RDS 스토리지 유형과 기능', importance: 3, sourcePages: [19, 20] },
      { id: 'aurora-dynamodb-cache', title: 'Aurora·DynamoDB·ElastiCache', importance: 3, sourcePages: [21, 21] },
      { id: 'compute-delivery', title: 'EC2·ELB·Global Accelerator·CloudFront', importance: 3, sourcePages: [22, 24] },
      { id: 'serverless-containers', title: 'ECS·Lambda·Step Functions·API Gateway', importance: 3, sourcePages: [25, 26] },
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
      'block-file-storage.cluster-placement-group',
      'block-file-storage.ebs-elastic-volumes',
      'block-file-storage.efs-lifecycle-management',
      'block-file-storage.fsx-ontap-multi-az',
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
      'block-file-storage',
      'block-file-storage',
      'block-file-storage',
      'block-file-storage',
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
      'aurora-dynamodb-cache.aurora-serverless-v2',
      'aurora-dynamodb-cache.aurora-reader-endpoint',
      'aurora-dynamodb-cache.documentdb',
      'aurora-dynamodb-cache.dynamodb-pitr',
      'aurora-dynamodb-cache.dax-dynamodb-only',
    ]

    expect(addedQuestions).toHaveLength(9)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 9 }, (_, index) => `q${index + 179}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(4).fill('rds-storage-features'),
      ...Array(5).fill('aurora-dynamodb-cache'),
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
      'compute-delivery.warm-pool',
      'compute-delivery.scheduled-scaling',
      'compute-delivery.alb-l7-vs-nlb-l4',
      'compute-delivery.sticky-session-tradeoff',
      'compute-delivery.global-accelerator-protocols',
      'compute-delivery.cloudfront-ttl',
      'compute-delivery.edge-keyword',
      'serverless-containers.eks',
      'serverless-containers.fargate-no-time-limit',
      'serverless-containers.lambda-function-url',
      'serverless-containers.lambda-at-edge',
      'serverless-containers.lambda-vpc-access',
      'serverless-containers.api-gateway-jwt-authorizer',
      'serverless-containers.aws-batch',
      'messaging-backup.msk',
      'messaging-backup.sqs-details',
      'messaging-backup.sqs-queue-depth-scaling',
      'messaging-backup.eventbridge-scheduler',
      'messaging-backup.step-functions-features',
      'messaging-backup.ses',
      'messaging-backup.backup-long-term-retention',
    ]

    expect(addedQuestions).toHaveLength(21)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 21 }, (_, index) => `q${index + 188}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual([
      ...Array(7).fill('compute-delivery'),
      ...Array(7).fill('serverless-containers'),
      ...Array(7).fill('messaging-backup'),
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

  it('보안·운영 데이터 주제가 지정된 순서와 메타데이터로 추가된다', () => {
    expect(topics.slice(13, 20).map(({ id, title, importance, sourcePages }) => ({
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
    expect(topics.slice(13, 20).map((topic) => topic.concepts.length)).toEqual([
      5, 14, 5, 9, 11, 12, 9,
    ])
  })

  it('네트워크 데이터 주제가 지정된 순서와 메타데이터로 추가된다', () => {
    expect(topics.slice(6, 13).map(({ id, title, importance, sourcePages }) => ({
      id,
      title,
      importance,
      sourcePages,
    }))).toEqual([
      { id: 'rds-storage-features', title: 'RDS 스토리지 유형과 기능', importance: 3, sourcePages: [19, 20] },
      { id: 'aurora-dynamodb-cache', title: 'Aurora·DynamoDB·ElastiCache', importance: 3, sourcePages: [21, 21] },
      { id: 'compute-delivery', title: 'EC2·ELB·Global Accelerator·CloudFront', importance: 3, sourcePages: [22, 24] },
      { id: 'serverless-containers', title: 'ECS·Lambda·Step Functions·API Gateway', importance: 3, sourcePages: [25, 26] },
      { id: 'messaging-backup', title: 'SQS·SNS·EventBridge·AWS Backup', importance: 3, sourcePages: [27, 29] },
      { id: 'vpc-networking', title: 'VPC·서브넷·인터넷/NAT 게이트웨이·VPC Endpoint·PrivateLink·피어링', importance: 3, sourcePages: [30, 33] },
      { id: 'hybrid-connectivity', title: 'Site-to-Site VPN·Direct Connect·Transit Gateway', importance: 3, sourcePages: [34, 35] },
    ])
  })

  it('네트워크 데이터 주제는 원본 항목 수만큼 개념을 가진다', () => {
    expect(topics.slice(6, 13).map((topic) => topic.concepts.length)).toEqual([
      7, 8, 11, 11, 11, 12, 10,
    ])
  })

  it('S3 스토리지 클래스 주제가 클래스별 개념 7개와 정리 개념 2개로 나뉜다', () => {
    const topic = topics.find((candidate) => candidate.id === 's3-storage-classes')

    expect(topic?.concepts.map((concept) => concept.id)).toEqual([
      's3-storage-classes.standard',
      's3-storage-classes.intelligent-tiering',
      's3-storage-classes.standard-ia',
      's3-storage-classes.one-zone-ia',
      's3-storage-classes.glacier-instant-retrieval',
      's3-storage-classes.glacier-flexible-retrieval',
      's3-storage-classes.glacier-deep-archive',
      's3-storage-classes.retrieval-time',
      's3-storage-classes.glacier-or-standard-ia',
    ])
    expect(topic?.concepts.map((concept) => concept.name)).toEqual([
      'S3 Standard',
      'S3 Intelligent-Tiering',
      'S3 Standard-IA (Infrequent Access)',
      'S3 One Zone-IA',
      'S3 Glacier Instant Retrieval',
      'S3 Glacier Flexible Retrieval',
      'S3 Glacier Deep Archive',
      '즉시 조회와 대기 조회',
      'Glacier와 Standard-IA 중 고르기',
    ])
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
    { conceptId: 'block-file-storage.efs', anchor: 'Network File System' },
    { conceptId: 'data-transfer-services.transfer-family', anchor: 'File Transfer Protocol' },
    { conceptId: 'aurora-dynamodb-cache.dynamodb', anchor: '키-값' },
    { conceptId: 'aurora-dynamodb-cache.dynamodb', anchor: '미리 담아 두었다가' },
    { conceptId: 'aurora-dynamodb-cache.aurora-reader-endpoint', anchor: '애플리케이션이 접속할 주소' },
    { conceptId: 'compute-delivery.elb', anchor: '실어 나를지 정하는' },
    { conceptId: 'serverless-containers.api-gateway', anchor: 'JSON Web Token' },
    { conceptId: 'threat-protection.shield', anchor: 'Distributed Denial of Service' },
    { conceptId: 'threat-protection.shield-advanced-drt', anchor: 'DDoS Response Team' },
    { conceptId: 'threat-protection.waf', anchor: 'Cross-Site Scripting' },
    { conceptId: 'threat-protection.security-service-lineup', anchor: 'Common Vulnerabilities' },
    { conceptId: 'secrets-encryption.acm', anchor: 'SSL의 후속' },
  ]

  it('풀이 없이 쓰이던 일반 IT 용어 13종이 첫 등장 개념에서 한 번씩 풀린다', () => {
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
      .find(({ id }) => id === 'data-transfer-services.storage-gateway')

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
})
