'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type StoredUser = {
  id?: string;
  name?: string;
  email?: string;
};

export default function Home() {
  const router = useRouter();

  const [user, setUser] = useState<StoredUser | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (!token || !storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    setUser(null);
    setShowProfileMenu(false);
    router.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2c241c]">
      {/* Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <Link href="/" className="text-2xl font-bold tracking-[0.2em]">
          CVÉRÉ
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#templates" className="text-sm hover:opacity-60">
            Templates
          </a>

          <a href="#features" className="text-sm hover:opacity-60">
            Features
          </a>

          <a href="#how-it-works" className="text-sm hover:opacity-60">
            How It Works
          </a>

          <a href="#about" className="text-sm hover:opacity-60">
            About
          </a>
        </div>

        {/* Right corner */}
        <div className="relative flex items-center">
          {!user ? (
            <Link
              href="/register"
              className="border border-[#2c241c] px-5 py-2 text-sm transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
            >
              Create Resume
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowProfileMenu((value) => !value)}
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                className="flex h-10 w-10 items-center justify-center border border-[#2c241c]/30 transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="8" r="3.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 20c.8-3.3 3.2-5 7-5s6.2 1.7 7 5"
                  />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-12 z-50 w-64 border border-[#2c241c]/20 bg-[#f4efe4] shadow-[0_18px_45px_rgba(44,36,28,0.15)]">
                  <div className="border-b border-[#2c241c]/15 px-5 py-4">
                    <p className="truncate font-serif text-lg">{user.name || 'User'}</p>

                    <p className="mt-1 truncate text-xs text-[#806b50]">{user.email || ''}</p>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-5 py-3 text-sm transition hover:bg-[#e9e0d1]"
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-5 py-3 text-sm transition hover:bg-[#e9e0d1]"
                    >
                      Settings
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full border-t border-[#2c241c]/15 px-5 py-3 text-left text-sm transition hover:bg-[#e9e0d1]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Decorative line */}
      <div className="mx-8 border-t border-[#2c241c]/20" />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-16 px-8 py-24 md:grid-cols-2">
        <div>
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#806b50]">
            The Art of a Distinguished Resume
          </p>

          <h1 className="font-serif text-6xl leading-[0.95] md:text-8xl">
            Your story,
            <br />
            <span className="italic">beautifully</span>
            <br />
            presented.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-[#5e5143]">
            Create an elegant, professional resume inspired by timeless editorial design. Tell your
            story with confidence and make a lasting impression.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={user ? '/templates' : '/register'}
              className="bg-[#2c241c] px-7 py-4 text-sm uppercase tracking-wider text-[#f4efe4] transition hover:bg-[#4a3b2d]"
            >
              Create Your Resume
            </Link>

            <a
              href="#templates"
              className="border border-[#2c241c] px-7 py-4 text-sm uppercase tracking-wider transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
            >
              Explore Templates
            </a>
          </div>
        </div>

        {/* Resume Preview */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-md rotate-2 shadow-2xl">
            <div className="bg-[#fffdf8] p-8 md:p-10">
              <div className="border-b border-[#2c241c]/30 pb-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">
                  Curriculum Vitae
                </p>

                <h2 className="mt-3 font-serif text-4xl">
                  Alexander
                  <br />
                  Bennett
                </h2>

                <p className="mt-3 text-xs text-[#756858]">London · New York · Paris</p>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-6">
                <div className="col-span-2">
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#806b50]">
                    Profile
                  </p>

                  <p className="text-xs leading-5 text-[#5e5143]">
                    Creative professional with a passion for thoughtful design, strategic thinking
                    and meaningful experiences.
                  </p>

                  <p className="mt-6 mb-3 text-[10px] uppercase tracking-[0.25em] text-[#806b50]">
                    Experience
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="font-serif text-sm">Creative Director</p>
                      <p className="text-[10px] text-[#806b50]">Atelier & Co. · 2022—Present</p>
                    </div>

                    <div>
                      <p className="font-serif text-sm">Senior Designer</p>
                      <p className="text-[10px] text-[#806b50]">Maison Studio · 2019—2022</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-[#806b50]">
                    Contact
                  </p>

                  <p className="text-[10px] leading-5 text-[#5e5143]">
                    alex@example.com
                    <br />
                    +44 20 1234 5678
                  </p>

                  <p className="mt-6 mb-3 text-[10px] uppercase tracking-[0.25em] text-[#806b50]">
                    Skills
                  </p>

                  <p className="text-[10px] leading-5 text-[#5e5143]">
                    Creative Direction
                    <br />
                    Brand Strategy
                    <br />
                    Art Direction
                    <br />
                    Editorial Design
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 -z-10 h-full w-full border border-[#806b50]/40" />
          </div>
        </div>
      </section>

      {/* Intro Statement */}
      <section className="border-y border-[#2c241c]/20 bg-[#e9e0d1] px-8 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#806b50]">
            Crafted for distinction
          </p>

          <h2 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
            Because your first impression
            <br />
            should feel unforgettable.
          </h2>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-8 py-24">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-[0.35em] text-[#806b50]">Why CVÉRÉ</p>

          <h2 className="mt-4 font-serif text-5xl">Designed with intention.</h2>
        </div>

        <div className="grid border-l border-t border-[#2c241c]/20 md:grid-cols-3">
          <div className="border-b border-r border-[#2c241c]/20 p-8">
            <span className="font-serif text-3xl">01</span>

            <h3 className="mt-8 font-serif text-2xl">Timeless Templates</h3>

            <p className="mt-4 text-sm leading-6 text-[#5e5143]">
              Carefully designed layouts inspired by classic editorial typography and refined print
              design.
            </p>
          </div>

          <div className="border-b border-r border-[#2c241c]/20 p-8">
            <span className="font-serif text-3xl">02</span>

            <h3 className="mt-8 font-serif text-2xl">Effortless Editing</h3>

            <p className="mt-4 text-sm leading-6 text-[#5e5143]">
              Enter your information once and watch your resume take shape instantly with a live
              preview.
            </p>
          </div>

          <div className="border-b border-r border-[#2c241c]/20 p-8">
            <span className="font-serif text-3xl">03</span>

            <h3 className="mt-8 font-serif text-2xl">Ready to Impress</h3>

            <p className="mt-4 text-sm leading-6 text-[#5e5143]">
              Export a polished PDF that is ready for applications, interviews and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="bg-[#2c241c] px-8 py-24 text-[#f4efe4]">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#c8b99f]">The Collection</p>

          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-serif text-5xl md:text-6xl">Choose your style.</h2>

            <Link
              href="/templates"
              className="w-fit border border-[#f4efe4]/50 px-6 py-3 text-sm transition hover:bg-[#f4efe4] hover:text-[#2c241c]"
            >
              View All Templates
            </Link>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                number: '01',
                name: 'The Classic',
                description: 'Quiet confidence.',
              },
              {
                number: '02',
                name: 'The Executive',
                description: 'For distinguished careers.',
              },
              {
                number: '03',
                name: 'The Editorial',
                description: 'Creative by nature.',
              },
            ].map((template) => (
              <div
                key={template.number}
                className="group cursor-pointer border border-[#f4efe4]/20 p-6 transition hover:-translate-y-2"
              >
                <div className="flex aspect-[3/4] items-center justify-center bg-[#f4efe4] text-[#2c241c]">
                  <div className="w-3/4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#806b50]">Resume</p>

                    <h3 className="mt-4 font-serif text-3xl">{template.name}</h3>

                    <div className="mt-6 h-px bg-[#2c241c]/30" />

                    <div className="mt-6 space-y-2">
                      <div className="h-2 w-full bg-[#2c241c]/10" />
                      <div className="h-2 w-5/6 bg-[#2c241c]/10" />
                      <div className="h-2 w-4/6 bg-[#2c241c]/10" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex justify-between">
                  <div>
                    <p className="font-serif text-xl">{template.name}</p>

                    <p className="mt-1 text-sm text-[#c8b99f]">{template.description}</p>
                  </div>

                  <span className="text-[#c8b99f]">{template.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-8 py-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#806b50]">Simple Process</p>

          <h2 className="mt-4 font-serif text-5xl">From blank page to polished resume.</h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#2c241c] font-serif text-xl">
              01
            </div>

            <h3 className="mt-6 font-serif text-2xl">Choose a template</h3>

            <p className="mt-3 text-sm leading-6 text-[#5e5143]">
              Find a design that matches your personality and career.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#2c241c] font-serif text-xl">
              02
            </div>

            <h3 className="mt-6 font-serif text-2xl">Tell your story</h3>

            <p className="mt-3 text-sm leading-6 text-[#5e5143]">
              Add your education, experience, skills and achievements.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#2c241c] font-serif text-xl">
              03
            </div>

            <h3 className="mt-6 font-serif text-2xl">Download & apply</h3>

            <p className="mt-3 text-sm leading-6 text-[#5e5143]">
              Export your finished resume and start applying with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#2c241c]/20 bg-[#e9e0d1] px-8 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#806b50]">Your next chapter</p>

          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-7xl">
            Make your resume
            <br />
            <span className="italic">worth remembering.</span>
          </h2>

          <Link
            href={user ? '/templates' : '/register'}
            className="mt-10 inline-block bg-[#2c241c] px-8 py-4 text-sm uppercase tracking-wider text-[#f4efe4] transition hover:bg-[#4a3b2d]"
          >
            Create My Resume
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-[#2c241c] px-8 py-10 text-[#f4efe4]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-xl font-bold tracking-[0.2em]">CVÉRÉ</div>

            <p className="mt-2 text-sm text-[#c8b99f]">Resumes with character.</p>
          </div>

          <p className="text-xs text-[#c8b99f]">© 2026 CVÉRÉ. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
