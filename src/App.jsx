import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { translations } from "./data/translations";
import { AgeGate } from "./components/layout/AgeGate";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AcademyPage } from "./pages/AcademyPage";

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
    <Routes>
      <Route path="/" element={
        <HomePage lang={lang} setLang={setLang} theme={theme} toggleTheme={toggleTheme} t={t} />
      } />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/academy" element={<AcademyPage />} />
    </Routes>
  );
}
