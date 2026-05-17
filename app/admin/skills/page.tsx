import type { Metadata } from 'next'
import AdminSkillsTable from '@/components/admin/AdminSkillsTable'
import { getAllSkillsAdmin } from '@/lib/queries/admin'

export const metadata: Metadata = { title: 'Manage Skills' }

export default async function AdminSkillsPage() {
  const skills = await getAllSkillsAdmin()

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="border-b border-terminal-border pb-4 flex items-start justify-between">
        <div>
          <span className="font-mono text-label-caps text-primary uppercase block mb-1">[SKILL_MATRIX]</span>
          <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">Manage Skills</h1>
        </div>
        <button className="border border-primary text-primary font-mono text-[10px] uppercase px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Skill
        </button>
      </div>

      <AdminSkillsTable data={skills as unknown as Record<string, unknown>[]} />
    </div>
  )
}
