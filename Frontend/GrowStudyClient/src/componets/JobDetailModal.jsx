import React from "react";
import { X } from "lucide-react";

export default function JobDetailModal({ job, onClose, onApply, currentUserId, currentUserRole, applying }) {
  const applied = currentUserId && Array.isArray(job?.applicants) ? job.applicants.includes(currentUserId) : false;

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-auto max-h-[85vh]">
        <div className="flex items-start p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-50 flex items-center justify-center text-xl font-bold text-slate-800 overflow-hidden">
              {job.companyLogo ? <img src={job.companyLogo} alt="logo" className="w-full h-full object-cover" /> : (job.company||'Co').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{job.title}</h2>
              <div className="text-sm text-slate-600 mt-1">{job.company} · {job.location || 'Remote'}</div>
              <div className="flex gap-3 text-sm text-slate-500 mt-2">
                <div>{job.type || 'Full-time'}</div>
                {job.stipend && <div>{job.stipend}</div>}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="ml-auto p-2 rounded-md hover:bg-slate-100">
            <X />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <section className="prose prose-slate">
              <h3>About the Role</h3>
              <p className="whitespace-pre-line">{job.description || 'No description provided.'}</p>
            </section>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired?.length > 0 ? job.skillsRequired.map((s,i)=> (
                  <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">{s}</span>
                )) : (<span className="px-3 py-1 bg-gray-100 text-slate-600 rounded-full text-sm">Not specified</span>)}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">📋</span> Key Responsibilities
                </h5>
                <ul className="space-y-2">
                  {job.responsibilities && job.responsibilities.length > 0 ? (
                    job.responsibilities.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                        <span className="text-blue-600 mt-0.5">▸</span>
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 text-sm italic">
                      Responsibilities will be provided during the interview process.
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-600">✓</span> Requirements
                </h5>
                <ul className="space-y-2">
                  {job.requirements && job.requirements.length > 0 ? (
                    job.requirements.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 text-sm">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{r}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-slate-500 text-sm italic">
                      Standard application requirements apply.
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <aside className="space-y-4">

            <div className="p-4 rounded-lg border text-center">
              <div className="mt-3 font-semibold">{job.recruiter?.name || 'Recruiter'}</div>
              <div className="text-sm text-slate-500">{job.recruiter?.role || 'Recruiter'}</div>
            </div>

            <div className="mt-auto">
              {currentUserRole === 'student' ? (
                <button onClick={() => onApply && onApply(job._id)} disabled={applied || applying} className={`w-full px-4 py-3 rounded-md font-bold ${applied ? 'bg-gray-300 text-slate-700' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'}`}>
                  {applied ? 'Applied ✅' : applying ? 'Applying...' : 'Apply Now'}
                </button>
              ) : (
                <button disabled className="w-full px-4 py-3 rounded-md bg-gray-100 text-slate-700">Only students can apply</button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
