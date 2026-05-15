import type { LearningStep as LearningStepType } from '@/types/skill'

interface LearningStepProps {
  step: LearningStepType
  total: number
}

export default function LearningStep({ step, total }: LearningStepProps) {
  return (
    <div className="border border-terminal-border bg-electromagnetic-ink hover:border-l-2 hover:border-l-primary transition-all">
      <div className="flex items-start gap-4 p-5">
        <div className="flex-shrink-0 w-10 h-10 bg-surface-container border border-terminal-border flex items-center justify-center">
          <span className="font-mono text-[11px] text-primary">
            {String(step.step).padStart(2, '0')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h4 className="font-headline text-on-surface uppercase text-[13px] font-bold">
              {step.title}
            </h4>
            {step.duration_hours && (
              <span className="font-mono text-[9px] text-data-dim uppercase flex-shrink-0">
                ~{step.duration_hours}H
              </span>
            )}
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">{step.description}</p>
          {step.resources && step.resources.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {step.resources.map((r, i) => (
                <span key={i} className="font-mono text-[8px] border border-terminal-border text-data-dim px-1.5 py-0.5 uppercase">
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Progress underline */}
      <div className="h-px w-full bg-terminal-border">
        <div
          className="h-full bg-primary/30 transition-all"
          style={{ width: `${(step.step / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
