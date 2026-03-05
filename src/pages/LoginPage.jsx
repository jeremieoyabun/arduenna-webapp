import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/auth/AuthProvider";
import { createUserProfile } from "../lib/userService";

const roleLabels = {
  bartender: "Bartender",
  commercial: "Commercial",
  caviste: "Caviste / Distributeur",
};

export const LoginPage = () => {
  const { login, loginWithGoogle, signup, refreshProfile, user, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [selectedRole, setSelectedRole] = useState("bartender");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) navigate("/academy", { replace: true });
  }, [user, loading, navigate]);

  const authErrorMessage = (err) => {
    const code = err?.code;
    if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password")
      return "Email ou mot de passe incorrect.";
    if (code === "auth/email-already-in-use") return "Cet email est déjà utilisé.";
    if (code === "auth/weak-password") return "Mot de passe trop court (6 caractères minimum).";
    if (code === "auth/invalid-email") return "Adresse email invalide.";
    if (code === "auth/popup-blocked") return "Popup bloqué — autorisez les popups pour ce site.";
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return null;
    return err?.message || "Une erreur est survenue.";
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      if (isSignup) {
        const cred = await signup(email, password);
        await createUserProfile(cred.user.uid, {
          email,
          firstName,
          displayName: firstName,
          role: selectedRole,
        });
        await refreshProfile();
      } else {
        await login(email, password);
        await refreshProfile();
      }
      navigate("/academy");
    } catch (err) {
      const msg = authErrorMessage(err);
      if (msg) setError(msg);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      await loginWithGoogle(selectedRole);
    } catch (err) {
      const msg = authErrorMessage(err);
      if (msg) setError(msg);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const inputStyle = {
    width: "100%",
    padding: "var(--space-3) 0",
    border: "none",
    borderBottom: "1px solid rgba(11,54,61,0.15)",
    borderRadius: 0,
    background: "transparent",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    marginBottom: "var(--space-5)",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease-out",
    outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#fef8ec",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "var(--space-6)",
      position: "relative",
    }}>
      {/* Back to home */}
      <Link
        to="/"
        aria-label="Retour à l'accueil"
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          color: "var(--text-primary)",
          textDecoration: "none",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          opacity: 0.5,
          transition: "opacity 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Accueil
      </Link>

      <div style={{
        background: "#ffffff",
        borderRadius: 12,
        padding: "var(--space-10) var(--space-8)",
        maxWidth: 400,
        width: "100%",
        border: "1px solid rgba(11,54,61,0.08)",
        boxShadow: "0 2px 12px rgba(11,54,61,0.03)",
      }}>
        {/* Logo + Academy */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <img
            src="/Arduennagin_logo_vert_.webp"
            alt="Arduenna"
            style={{ maxWidth: 140, height: "auto", display: "inline-block" }}
          />
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 18,
            fontStyle: "italic",
            color: "#c2744a",
            marginTop: 2,
          }}>
            Academy
          </div>
        </div>

        {/* Toggle Connexion / Créer un compte */}
        <div style={{
          display: "flex",
          gap: "var(--space-2)",
          marginBottom: "var(--space-6)",
        }}>
          <button
            onClick={() => setIsSignup(false)}
            style={{
              flex: 1,
              padding: "var(--space-2) var(--space-3)",
              background: !isSignup ? "#0b363d" : "transparent",
              color: !isSignup ? "#fef8ec" : "rgba(11,54,61,0.5)",
              border: "1px solid rgba(11,54,61,0.15)",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease-out",
            }}
          >
            Connexion
          </button>
          <button
            onClick={() => setIsSignup(true)}
            style={{
              flex: 1,
              padding: "var(--space-2) var(--space-3)",
              background: isSignup ? "#0b363d" : "transparent",
              color: isSignup ? "#fef8ec" : "rgba(11,54,61,0.5)",
              border: "1px solid rgba(11,54,61,0.15)",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease-out",
            }}
          >
            Créer un compte
          </button>
        </div>

        {/* Google button — ghost style */}
        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            padding: "12px 16px",
            background: "transparent",
            border: "1px solid rgba(11,54,61,0.15)",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            color: "#0b363d",
            marginBottom: "var(--space-5)",
            transition: "background 0.2s ease-out",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuer avec Google
        </button>

        {/* Separator */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          margin: "var(--space-4) 0",
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(11,54,61,0.1)" }} />
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(11,54,61,0.35)" }}>ou</span>
          <div style={{ flex: 1, height: 1, background: "rgba(11,54,61,0.1)" }} />
        </div>

        {/* Form fields */}
        <div>
          {isSignup && (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Prénom"
              style={inputStyle}
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Email"
            required
            style={inputStyle}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mot de passe"
            required
            minLength={6}
            style={inputStyle}
          />

          {/* Role selector — signup only */}
          {isSignup && (
            <div style={{ marginBottom: "var(--space-5)" }}>
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: "rgba(11,54,61,0.5)",
                textTransform: "uppercase",
                letterSpacing: 2,
                marginBottom: "var(--space-2)",
              }}>
                Votre rôle
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {Object.entries(roleLabels).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedRole(key)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      background: selectedRole === key ? "#0b363d" : "transparent",
                      color: selectedRole === key ? "#fef8ec" : "rgba(11,54,61,0.5)",
                      border: "1px solid rgba(11,54,61,0.12)",
                      borderRadius: 6,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.2s ease-out",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <p style={{
              color: "#c2744a",
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: "var(--space-4)",
              textAlign: "center",
            }}>
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "14px 24px",
              background: "#0b363d",
              color: "#fef8ec",
              border: "none",
              borderRadius: 8,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "opacity 0.2s ease-out",
            }}
          >
            {isSignup ? "Créer mon compte" : "Se connecter"}
          </button>
        </div>

        {/* Forgot password */}
        {!isSignup && (
          <button
            style={{
              background: "none",
              border: "none",
              color: "rgba(11,54,61,0.4)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              margin: "var(--space-3) auto 0",
              display: "block",
              cursor: "pointer",
            }}
          >
            Mot de passe oublié ?
          </button>
        )}

        {/* Link back to site */}
        <Link
          to="/"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "var(--space-6)",
            color: "#c2744a",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          Découvrir le site Arduenna →
        </Link>
      </div>
    </div>
  );
};
