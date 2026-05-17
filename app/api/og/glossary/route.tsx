import { ImageResponse } from 'next/og'
import { getGlossaryTermBySlug } from '@/lib/queries/glossary'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get('term')

  if (!term) {
    return new Response('Missing term', { status: 400 })
  }

  const glossaryTerm = await getGlossaryTermBySlug(term)

  if (!glossaryTerm) {
    return new Response('Term not found', { status: 404 })
  }

  const definition = glossaryTerm.simple_definition.length > 130
    ? glossaryTerm.simple_definition.slice(0, 130) + '…'
    : glossaryTerm.simple_definition

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
            <span style={{ color: '#00D4B4', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>AVELIX</span>
            <span style={{ color: '#3D5A72', fontSize: 18 }}>›</span>
            <span style={{ color: '#3D5A72', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              AI_GLOSSARY
            </span>
          </div>
          <span style={{ color: '#3D5A72', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            DEFINITION
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          <div style={{ color: '#7A9BB5', fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            WHAT IS
          </div>
          <div
            style={{
              color: '#E8F4F8',
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {glossaryTerm.title}
          </div>

          {/* Definition box */}
          <div
            style={{
              display: 'flex',
              borderLeft: '3px solid #00D4B4',
              paddingLeft: '20px',
              marginTop: '8px',
            }}
          >
            <span style={{ color: '#7A9BB5', fontSize: 22, lineHeight: 1.5, maxWidth: 820 }}>
              {definition}
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <span
            style={{
              background: 'rgba(0,212,180,0.12)',
              color: '#00D4B4',
              fontSize: 13,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              border: '1px solid rgba(0,212,180,0.25)',
            }}
          >
            AI GLOSSARY
          </span>
          <span style={{ color: '#3D5A72', fontSize: 13 }}>avelix.ai</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
