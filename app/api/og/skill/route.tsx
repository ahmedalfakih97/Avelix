import { ImageResponse } from 'next/og'
import { getSkillBySlug } from '@/lib/queries/skills'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return new Response('Missing slug', { status: 400 })
  }

  const skill = await getSkillBySlug(slug)

  if (!skill) {
    return new Response('Skill not found', { status: 404 })
  }

  const description = skill.short_description.length > 110
    ? skill.short_description.slice(0, 110) + '…'
    : skill.short_description

  const DIFFICULTY_COLOR: Record<string, string> = {
    beginner: '#00D4B4',
    intermediate: '#F5A623',
    advanced: '#FF5E6C',
  }
  const difficultyColor = DIFFICULTY_COLOR[skill.difficulty ?? 'beginner'] ?? '#00D4B4'

  const tags = [
    skill.difficulty ? skill.difficulty.toUpperCase() : null,
    skill.estimated_hours ? `${skill.estimated_hours}H TO LEARN` : null,
    skill.category_id ? skill.category_id.replace(/-/g, ' ').toUpperCase() : null,
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
            <span style={{ color: '#00D4B4', fontSize: 18, fontWeight: 700, letterSpacing: '0.05em' }}>AVELIX</span>
            <span style={{ color: '#3D5A72', fontSize: 18 }}>›</span>
            <span style={{ color: '#3D5A72', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              AI_SKILLS
            </span>
          </div>
          <span style={{ color: '#3D5A72', fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            STEP-BY-STEP GUIDE
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          <div style={{ color: '#7A9BB5', fontSize: 16, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
            HOW TO
          </div>
          <div
            style={{
              color: '#E8F4F8',
              fontSize: 58,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
            }}
          >
            {skill.title}
          </div>
          <div style={{ color: '#7A9BB5', fontSize: 22, lineHeight: 1.5, maxWidth: 800 }}>
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
                  background: i === 0 ? `${difficultyColor}1F` : 'rgba(122,155,181,0.12)',
                  color: i === 0 ? difficultyColor : '#7A9BB5',
                  fontSize: 13,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  border: `1px solid ${i === 0 ? difficultyColor : '#7A9BB5'}40`,
                }}
              >
                {tag}
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
