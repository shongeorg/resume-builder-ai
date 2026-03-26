import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ArrowRight, FileText, Sparkles, Download } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();

  if (session?.user?.id) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <FileText className="mx-auto text-blue-600 mb-4" size={64} />
          <h1 className="text-5xl font-bold text-slate-800 mb-4">
            AI Resume Builder
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Створюйте професійні резюме за лічені хвилини завдяки AI-асистенту
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <Sparkles className="text-purple-600 mb-3" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">AI Покращення</h3>
            <p className="text-sm text-slate-500">
              Автоматичне покращення описів вашого досвіду роботи
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <FileText className="text-blue-600 mb-3" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">Автозбереження</h3>
            <p className="text-sm text-slate-500">
              Всі зміни зберігаються автоматично в реальному часі
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <Download className="text-green-600 mb-3" size={32} />
            <h3 className="font-semibold text-slate-800 mb-2">PDF Експорт</h3>
            <p className="text-sm text-slate-500">
              Завантажуйте резюме у форматі A4 одним кліком
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-lg shadow-blue-600/20"
        >
          Розпочати безкоштовно
          <ArrowRight size={20} />
        </Link>

        <p className="mt-8 text-sm text-slate-400">
          Тестові акаунти: user1@gmail.com ... user10@gmail.com (пароль: user123)
        </p>
      </div>
    </div>
  );
}
