import { ImageResponse } from 'next/og'
import { getToolBySlug } from '@/lib/queries/tools'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const tool = await getToolBySlug(slug)

  if (!tool) {
    return new Response('Tool not found', { status: 404 })
  }

  const category = tool.category_name ?? 'AI Tool'
  const tags = tool.best_for.slice(0, 3)
  const description = tool.short_description.length > 110
    ? tool.short_description.slice(0, 110) + '…'
    : tool.short_description

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
        {/* Grid background lines */}
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
              TOOL_DIRECTORY
            </span>
          </div>
          <span
            style={{
              color: '#00D4B4',
              fontSize: 12,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: '1px solid rgba(0,212,180,0.3)',
              padding: '4px 12px',
            }}
          >
            {category}
          </span>
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
            {tool.title}
          </div>
          <div
            style={{
              color: '#7A9BB5',
              fontSize: 22,
              lineHeight: 1.5,
              maxWidth: 800,
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {tags.map((tag, i) => (
              <span
                key={i}
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
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#3D5A72', fontSize: 13 }}>avelix.ai</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
