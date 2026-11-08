import { useEffect, useRef } from 'react'
import {
  GraphCanvas,
  lightTheme,
  type GraphCanvasProps,
  type GraphCanvasRef,
  type Theme,
} from 'reagraph'

const graphTheme: Theme = {
  ...lightTheme,
  canvas: { ...lightTheme.canvas, background: '#ffffff' },
  node: {
    ...lightTheme.node,
    fill: '#e9defb',
    activeFill: '#d8c3f4',
    label: {
      ...lightTheme.node.label,
      color: '#321e4b',
      activeColor: '#321e4b',
      stroke: '#ffffff',
    },
  },
  edge: {
    ...lightTheme.edge,
    fill: '#8d79a2',
    activeFill: '#321e4b',
    opacity: 0.9,
    label: {
      ...lightTheme.edge.label,
      color: '#4a4054',
      activeColor: '#321e4b',
    },
  },
}

type ReagraphCanvasProps = Omit<GraphCanvasProps, 'theme'> & {
  initialTargetX: number
  onGraphReady: (graph: GraphCanvasRef | null) => void
}

function ReagraphCanvas({ initialTargetX, onGraphReady, ...props }: ReagraphCanvasProps) {
  const graphRef = useRef<GraphCanvasRef>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    let lastSize = ''
    let active = true

    const fitGraph = async (attempt = 0) => {
      const graph = graphRef.current
      if (!active || !graph) return

      const controls = graph.getControls()
      if (!controls && attempt < 30) {
        frame = window.requestAnimationFrame(() => {
          void fitGraph(attempt + 1)
        })
        return
      }

      if (!controls) return
      await graph.fitNodesInView(undefined, { animated: false })
      const activeControls = graphRef.current?.getControls()
      if (!active || graphRef.current !== graph || !activeControls) return

      onGraphReady(graph)
      activeControls.setTarget(initialTargetX, 0, 0, false)
      activeControls.dollyTo(activeControls.distance * 1.2, false)
    }

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      const size = `${width}:${height}`
      if (size === lastSize) return

      lastSize = size
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        void fitGraph()
      })
    })

    if (containerRef.current) observer.observe(containerRef.current)

    return () => {
      active = false
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      onGraphReady(null)
    }
  }, [initialTargetX, onGraphReady])

  return (
    <div className="reagraph-container" ref={containerRef}>
      <GraphCanvas {...props} ref={graphRef} theme={graphTheme} />
    </div>
  )
}

export default ReagraphCanvas
