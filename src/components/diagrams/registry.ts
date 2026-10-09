import type { ComponentType } from 'react'
import { BackupFlowDiagram } from './BackupFlowDiagram'
import { BackupPolicyScopeTable, CopyDestinationTable, Ec2AssignmentTable } from './backupTables'
import { ControlTimingDiagram } from './ControlTimingDiagram'
import { DrChoiceDiagram } from './DrChoiceDiagram'
import { DriftScopeDiagram } from './DriftScopeDiagram'
import { EdgeToOriginDiagram } from './EdgeToOriginDiagram'
import { EventBridgeRoutingDiagram } from './EventBridgeRoutingDiagram'
import { GovernanceToolTable } from './governanceTables'
import { HybridPathsDiagram } from './HybridPathsDiagram'
import { MessagingShapesDiagram } from './MessagingShapesDiagram'
import { NatCountDiagram } from './NatCountDiagram'
import { OrgScpScopeDiagram } from './OrgScpScopeDiagram'
import { PeeringScaleDiagram } from './PeeringScaleDiagram'
import { Route53AliasDiagram } from './Route53AliasDiagram'
import { Route53HealthDiagram } from './Route53HealthDiagram'
import { Route53HybridDnsDiagram } from './Route53HybridDnsDiagram'
import { Route53PolicyTable } from './route53Tables'
import { S3ClassMapDiagram } from './S3ClassMapDiagram'
import { SgNaclBoundaryDiagram } from './SgNaclBoundaryDiagram'
import { SgNaclLayersDiagram } from './SgNaclLayersDiagram'
import { SgNaclCompareTable } from './sgNaclTables'
import { SnsFanoutDiagram } from './SnsFanoutDiagram'
import { SqsMessageLifeDiagram } from './SqsMessageLifeDiagram'
import { VpcDestinationDiagram } from './VpcDestinationDiagram'
import { VpcPathsDiagram } from './VpcPathsDiagram'
import { VpcScopeDiagram } from './VpcScopeDiagram'
import {
  AttachTargetsTable,
  EndpointTypesTable,
  FlowLogsVsCloudTrailTable,
  NatInstanceVsGatewayTable,
  PrivateConnectivityTable,
} from './vpcTables'

// 개념 id → 그 개념 본문 바로 뒤에 붙는 도식.
// step 1~5가 여기에 한 줄씩 더한다.
export const diagramsByConceptId: Record<string, ComponentType | ComponentType[]> = {
  'backup-disaster-recovery.backup-audit-manager': BackupFlowDiagram,
  'backup-disaster-recovery.backup-ec2-resource-assignment': Ec2AssignmentTable,
  'backup-disaster-recovery.organizations-backup-policy': BackupPolicyScopeTable,
  'backup-disaster-recovery.backup-cross-account-copy': CopyDestinationTable,
  'backup-disaster-recovery.elastic-disaster-recovery': DrChoiceDiagram,
  'vpc-networking.comparison': [VpcPathsDiagram, VpcDestinationDiagram],
  'vpc-networking.internet-gateway-is-not-per-az': VpcScopeDiagram,
  'vpc-networking.nat-gateway-count-by-environment': NatCountDiagram,
  'vpc-networking.vpc-peering-scaling-limit': PeeringScaleDiagram,
  'vpc-networking.s3-is-regional': AttachTargetsTable,
  'vpc-networking.endpoint-pricing': EndpointTypesTable,
  'vpc-networking.nat-instance': NatInstanceVsGatewayTable,
  'vpc-networking.privatelink-endpoint-service': PrivateConnectivityTable,
  'vpc-networking.vpc-flow-logs': FlowLogsVsCloudTrailTable,
  'governance-iac.cloudformation': GovernanceToolTable,
  'governance-iac.cloudformation-drift-detection': DriftScopeDiagram,
  'governance-iac.control-tower-controls': ControlTimingDiagram,
  'hybrid-connectivity.vpn-vs-direct-connect': HybridPathsDiagram,
  'organizations-cloudtrail-config.scp-attachment-targets': OrgScpScopeDiagram,
  'route53.routing-policies': Route53PolicyTable,
  'route53.multivalue-answer-details': Route53HealthDiagram,
  'route53.route53-alias-record': Route53AliasDiagram,
  'route53.private-hosted-zone-vpc-only': Route53HybridDnsDiagram,
  'cloudfront-global-accelerator.global-accelerator-vs-dns-failover': EdgeToOriginDiagram,
  's3-storage-classes.s3-storage-class-cost-order': S3ClassMapDiagram,
  'security-groups-nacl.security-group-stateful-vs-nacl-stateless': [SgNaclBoundaryDiagram, SgNaclCompareTable],
  'security-groups-nacl.web-acl-vs-nacl': SgNaclLayersDiagram,
  'sqs-sns-eventbridge.sqs': MessagingShapesDiagram,
  'sqs-sns-eventbridge.eventbridge': EventBridgeRoutingDiagram,
  'sqs-sns-eventbridge.sns-sqs-fanout-per-consumer': SnsFanoutDiagram,
  'sqs-sns-eventbridge.sqs-visibility-timeout-vs-processing-time': SqsMessageLifeDiagram,
}
