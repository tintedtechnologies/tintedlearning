import { Award } from 'lucide-react'

interface StageBadgeProps {
  stageTitle: string
}

export function StageBadge({ stageTitle }: StageBadgeProps) {
  return <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-sand px-3 py-2 text-xs font-bold text-teal" aria-label={`${stageTitle} stage badge earned`}><Award size={16} className="text-gold" />{stageTitle} badge earned</span>
}
