import AIChat from '../components/ai/AI-Chat'

export default function AiTravelmatePage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">AI穷游搭子</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          和小元聊预算、路线、交通和避坑，做一份可执行的省钱旅行方案。
        </p>
      </header>
      <AIChat />
    </section>
  )
}
