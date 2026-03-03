import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { translations } from "./data/translations";
import { AgeGate } from "./components/layout/AgeGate";

// Lazy-load heavy pages to reduce initial bundle
const HomePage = lazy(() => import("./pages/HomePage").then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const AcademyPage = lazy(() => import("./pages/AcademyPage").then(m => ({ default: m.AcademyPage })));
const AdminPage = lazy(() => import("./pages/AdminPage").then(m => ({ default: m.AdminPage })));

const PageLoader = () => (
  <div style={{
    minHeight: "100vh", background: "#fef8ec",
    display: "flex", alignItems: "center", justifyContent: "center",
  }}>
    <div style={{
      fontFamily: "'Cormorant Garamond', Georgia, serif",
      fontSize: 22, fontStyle: "italic", color: "#0b363d",
    }}>
      Arduenna
    </div>
  </div>
);

export default function ArduennaWebapp() {
  const [lang, setLang] = useState("fr");
  const [theme, setTheme] = useState("light");
  const [ageVerified, setAgeVerified] = useState(false);
  const [ageDenied, setAgeDenied] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  if (!ageVerified) {
    return (
      <AgeGate
        t={t}
        ageDenied={ageDenied}
        onVerify={() => setAgeVerified(true)}
        onDeny={() => setAgeDenied(true)}
      />
    );
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={
          <HomePage lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} t={t} />
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/academy" element={<AcademyPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Suspense>
  );
}
