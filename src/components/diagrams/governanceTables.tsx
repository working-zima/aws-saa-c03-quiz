import { visualsByTopicId } from '../../data'
import { ComparisonTableFigure } from './ComparisonTableFigure'

const tables = visualsByTopicId['governance-iac'].tables

export function GovernanceToolTable() {
  return <ComparisonTableFigure table={tables['tool-choice']} />
}
