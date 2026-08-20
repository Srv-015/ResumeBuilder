'use client';

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid email or password.");
      }

      // Clear any previous authentication state first.
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Remember Me controls where the authentication state is stored.
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      router.replace("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2c241c]">
      <div className="grid min-h-screen md:grid-cols-2">
        <section className="hidden bg-[#2c241c] p-12 text-[#f4efe4] md:flex md:flex-col md:justify-between">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-[0.2em]">
              CVÉRÉ
            </Link>

            <div className="mt-24 max-w-lg">
              <p className="text-xs uppercase tracking-[0.35em] text-[#c8b99f]">
                Welcome Back
              </p>

              <h1 className="mt-6 font-serif text-6xl leading-[1]">
                Your story
                <br />
                <span className="italic">continues here.</span>
              </h1>

              <p className="mt-8 max-w-md text-base leading-7 text-[#c8b99f]">
                Continue creating, editing and refining a resume that
                represents where you&apos;ve been and where you&apos;re going.
              </p>
            </div>
          </div>

          <div className="border-t border-[#f4efe4]/20 pt-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c8b99f]">
              Resumes with character.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-12 text-center md:hidden">
              <Link href="/" className="text-2xl font-bold tracking-[0.2em]">
                CVÉRÉ
              </Link>
            </div>

            <div className="mb-10">
              <p className="text-xs uppercase tracking-[0.3em] text-[#806b50]">
                Sign In
              </p>

              <h2 className="mt-4 font-serif text-5xl">Welcome back.</h2>

              <p className="mt-4 text-sm leading-6 text-[#5e5143]">
                Sign in to continue working on your resumes.
              </p>
            </div>

            {error && (
              <div className="mb-6 border border-red-900/20 bg-red-900/5 px-4 py-3 text-sm text-red-900">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-7">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs uppercase tracking-[0.2em]"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="alex@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-50"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs uppercase tracking-[0.2em]"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs underline underline-offset-4"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#8c8072] focus:border-[#2c241c] disabled:opacity-50"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  disabled={loading}
                  className="h-4 w-4"
                />

                <label htmlFor="remember" className="text-xs text-[#5e5143]">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2c241c] py-4 text-sm uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#2c241c]/20" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#806b50]">
                Or
              </span>
              <div className="h-px flex-1 bg-[#2c241c]/20" />
            </div>

            <button
              type="button"
              className="w-full border border-[#2c241c]/40 py-4 text-sm uppercase tracking-[0.15em] transition hover:bg-[#2c241c] hover:text-[#f4efe4]"
            >
              Continue with Google
            </button>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#5e5143]">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium underline underline-offset-4"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
