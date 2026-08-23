import { describe, expect, it } from 'vitest'

import { questions, topics } from './index'

describe('학습 데이터 무결성', () => {
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

  it('보충 개념 추가 후에도 22개 주제의 메타데이터가 그대로다', () => {
    expect(topics.map(({ id, title, importance, sourcePages }) => ({
      id,
      title,
      importance,
      sourcePages,
    }))).toEqual([
      { id: 'aws-core-services', title: 'AWS 핵심 서비스 개요 — EC2·RDS·S3·Route 53·ELB·CloudFront·Lambda', importance: 0, sourcePages: [1, 4] },
      { id: 'region-availability', title: '리전·가용성·가용 영역·다중 AZ', importance: 0, sourcePages: [5, 6] },
      { id: 'onpremise-migration', title: '온프레미스와 마이그레이션', importance: 0, sourcePages: [7, 7] },
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
    const addedQuestions = questions.slice(116)

    expect(addedQuestions).toHaveLength(53)
    expect(addedQuestions.map(({ id }) => id)).toEqual(
      Array.from({ length: 53 }, (_, index) => `q${String(index + 117).padStart(3, '0')}`),
    )
    expect(addedQuestions.map(({ topicId }) => topicId)).toEqual(expectedTopics)
  })

  it('보안·운영 주제 문제의 정답 위치와 문구가 출제 규칙을 따른다', () => {
    const addedQuestions = questions.slice(116)
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

  it('보안·운영 데이터 주제가 지정된 순서와 메타데이터로 추가된다', () => {
    expect(topics.slice(15, 22).map(({ id, title, importance, sourcePages }) => ({
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
    expect(topics.slice(15, 22).map((topic) => topic.concepts.length)).toEqual([
      3, 12, 2, 5, 5, 6, 5,
    ])
  })

  it('네트워크 데이터 주제가 지정된 순서와 메타데이터로 추가된다', () => {
    expect(topics.slice(8, 15).map(({ id, title, importance, sourcePages }) => ({
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
    expect(topics.slice(8, 15).map((topic) => topic.concepts.length)).toEqual([
      7, 8, 11, 11, 11, 7, 4,
    ])
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
