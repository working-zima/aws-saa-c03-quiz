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
})
