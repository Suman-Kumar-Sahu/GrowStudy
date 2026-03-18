import React from "react";

export default function JobForm({ form, setForm, handleCreate }) {
  return (
    <form
      onSubmit={handleCreate}
      className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col gap-5 mt-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        🧾 Create a New Job Post
      </h2>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Job Title</label>
        <input
          type="text"
          placeholder="e.g. Frontend Developer"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Company</label>
        <input
          type="text"
          placeholder="e.g. OpenAI"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col flex-1">
          <label className="text-gray-700 font-medium mb-1">Location</label>
          <input
            type="text"
            placeholder="e.g. Remote / Bangalore"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-gray-700 font-medium mb-1">Stipend</label>
          <input
            type="text"
            placeholder="e.g. ₹15,000/month"
            value={form.stipend}
            onChange={(e) => setForm({ ...form, stipend: e.target.value })}
            className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">
          Required Skills (comma separated)
        </label>
        <input
          type="text"
          placeholder="e.g. React, Node.js, MongoDB"
          value={form.skillsRequired}
          onChange={(e) =>
            setForm({ ...form, skillsRequired: e.target.value })
          }
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">Job Description</label>
        <textarea
          placeholder="Describe the role, responsibilities, and requirements..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none min-h-[120px]"
        ></textarea>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">
          Responsibilities (one per line)
        </label>
        <textarea
          placeholder="e.g. 
          - Develop and maintain frontend features
          - Collaborate with design team
          - Write clean, maintainable code"
          value={form.responsibilities}
          onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none min-h-[120px]"
        ></textarea>
        <span className="text-xs text-gray-500 mt-1">
          Enter each responsibility on a new line
        </span>
      </div>

      <div className="flex flex-col">
        <label className="text-gray-700 font-medium mb-1">
          Requirements (one per line)
        </label>
        <textarea
          placeholder="e.g. 
          - 2+ years of experience with React
          - Strong understanding of JavaScript
          - Experience with REST APIs"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none min-h-[120px]"
        ></textarea>
        <span className="text-xs text-gray-500 mt-1">
          Enter each requirement on a new line
        </span>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl mt-2 transition-all duration-200 transform hover:-translate-y-[2px] shadow-sm hover:shadow-md"
      >
        Post Job
      </button>
    </form>
  );
}