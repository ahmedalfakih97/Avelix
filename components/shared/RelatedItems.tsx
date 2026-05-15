import ToolCard from '@/components/library/ToolCard'
import type { Tool } from '@/types/tool'

interface RelatedItemsProps {
  title: string
  tools: Tool[]
}

export default function RelatedItems({ title, tools }: RelatedItemsProps) {
  if (!tools.length) return null

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="h-px flex-1 bg-terminal-border" />
        <span className="font-mono text-label-caps text-on-surface-variant uppercase">{title}</span>
        <div className="h-px flex-1 bg-terminal-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} variant="compact" />
        ))}
      </div>
    </div>
  )
}
