import AIChat from '../components/ai/AI-Chat'

export default function AiPlannerPage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI旅行计划工作台</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          左侧与小元实时对话，右侧同步整理当前会话生成的旅行计划草稿。
        </p>
      </header>
      <AIChat withDraft />
    </section>
  )
}
