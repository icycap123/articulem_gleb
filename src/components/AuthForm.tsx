"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? { name, username, email, password } : { email, password };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Что-то пошло не так");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
      setLoading(false);
    }
  }

  const field: React.CSSProperties = {
    width: "100%",
    background: "rgba(12,12,14,0.7)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12,
    padding: "13px 15px",
    color: "#e9e7e2",
    fontSize: 15,
    outline: "none",
    transition: "border-color .3s ease",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(205,169,106,0.5)"; };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; };
  const label: React.CSSProperties = { display: "block", fontSize: 12.5, fontWeight: 600, color: "#79766f", marginBottom: 8, letterSpacing: ".3px" };

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", paddingTop: 70 }}>
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <div className="wordmark" style={{ fontSize: 34, marginBottom: 16 }}>Articulem</div>
        <h1 className="serif" style={{ fontSize: 30, fontWeight: 700, color: "#f7f4ee", margin: 0 }}>
          {isRegister ? "Создать аккаунт" : "С возвращением"}
        </h1>
        <p style={{ fontSize: 14.5, color: "#9a978f", margin: "10px 0 0" }}>
          {isRegister ? "Регистрация открывает доступ к публикации статей." : "Войдите, чтобы писать и обсуждать статьи."}
        </p>
      </div>

      <div style={{ background: "rgba(18,18,20,0.72)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 30, display: "flex", flexDirection: "column", gap: 18 }}>
        {isRegister && (
          <>
            <div>
              <label style={label}>Имя</label>
              <input value={name} onChange={(e) => setName(e.target.value)} onFocus={focus} onBlur={blur} placeholder="Как вас зовут" style={field} />
            </div>
            <div>
              <label style={label}>Имя пользователя</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} onFocus={focus} onBlur={blur} placeholder="например, marialebedeva" style={field} />
            </div>
          </>
        )}
        <div>
          <label style={label}>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={focus} onBlur={blur} placeholder="you@example.com" style={field}
            onKeyDown={(e) => { if (e.key === "Enter" && !isRegister) submit(); }} />
        </div>
        <div>
          <label style={label}>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={focus} onBlur={blur} placeholder="Не короче 6 символов" style={field}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        </div>

        {error && (
          <div style={{ color: "#ef8f9b", fontSize: 13.5, fontWeight: 600, background: "rgba(239,143,155,0.08)", border: "1px solid rgba(239,143,155,0.22)", borderRadius: 10, padding: "10px 13px" }}>
            {error}
          </div>
        )}

        <button onClick={submit} disabled={loading}
          style={{ background: "#cda96a", color: "#1a1408", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.8 : 1, marginTop: 4 }}>
          {loading ? "Минуту…" : isRegister ? "Зарегистрироваться" : "Войти"}
        </button>
      </div>

      <div style={{ textAlign: "center", marginTop: 22, fontSize: 14, color: "#9a978f" }}>
        {isRegister ? (
          <>Уже есть аккаунт?{" "}<Link href={`/login${next !== "/" ? `?next=${next}` : ""}`} style={{ color: "#e6cfa0", fontWeight: 600 }}>Войти</Link></>
        ) : (
          <>Впервые здесь?{" "}<Link href={`/register${next !== "/" ? `?next=${next}` : ""}`} style={{ color: "#e6cfa0", fontWeight: 600 }}>Создать аккаунт</Link></>
        )}
      </div>
    </div>
  );
}
