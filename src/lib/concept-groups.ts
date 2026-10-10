import type { Concept, ConceptGroup, Topic } from '../types/content'

export function groupConcepts(concepts: Concept[]): ConceptGroup[] {
  const groups: ConceptGroup[] = []

  for (const concept of concepts) {
    const previous = groups[groups.length - 1]
    if (
      previous &&
      previous.concept.parentId === undefined &&
      concept.parentId === previous.concept.id
    ) {
      previous.children.push(concept)
    } else {
      // 잘못된 참조도 순서를 옮기지 않고 평평하게 둔다.
      groups.push({ concept, children: [] })
    }
  }

  return groups
}

export function hierarchyProblems(topic: Topic): string[] {
  const problems: string[] = []
  const byId = new Map(topic.concepts.map((concept, index) => [concept.id, { concept, index }]))

  topic.concepts.forEach((concept, index) => {
    const parentId = concept.parentId
    if (parentId === undefined) return

    if (parentId === concept.id) {
      problems.push(`${concept.id}: parentId가 자기 자신을 가리킨다.`)
    }

    const parent = byId.get(parentId)
    if (!parent) {
      problems.push(`${concept.id}: 머리 개념 ${parentId}가 같은 주제에 없다.`)
      return
    }

    if (parent.concept.parentId !== undefined) {
      problems.push(`${concept.id}: 머리 개념 ${parentId}에도 parentId가 있어 두 단을 넘는다.`)
    }

    if (
      parent.index >= index ||
      topic.concepts.slice(parent.index + 1, index).some((item) => item.parentId !== parentId)
    ) {
      problems.push(`${concept.id}: 머리 개념 ${parentId} 바로 뒤에 끊김 없이 이어지지 않는다.`)
    }
  })

  return problems
}
