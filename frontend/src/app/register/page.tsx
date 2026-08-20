"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Registration failed."
        );
        return;
      }

      setSuccess(
        "Account created successfully. You can now log in."
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe4] text-[#2c241c]">
      {/* NAVBAR */}

      <nav className="flex items-center justify-between border-b border-[#2c241c]/20 px-6 py-5 md:px-12">
        <Link
          href="/"
          className="text-xl font-bold tracking-[0.2em]"
        >
          CVÉRÉ
        </Link>

        <Link
          href="/login"
          className="text-xs uppercase tracking-[0.15em] transition hover:opacity-60"
        >
          Sign In
        </Link>
      </nav>

      {/* REGISTER */}

      <section className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* HEADER */}

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#806b50]">
              Begin Your Story
            </p>

            <h1 className="mt-4 font-serif text-5xl">
              Create Account
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[#5e5143]">
              Create your account and start building
              a resume worth remembering.
            </p>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-6"
          >
            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs uppercase tracking-[0.2em]"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your full name"
                className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#806b50]/60 focus:border-[#2c241c]"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-[0.2em]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#806b50]/60 focus:border-[#2c241c]"
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs uppercase tracking-[0.2em]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Minimum 6 characters"
                className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#806b50]/60 focus:border-[#2c241c]"
              />
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs uppercase tracking-[0.2em]"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Repeat your password"
                className="w-full border-b border-[#2c241c]/30 bg-transparent px-1 py-3 text-sm outline-none transition placeholder:text-[#806b50]/60 focus:border-[#2c241c]"
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="border border-red-900/20 bg-red-50 px-4 py-3 text-sm text-red-900">
                {error}
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="border border-green-900/20 bg-green-50 px-4 py-3 text-sm text-green-900">
                {success}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2c241c] px-6 py-4 text-xs uppercase tracking-[0.2em] text-[#f4efe4] transition hover:bg-[#4a3b2d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          {/* LOGIN */}

          <p className="mt-8 text-center text-sm text-[#5e5143]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 transition hover:opacity-60"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
