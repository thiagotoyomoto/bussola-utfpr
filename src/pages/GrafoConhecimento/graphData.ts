import type { GraphEdge, GraphNode } from 'reagraph'

export type AvailabilityStatus = 'available' | 'unavailable' | 'unconfirmed'

export type GraphNodeKind =
  | 'institution'
  | 'department'
  | 'period'
  | 'discipline'
  | 'faculty'
  | 'area'
  | 'topic'
  | 'availability'

export interface GraphTopic {
  id: string
  title: string
  description: string
  areas: string[]
}

export interface GraphFaculty {
  id: string
  name: string
  qualification: string
  availability: AvailabilityStatus
  areas: string[]
  topics: GraphTopic[]
}

export interface ReagraphNode extends GraphNode {
  fill: string
  data: { kind: GraphNodeKind }
}

export type ReagraphEdge = GraphEdge

const graphColors: Record<GraphNodeKind, string> = {
  institution: '#321e4b',
  department: '#563777',
  period: '#755493',
  discipline: '#9472b2',
  faculty: '#321e4b',
  area: '#d8c3f4',
  topic: '#ffd54f',
  availability: '#d8efcf',
}

export const GRAPH_NODE_POSITIONS: Record<GraphNodeKind, { x: number; y: number }> = {
  institution: { x: -450, y: 80 },
  department: { x: -220, y: 80 },
  period: { x: -220, y: -200 },
  discipline: { x: 210, y: 180 },
  faculty: { x: 0, y: 50 },
  area: { x: 450, y: 180 },
  topic: { x: 0, y: -20 },
  availability: { x: 450, y: -180 },
}

export const graphFaculty: GraphFaculty[] = [
  {
    id: 'ana-beatriz',
    name: 'Ana Beatriz',
    qualification: 'Doutora em Metodologia de Pesquisa Aplicada',
    availability: 'available',
    areas: ['Metodologia de Pesquisa', 'Pesquisa Digital'],
    topics: [
      {
        id: 'discurso-redes',
        title: 'Análise de Discurso em Redes Sociais',
        description:
          'Investigue como narrativas, identidades e sentidos são construídos em publicações e interações nas redes sociais.',
        areas: ['Metodologia de Pesquisa'],
      },
      {
        id: 'metodologia-qualitativa',
        title: 'Metodologia de Pesquisa Qualitativa',
        description:
          'Explore estratégias de coleta e interpretação de dados para compreender experiências e contextos sociais.',
        areas: ['Metodologia de Pesquisa'],
      },
      {
        id: 'etnografia-digital',
        title: 'Etnografia Digital',
        description:
          'Estude práticas e culturas de comunidades on-line com observação participante e registro de campo digital.',
        areas: ['Pesquisa Digital'],
      },
    ],
  },
  {
    id: 'marcos-oliveira',
    name: 'Marcos Oliveira',
    qualification: 'Doutor em Métodos Quantitativos',
    availability: 'unavailable',
    areas: ['Métodos Quantitativos', 'Dados Educacionais'],
    topics: [
      {
        id: 'dados-educacionais',
        title: 'Análise de Dados Educacionais',
        description:
          'Analise indicadores educacionais para identificar padrões e apoiar decisões acadêmicas.',
        areas: ['Métodos Quantitativos', 'Dados Educacionais'],
      },
    ],
  },
]

function createNode(
  id: string,
  label: string,
  kind: GraphNodeKind,
): ReagraphNode {
  return {
    id,
    label,
    fill: graphColors[kind],
    data: { kind },
  }
}

function createEdge(
  id: string,
  source: string,
  target: string,
  label: string,
): ReagraphEdge {
  return { id, source, target, label }
}

export function createReagraphData(faculties: GraphFaculty[]) {
  const facultyCountLabel =
    faculties.length === 1
      ? '1 docente encontrado'
      : `${faculties.length} docentes encontrados`
  const topicCount = faculties.reduce(
    (count, faculty) => count + faculty.topics.length,
    0,
  )
  const areaCount = new Set(faculties.flatMap((faculty) => faculty.areas)).size
  const topicCountLabel = topicCount === 1 ? '1 tema' : `${topicCount} temas`
  const areaCountLabel = areaCount === 1 ? '1 área' : `${areaCount} áreas`
  const availabilityCounts = faculties.reduce(
    (counts, faculty) => {
      counts[faculty.availability] += 1
      return counts
    },
    { available: 0, unavailable: 0, unconfirmed: 0 },
  )

  const nodes: ReagraphNode[] = [
    createNode('utfpr', 'UTFPR', 'institution'),
    createNode('dainf', 'DAINF', 'department'),
    createNode('professor', `Professor\n${facultyCountLabel}`, 'faculty'),
    createNode('area', `Área de conhecimento\n${areaCountLabel}`, 'area'),
    createNode('tema-tcc', `Tema TCC\n${topicCountLabel}`, 'topic'),
    createNode(
      'disciplina',
      'Disciplina\nNome e código não informados',
      'discipline',
    ),
    createNode(
      'periodo',
      'Período\nAno e semestre não informados',
      'period',
    ),
    createNode(
      'disponibilidade',
      `Disponibilidade de orientação TCC\nSim: ${availabilityCounts.available} · Não: ${availabilityCounts.unavailable} · Sem confirmação: ${availabilityCounts.unconfirmed}`,
      'availability',
    ),
  ]

  const edges: ReagraphEdge[] = [
    createEdge('utfpr-dainf', 'utfpr', 'dainf', 'abriga'),
    createEdge('dainf-professor', 'dainf', 'professor', 'vincula'),
    createEdge('professor-area', 'professor', 'area', 'atua em'),
    createEdge('area-tema', 'area', 'tema-tcc', 'relaciona'),
    createEdge('professor-tema', 'professor', 'tema-tcc', 'orienta'),
    createEdge('tema-disciplina', 'tema-tcc', 'disciplina', 'associa'),
    createEdge('tema-periodo', 'tema-tcc', 'periodo', 'proposto no'),
    createEdge('utfpr-periodo', 'utfpr', 'periodo', 'organiza'),
    createEdge('professor-disponibilidade', 'professor', 'disponibilidade', 'informa'),
    createEdge('tema-disponibilidade', 'tema-tcc', 'disponibilidade', 'considera'),
    createEdge('periodo-disponibilidade', 'periodo', 'disponibilidade', 'define'),
  ]

  return { nodes, edges }
}
