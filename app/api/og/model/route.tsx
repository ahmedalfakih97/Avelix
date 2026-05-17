import { ImageResponse } from 'next/og'
import { getModelBySlug } from '@/lib/queries/models'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const model = await getModelBySlug(slug)

  if (!model) {
    return new Response('Model not found', { status: 404 })
  }

  const description = model.short_description.length > 110
    ? model.short_description.slice(0, 110) + '…'
    : model.short_description

  const specs = [
    model.model_type ? model.model_type.toUpperCase().replace(/-/g, ' ') : null,
    model.context_window ? `${(model.context_window / 1000).toFixed(0)}K CTX` : null,
    model.has_api ? 'API' : null,
  ].filter(Boolean).slice(0, 3) as string[]

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          background: '#050A14',
          padding: '56px 64px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(22,37,68,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(22,37,68,0.6) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#00D4B4', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>
              AVELIX
            </span>
            <span style={{ color: '#3D5A72', fontSize: 18 }}>›</span>
            <span style={{ color: '#3D5A72', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              AI_MODELS
            </span>
          </div>
          {model.provider && (
            <span
              style={{
                color: '#7A9BB5',
                fontSize: 13,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1px solid rgba(122,155,181,0.3)',
                padding: '4px 12px',
              }}
            >
              {model.provider}
            </span>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          <div
            style={{
              color: '#E8F4F8',
              fontSize: 62,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {model.title}
          </div>
          <div style={{ color: '#7A9BB5', fontSize: 22, lineHeight: 1.5, maxWidth: 800 }}>
            {description}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {specs.map((spec, i) => (
              <span
                key={i}
                style={{
                  background: 'rgba(122,155,181,0.12)',
                  color: '#7A9BB5',
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: '1px solid rgba(122,155,181,0.25)',
                }}
              >
                {spec}
              </span>
            ))}
          </div>
          <span style={{ color: '#3D5A72', fontSize: 13 }}>avelix.ai</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
