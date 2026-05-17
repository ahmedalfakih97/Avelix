import type { Metadata } from 'next'
import AdminModelsTable from '@/components/admin/AdminModelsTable'
import { getAllModelsAdmin } from '@/lib/queries/admin'

export const metadata: Metadata = { title: 'Manage Models' }

export default async function AdminModelsPage() {
  const models = await getAllModelsAdmin()

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="border-b border-terminal-border pb-4 flex items-start justify-between">
        <div>
          <span className="font-mono text-label-caps text-primary uppercase block mb-1">[MODEL_INDEX]</span>
          <h1 className="font-headline text-display-lg text-on-surface uppercase leading-none">Manage Models</h1>
        </div>
        <button className="border border-primary text-primary font-mono text-[10px] uppercase px-4 py-2 hover:bg-primary/10 transition-colors flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Add Model
        </button>
      </div>

      <AdminModelsTable data={models as unknown as Record<string, unknown>[]} />
    </div>
  )
}
