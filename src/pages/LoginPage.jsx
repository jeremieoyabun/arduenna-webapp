import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";

export const LoginPage = () => {
  const { login, loginWithGoogle, signup, setRole } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("bartender");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      setRole(selectedRole);
      navigate("/academy");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      setRole(selectedRole);
      navigate("/academy");
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "var(--space-3) var(--space-4)",
    border: "1px solid var(--border-medium)",
    borderRadius: "var(--radius-md)",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-base)",
    marginBottom: "var(--space-4)",
    boxSizing: "border-box",
    transition: "border-color var(--duration-fast) var(--ease-out)",
    outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-6)",
    }}>
      <div style={{
        background: "var(--bg-surface)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-10)",
        maxWidth: 400,
        width: "100%",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-md)",
      }}>
        <img
          src="/Arduennagin_logo_vert_.webp"
          alt="Arduenna"
          style={{ width: 120, margin: "0 auto var(--space-6)", display: "block" }}
        />

        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: 400,
          fontStyle: "italic",
          textAlign: "center",
          color: "var(--text-primary)",
          marginBottom: "var(--space-8)",
        }}>
          Bienvenue dans l'Academy
        </h1>

        <button
          onClick={handleGoogle}
          className="btn-primary"
          style={{
            width: "100%",
            marginBottom: "var(--space-6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-2)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>

        <div style={{
          textAlign: "center",
          color: "var(--text-tertiary)",
          fontSize: "var(--text-sm)",
          margin: "var(--space-4) 0",
          fontFamily: "var(--font-body)",
        }}>
          ou
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            minLength={6}
            style={inputStyle}
          />

          {/* Role selector */}
          <div style={{ marginBottom: "var(--space-6)" }}>
            <label style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              color: "var(--text-secondary)",
              display: "block",
              marginBottom: "var(--space-2)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              Votre rôle
            </label>
            <div style={{ display: "flex", gap: "var(--space-2)" }}>
              {["bartender", "commercial", "distributeur"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={selectedRole === r ? "filter-chip filter-chip--active" : "filter-chip"}
                  onClick={() => setSelectedRole(r)}
                  style={{ flex: 1, textTransform: "capitalize" }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p style={{
              color: "var(--accent-secondary)",
              fontSize: "var(--text-sm)",
              fontFamily: "var(--font-body)",
              marginBottom: "var(--space-4)",
            }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" style={{ width: "100%" }}>
            {isSignup ? "Créer un compte" : "Se connecter"}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            margin: "var(--space-4) auto 0",
            display: "block",
            cursor: "pointer",
          }}
        >
          {isSignup ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
        </button>

        <Link
          to="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "var(--space-6)",
            color: "var(--accent-secondary)",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
          }}
        >
          Découvrir Arduenna →
        </Link>
      </div>
    </div>
  );
};
