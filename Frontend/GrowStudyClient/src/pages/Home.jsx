import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Users, Shield, CheckSquare, MessageCircle, Star } from "lucide-react";
import heroImg from "../assets/react.svg";
import Footer from "../componets/Footer";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="brand-title" onClick={() => navigate('/')}>CareerNest</div>
        <div>
          <button className="nav-btn" onClick={() => navigate('/user/login')}>Login</button>
          <button className="nav-btn" onClick={() => navigate('/user/register')}>Register</button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h2>Empowering Your Career Journey</h2>
            <p>CareerNest connects students and professionals through smart profiles, resumes, and curated opportunities. Build your digital career identity and grow your career today.</p>

            <div className="mt-6">
              <button className="get-started-btn" onClick={() => navigate('/user/register')}>Get started</button>
              <button className="nav-btn" style={{ marginLeft: 12 }} onClick={() => navigate('/job-list')}>Browse jobs</button>
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImg} alt="Career illustration" />
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="feature">
            <div className="feature-icon"><Rocket /></div>
            <h3>Fast Growth</h3>
            <p>Track your skills, courses and projects in one place.</p>
          </div>

          <div className="feature">
            <div className="feature-icon"><Users /></div>
            <h3>Community</h3>
            <p>Connect with peers, mentors and recruiters.</p>
          </div>

          <div className="feature">
            <div className="feature-icon"><Shield /></div>
            <h3>Secure Data</h3>
            <p>Your personal information stays private and protected.</p>
          </div>
        </section>

        <section id="how" className="py-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h2 className="text-2xl md:text-3xl font-bold">How CareerNest Works</h2>
              <p className="mt-3 text-gray-600">Simple, focused steps to create your career profile and discover opportunities.</p>

              <div className="mt-8 grid grid-cols-1 gap-4">
                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-indigo-600"><CheckSquare /></div>
                  <h4 className="mt-3 font-semibold">Create Profile</h4>
                  <p className="mt-2 text-sm text-gray-600">Add skills, education and projects with ease.</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-indigo-600"><MessageCircle /></div>
                  <h4 className="mt-3 font-semibold">Engage</h4>
                  <p className="mt-2 text-sm text-gray-600">Connect with recruiters and apply directly to roles.</p>
                </div>

                <div className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-indigo-600"><Star /></div>
                  <h4 className="mt-3 font-semibold">Grow</h4>
                  <p className="mt-2 text-sm text-gray-600">Track progress and get personalized recommendations.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-80 md:w-full max-w-md bg-white rounded-lg p-6 shadow-lg transform transition hover:scale-102">
                <img src={heroImg} alt="Illustration" className="w-full h-auto block" />
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-gradient-to-b from-gray-50 to-white py-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Success Stories</h2>
            <p className="text-center mt-2 text-gray-600">Real students who found internships and jobs through CareerNest.</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Aisha K.', role: 'Software Intern', quote: 'I found a great internship within weeks.' },
                { name: 'Rahul P.', role: 'Data Analyst', quote: 'The profile and resume builder saved me hours.' },
                { name: 'Maya R.', role: 'UX Designer', quote: 'Recruiters reached out after I published my portfolio.' }
              ].map((t, i) => (
                <div key={i} className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-indigo-600">{i === 0 ? <Star /> : <Star />}</div>
                  <p className="mt-3 text-gray-700">"{t.quote}"</p>
                  <p className="mt-4 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="py-12 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="mt-6 space-y-3">
              {[
                { q: 'Is CareerNest free?', a: 'Yes — the basic plan is free for students.' },
                { q: 'Can I export my resume?', a: 'Yes — you can download your resume as PDF.' },
                { q: 'How do recruiters contact me?', a: 'Recruiters can message you directly through the platform.' }
              ].map((f, idx) => (
                <div key={idx} className="border rounded">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full text-left px-4 py-3 flex justify-between items-center">
                    <span className="font-medium">{f.q}</span>
                    <span className="text-gray-500">{openFaq === idx ? '−' : '+'}</span>
                  </button>
                  {openFaq === idx && <div className="px-4 pb-4 text-gray-600">{f.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="cta" className="py-12 bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to build your career profile?</h2>
            <p className="mt-2">Join thousands of students using CareerNest to land internships and jobs.</p>
            <div className="mt-6">
              <button onClick={() => navigate('/user/register')} className="px-6 py-3 bg-white text-indigo-600 rounded font-semibold">Create Account</button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
