import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { resumes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { FileText, Plus, LogOut, Edit } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = parseInt(session.user.id);

  const userResumes = await db.query.resumes.findMany({
    where: eq(resumes.userId, userId),
    orderBy: (resumes, { desc }) => [desc(resumes.updatedAt)],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Resume Builder</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{session.user.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-slate-700">My Resumes</h2>
          {userResumes.length > 0 && (
            <Link
              href="/editor/new"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={18} />
              Create New
            </Link>
          )}
        </div>

        {userResumes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No resumes yet</h3>
            <p className="text-slate-500 mb-6">Create your first resume to get started</p>
            <Link
              href="/editor/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={18} />
              Create Resume
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userResumes.map((resume) => (
              <Link
                key={resume.id}
                href={`/editor/${resume.id}`}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-300 transition group"
              >
                <div className="flex items-start justify-between mb-4">
                  <FileText className="text-slate-400 group-hover:text-blue-500 transition" size={32} />
                  <Edit className="text-slate-300 group-hover:text-blue-500 transition" size={20} />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  {resume.name || 'Untitled Resume'}
                </h3>
                <p className="text-sm text-slate-500">
                  {resume.body?.personal?.fullName || 'No name specified'}
                </p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">
                    Updated: {new Date(resume.updatedAt).toLocaleDateString('uk-UA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
