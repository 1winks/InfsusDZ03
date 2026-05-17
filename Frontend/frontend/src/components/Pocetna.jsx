import { useState } from "react";

export default function Pocetna() {
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

                localStorage.setItem("token", data.accessToken);
                localStorage.setItem("username", data.username);

                console.log("Login response:", data);
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-5 relative overflow-hidden">
            <div className="absolute w-80 h-80 bg-blue-300 rounded-full blur-3xl opacity-40 -top-24 -left-24"></div>
            <div className="absolute w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-40 -bottom-28 -right-28"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_420px] max-w-6xl w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[28px] overflow-hidden shadow-2xl">
                <section className="hidden lg:flex flex-col justify-center p-16 text-white">
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        Pronađi najboljeg instruktora online
                    </h1>

                    <p className="text-lg leading-8 text-white/90 max-w-xl mb-10">
                        EduConnect povezuje učenike i instruktore za matematiku,
                        programiranje, jezike i druge predmete. Uči brzo, jednostavno i
                        kvalitetno.
                    </p>

                    <div className="flex flex-col gap-5">
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
                </section>

                <section className="bg-white p-9 sm:p-12 flex flex-col justify-center">
                    <div className="text-3xl font-extrabold text-blue-600 mb-2">
                        EduConnect
                    </div>

                    <p className="text-gray-500 mb-8">
                        Sustav za pronalaženje instruktora
                    </p>

                    <div className="grid grid-cols-2 bg-indigo-50 rounded-2xl p-1 mb-7">
                        <button
                            type="button"
                            onClick={() => setActiveForm("login")}
                            className={`py-3 rounded-xl font-bold transition ${activeForm === "login"
                                ? "bg-blue-600 text-white"
                                : "text-gray-700"
                                }`}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveForm("register")}
                            className={`py-3 rounded-xl font-bold transition ${activeForm === "register"
                                ? "bg-blue-600 text-white"
                                : "text-gray-700"
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {activeForm === "login" ? (
                        <form onSubmit={handleLogin} className="space-y-5">
                            <Input
                                label="Korisničko ime"
                                type="text"
                                placeholder="Unesi korisničko ime"
                                value={loginData.username}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        username: e.target.value,
                                    })
                                }
                            />

                            <Input
                                label="Lozinka"
                                type="password"
                                placeholder="Unesi lozinku"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    })
                                }
                            />

                            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:-translate-y-0.5 hover:shadow-lg transition">
                                Prijavi se
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Zaboravljena lozinka?
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-5">
                            <Input
                                label="Korisničko ime"
                                type="text"
                                placeholder="Unesi korisničko ime"
                                value={registerData.username}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        username: e.target.value,
                                    })
                                }
                            />

                            <Input
                                label="Email"
                                type="email"
                                placeholder="Unesi email"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        email: e.target.value,
                                    })
                                }
                            />

                            <Input
                                label="Lozinka"
                                type="password"
                                placeholder="Kreiraj lozinku"
                                value={registerData.password}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        password: e.target.value,
                                    })
                                }
                            />

                            <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:-translate-y-0.5 hover:shadow-lg transition">
                                Kreiraj račun
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
}

function Input({ label, type, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
                {label}
            </label>

            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
        </div>
    );
}

function Feature({ icon, title, children }) {
    return (
        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl">
            <div className="w-11 h-11 bg-white text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg">
                {icon}
            </div>

            <div>
                <strong>{title}</strong>
                <br />
                <span>{children}</span>
            </div>
        </div>
    );
}