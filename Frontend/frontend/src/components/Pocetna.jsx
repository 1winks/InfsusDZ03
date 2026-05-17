import { useState } from "react";

export default function Pocetna({ onLogin }) {
    const [activeForm, setActiveForm] = useState("login");

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const [registerData, setRegisterData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login uspješan!");
                localStorage.setItem("token", data.accessToken || data.token);
                localStorage.setItem("username", data.username);
                console.log("LOGIN DATA:", data);
                console.log("SAVED TOKEN:", localStorage.getItem("token"));

                if (onLogin) {
                    onLogin();
                }
            } else {
                alert(data.message || "Greška kod logina");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije pokrenut ili nije dostupan.");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: registerData.username,
                    email: registerData.email,
                    password: registerData.password,
                    role: ["user"],
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registracija uspješna!");
                setActiveForm("login");
            } else {
                alert(data.message || "Greška kod registracije");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije pokrenut ili nije dostupan.");
        }
    };

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.logoSection}>
                    <button type="button" style={styles.menuButton}>☰</button>
                    <h1 style={styles.logo}>EduConnect</h1>
                </div>
            </nav>

            <main style={styles.main}>
                <section style={styles.heroSection}>
                    <div style={styles.heroContent}>
                        <h2 style={styles.heroTitle}>Pronađi najboljeg instruktora online</h2>
                        <p style={styles.heroText}>
                            EduConnect povezuje učenike i instruktore za matematiku,
                            programiranje, jezike i druge predmete. Uči brzo, jednostavno i
                            kvalitetno.
                        </p>

                        <div style={styles.featuresGrid}>
                            <Feature icon="✓" title="Provjereni instruktori">
                                Instruktori s ocjenama i recenzijama.
                            </Feature>

                            <Feature icon="★" title="Online i uživo">
                                Odaberi način učenja koji ti odgovara.
                            </Feature>

                            <Feature icon="⚡" title="Brza rezervacija">
                                Dogovori termin u samo nekoliko klikova.
                            </Feature>
                        </div>
                    </div>

                    <section style={styles.card}>
                        <h3 style={styles.cardTitle}>EduConnect</h3>
                        <p style={styles.cardSubtitle}>Sustav za pronalaženje instruktora</p>

                        <div style={styles.tabs}>
                            <button
                                type="button"
                                onClick={() => setActiveForm("login")}
                                style={activeForm === "login" ? styles.activeTab : styles.tab}
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveForm("register")}
                                style={activeForm === "register" ? styles.activeTab : styles.tab}
                            >
                                Register
                            </button>
                        </div>

                        {activeForm === "login" ? (
                            <form onSubmit={handleLogin} style={styles.form}>
                                <Input
                                    label="Korisničko ime"
                                    type="text"
                                    placeholder="Unesi korisničko ime"
                                    value={loginData.username}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, username: e.target.value })
                                    }
                                />

                                <Input
                                    label="Lozinka"
                                    type="password"
                                    placeholder="Unesi lozinku"
                                    value={loginData.password}
                                    onChange={(e) =>
                                        setLoginData({ ...loginData, password: e.target.value })
                                    }
                                />

                                <button type="submit" style={styles.submitButton}>
                                    Prijavi se
                                </button>

                                <p style={styles.smallText}>Zaboravljena lozinka?</p>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} style={styles.form}>
                                <Input
                                    label="Korisničko ime"
                                    type="text"
                                    placeholder="Unesi korisničko ime"
                                    value={registerData.username}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, username: e.target.value })
                                    }
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Unesi email"
                                    value={registerData.email}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, email: e.target.value })
                                    }
                                />

                                <Input
                                    label="Lozinka"
                                    type="password"
                                    placeholder="Kreiraj lozinku"
                                    value={registerData.password}
                                    onChange={(e) =>
                                        setRegisterData({ ...registerData, password: e.target.value })
                                    }
                                />

                                <button type="submit" style={styles.submitButton}>
                                    Kreiraj račun
                                </button>
                            </form>
                        )}
                    </section>
                </section>
            </main>
        </div>
    );
}

function Input({ label, type, placeholder, value, onChange }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                minLength={type === "password" ? 6 : undefined}
                style={styles.input}
            />
        </div>
    );
}

function Feature({ icon, title, children }) {
    return (
        <div style={styles.featureCard}>
            <div style={styles.featureIcon}>{icon}</div>
            <div>
                <h4 style={styles.featureTitle}>{title}</h4>
                <p style={styles.featureText}>{children}</p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
    },

    navbar: {
        width: "100%",
        backgroundColor: "#1976d2",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        boxSizing: "border-box",
    },

    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },

    menuButton: {
        background: "transparent",
        border: "none",
        color: "white",
        fontSize: "22px",
        cursor: "pointer",
    },

    logo: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "bold",
    },

    main: {
        width: "100%",
        minHeight: "calc(100vh - 58px)",
        padding: "40px 80px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
    },

    heroSection: {
        width: "100%",
        minHeight: "calc(100vh - 140px)",
        display: "grid",
        gridTemplateColumns: "1fr 440px",
        gap: "60px",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "1600px",
        margin: "0 auto",
    },

    heroContent: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    heroTitle: {
        fontSize: "48px",
        lineHeight: "1.1",
        margin: "0 0 18px 0",
        color: "#0f172a",
        fontWeight: "800",
    },

    heroText: {
        maxWidth: "760px",
        color: "#475569",
        fontSize: "18px",
        lineHeight: "1.7",
        marginBottom: "32px",
    },

    featuresGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "20px",
        maxWidth: "1000px",
    },

    featureCard: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "22px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
    },

    featureIcon: {
        width: "46px",
        height: "46px",
        borderRadius: "14px",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "20px",
        flexShrink: 0,
    },

    featureTitle: {
        margin: "0 0 6px 0",
        fontSize: "18px",
        color: "#0f172a",
    },

    featureText: {
        margin: 0,
        color: "#475569",
        lineHeight: "1.5",
    },

    card: {
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "32px",
        boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
    },

    cardTitle: {
        margin: "0 0 8px 0",
        color: "#2563eb",
        fontSize: "32px",
        fontWeight: "800",
    },

    cardSubtitle: {
        margin: "0 0 26px 0",
        color: "#64748b",
    },

    tabs: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "8px",
        backgroundColor: "#e0e7ff",
        padding: "6px",
        borderRadius: "16px",
        marginBottom: "24px",
    },

    tab: {
        border: "none",
        backgroundColor: "transparent",
        color: "#334155",
        padding: "12px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    activeTab: {
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        padding: "12px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    label: {
        fontWeight: "bold",
        color: "#334155",
    },

    input: {
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        boxSizing: "border-box",
    },

    submitButton: {
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: "14px",
        backgroundColor: "#2563eb",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
    },

    smallText: {
        margin: 0,
        textAlign: "center",
        color: "#64748b",
    },
};
