import React from "react";
import { Edit2 } from "lucide-react";

export default function ProfileCard({avatar,name,about,role,skills = [],education = [],experience = [],onEdit}) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl relative">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
          title="Edit Profile"
        >
          <Edit2 size={20} />
        </button>
      )}
      
      {avatar ? (
        <img
          src={avatar}
          alt="Avatar"
          className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 mb-4"
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          👤
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 capitalize">
        {name || "Student Name"}
      </h2>
      <p className="text-blue-600 font-medium capitalize">
        {role || "Student"}
      </p>

      <p className="text-gray-600 text-sm mt-3 normal-case max-w-md">
        {about || "Tell us something about yourself..."}
      </p>

      {skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 rounded-full text-white text-sm font-medium shadow-sm transition-transform duration-200 hover:scale-105
                ${
                  [
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-orange-500",
                    "bg-teal-500",
                    "bg-indigo-500",
                    "bg-red-500",
                  ][idx % 8]
                }
              `}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="w-full text-left mt-5">
          <h4 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
            🎓 Education
          </h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {education.map((edu, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-medium">{edu.college}</span> — {edu.degree} ({edu.year})
              </li>
            ))}
          </ul>
        </div>
      )}

      {experience.length > 0 && (
        <div className="w-full text-left mt-5">
          <h4 className="font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">
            💼 Experience
          </h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {experience.map((exp, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-medium">{exp.company}</span> — {exp.role} ({exp.duration})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
