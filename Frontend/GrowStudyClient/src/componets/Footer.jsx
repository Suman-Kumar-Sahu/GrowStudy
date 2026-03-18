import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-semibold">CareerPortal</h2>
            <p className="mt-2 text-sm text-gray-300">Connecting students with recruiters and opportunities seamlessly.</p>
          </div>

          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link to="/jobs" className="hover:underline">Jobs</Link></li>
              <li><Link to="/student/dashboard" className="hover:underline">Student Dashboard</Link></li>
              <li><Link to="/recruiter" className="hover:underline">Recruiter Dashboard</Link></li>
              <li><Link to="/recruiter/applications" className="hover:underline">Applicants</Link></li>
              <li><Link to="/profile" className="hover:underline">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Contact Us</h4>
            <p className="mt-2 text-sm">Email: support@careerportal.com</p>
            <p className="text-sm">Phone: +91 98765 43210</p>
            <div className="mt-3 flex items-center gap-3">
              <a href="#" className="text-gray-300 hover:text-white"><Facebook size={18} /></a>
              <a href="#" className="text-gray-300 hover:text-white"><Twitter size={18} /></a>
              <a href="#" className="text-gray-300 hover:text-white"><Linkedin size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Newsletter</h4>
            <p className="mt-2 text-sm">Get the latest jobs and updates.</p>
            <form className="mt-3 flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md text-amber-100 text-sm flex-1 border-amber-50"
              />
              <button type="submit" className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CareerPortal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
