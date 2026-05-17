import { useEffect, useState } from "react";

export default function PregledInstruktora({ onLogout }) {
    const [instructors, setInstructors] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchInstructors();
    }, []);

    const getToken = () => localStorage.getItem("token");

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    const fetchInstructors = async () => {
        try {
            setLoading(true);

            const response = await fetch("http://localhost:8080/api/resources/instructors", {
                method: "GET",
                headers: authHeaders(),
            });

            if (response.status === 401 || response.status === 403) {
                alert("Sesija je istekla. Prijavi se ponovno.");
                logout();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setInstructors(data);
            } else {
                console.error(data);
                alert("Greška kod dohvaćanja instruktora.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfilesForInstructor = async (instructor) => {
        const username = getInstructorUsername(instructor);

        if (!username) {
            alert("Instruktor nema korisničko ime pa nije moguće dohvatiti profil.");
            return;
        }

        try {
            setProfileLoading(true);
            setSelectedInstructor(instructor);
            setProfiles([]);

            const response = await fetch(
                `http://localhost:8080/api/resources/profiles/${username}`,
                {
                    method: "GET",
                    headers: authHeaders(),
                }
            );

            if (response.status === 401 || response.status === 403) {
                alert("Sesija je istekla. Prijavi se ponovno.");
                logout();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setProfiles(data);
            } else {
                console.error(data);
                alert("Greška kod dohvaćanja profila instruktora.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setProfileLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        if (onLogout) {
            onLogout();
        }
    };

    const filteredInstructors = instructors.filter((instructor) => {
        const username = getInstructorUsername(instructor).toLowerCase();
        const email = getInstructorEmail(instructor).toLowerCase();
        const phone = getInstructorPhone(instructor).toLowerCase();

        return (
            username.includes(search.toLowerCase()) ||
            email.includes(search.toLowerCase()) ||
            phone.includes(search.toLowerCase())
        );
    });

    if (selectedInstructor) {
        return (
            <InstructorProfile
                instructor={selectedInstructor}
                profiles={profiles}
                loading={profileLoading}
                onBack={() => {
                    setSelectedInstructor(null);
                    setProfiles([]);
                }}
                onLogout={logout}
            />
        );
    }

    return (
        <div style={styles.page}>
            <Navbar onLogout={logout} />

            <main style={styles.container}>
                <h2 style={styles.title}>Pregled instruktora</h2>

                <input
                    type="text"
                    placeholder="Pretraži instruktore"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.searchInput}
                />

                {loading ? (
                    <div style={styles.messageBox}>Učitavanje instruktora...</div>
                ) : filteredInstructors.length === 0 ? (
                    <div style={styles.messageBox}>Nema instruktora za prikaz.</div>
                ) : (
                    <div style={styles.cardsContainer}>
                        {filteredInstructors.map((instructor, index) => (
                            <InstructorCard
                                key={getInstructorId(instructor) || index}
                                instructor={instructor}
                                onOpenProfile={() => fetchProfilesForInstructor(instructor)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

function Navbar({ onLogout }) {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logoSection}>
                <button style={styles.menuButton}>☰</button>
                <h1 style={styles.logo}>EduConnect</h1>
            </div>

            <div style={styles.navButtons}>
                <button
                    style={styles.profileButton}
                    onClick={() => alert("Ovdje ćemo spojiti stranicu za uređivanje profila.")}
                >
                    Uredi profil
                </button>

                <button style={styles.logoutButton} onClick={onLogout}>
                    Odjava
                </button>
            </div>
        </nav>
    );
}

function InstructorCard({ instructor, onOpenProfile }) {
    const username = getInstructorUsername(instructor);
    const email = getInstructorEmail(instructor);
    const phone = getInstructorPhone(instructor);
    const age = getInstructorAge(instructor);

    return (
        <article style={styles.card}>
            <div style={styles.avatar}>{username ? username.charAt(0).toUpperCase() : "I"}</div>

            <h3 style={styles.cardTitle}>{username || "Instruktor"}</h3>

            <div style={styles.infoSection}>
                {email && <p>📧 {email}</p>}
                {phone && <p>📞 {phone}</p>}
                {age && <p>🎂 {age} godina</p>}
            </div>

            <button style={styles.profileViewButton} onClick={onOpenProfile}>
                Pogledaj profil
            </button>
        </article>
    );
}

function InstructorProfile({ instructor, profiles, loading, onBack, onLogout }) {
    const username = getInstructorUsername(instructor);
    const email = getInstructorEmail(instructor);
    const phone = getInstructorPhone(instructor);
    const age = getInstructorAge(instructor);

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.logoSection}>
                    <button style={styles.menuButton}>☰</button>
                    <h1 style={styles.logo}>EduConnect</h1>
                </div>

                <div style={styles.navButtons}>
                    <button style={styles.profileButton} onClick={onBack}>
                        Natrag
                    </button>

                    <button style={styles.logoutButton} onClick={onLogout}>
                        Odjava
                    </button>
                </div>
            </nav>

            <main style={styles.profileContainer}>
                <section style={styles.profileHeader}>
                    <div style={styles.largeAvatar}>{username ? username.charAt(0).toUpperCase() : "I"}</div>

                    <div>
                        <h2 style={styles.profileName}>{username || "Instruktor"}</h2>
                        <p style={styles.profileSubject}>Profil instruktora</p>

                        <div style={styles.profileMeta}>
                            {email && <p>📧 {email}</p>}
                            {phone && <p>📞 {phone}</p>}
                            {age && <p>🎂 {age} godina</p>}
                        </div>
                    </div>
                </section>

                <section style={styles.profileCard}>
                    <h3 style={styles.sectionTitle}>Predmeti i cijene</h3>

                    {loading ? (
                        <p style={styles.emptyText}>Učitavanje profila...</p>
                    ) : profiles.length === 0 ? (
                        <p style={styles.emptyText}>Ovaj instruktor još nema kreiran profil.</p>
                    ) : (
                        <div style={styles.profileGrid}>
                            {profiles.map((profile, index) => (
                                <ProfileItem key={profile.id || index} profile={profile} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function ProfileItem({ profile }) {
    const subject = getProfileSubject(profile);
    const price = getProfilePrice(profile);
    const description = getProfileDescription(profile);

    return (
        <div style={styles.infoBox}>
            <p style={styles.infoLabel}>Predmet</p>
            <p style={styles.infoValue}>{subject || "Nije uneseno"}</p>

            <p style={styles.infoLabel}>Cijena</p>
            <p style={styles.infoValue}>{price ? `${price} €/h` : "Nije uneseno"}</p>

            {description && <p style={styles.profileDescription}>{description}</p>}
        </div>
    );
}

function getInstructorId(instructor) {
    return instructor.id || instructor.instructorId || instructor.userId || "";
}

function getInstructorUsername(instructor) {
    return (
        instructor.username ||
        instructor.name ||
        instructor.user?.username ||
        instructor.userName ||
        ""
    );
}

function getInstructorEmail(instructor) {
    return instructor.email || instructor.user?.email || "";
}

function getInstructorPhone(instructor) {
    return instructor.phone || instructor.phoneNumber || "";
}

function getInstructorAge(instructor) {
    return instructor.age || "";
}

function getProfileSubject(profile) {
    return profile.subject || profile.subjectName || profile.subject?.name || profile.name || "";
}

function getProfilePrice(profile) {
    return profile.price || profile.hourlyPrice || "";
}

function getProfileDescription(profile) {
    return profile.description || "";
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
    },

    navbar: {
        backgroundColor: "#1976d2",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
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

    navButtons: {
        display: "flex",
        gap: "10px",
    },

    profileButton: {
        backgroundColor: "#1565c0",
        border: "none",
        color: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    logoutButton: {
        backgroundColor: "#e53935",
        border: "none",
        color: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },

    container: {
        width: "100%",
        minHeight: "calc(100vh - 70px)",
        padding: "40px",
        boxSizing: "border-box",
    },

    title: {
        fontSize: "42px",
        marginBottom: "30px",
        color: "#0f172a",
        textAlign: "center",
    },

    searchInput: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        marginBottom: "30px",
        fontSize: "16px",
        boxSizing: "border-box",
    },

    cardsContainer: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "24px",
    },

    card: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },

    avatar: {
        width: "60px",
        height: "60px",
        borderRadius: "16px",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "16px",
    },

    cardTitle: {
        margin: "0 0 8px 0",
        fontSize: "26px",
    },

    infoSection: {
        color: "#475569",
        lineHeight: "1.8",
        marginBottom: "20px",
    },

    profileViewButton: {
        width: "100%",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "14px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
    },

    messageBox: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "30px",
        textAlign: "center",
        color: "#475569",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },

    profileContainer: {
        width: "100%",
        padding: "40px",
        boxSizing: "border-box",
    },

    profileHeader: {
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "32px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        display: "flex",
        gap: "28px",
        alignItems: "center",
        marginBottom: "24px",
    },

    largeAvatar: {
        width: "100px",
        height: "100px",
        borderRadius: "28px",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "46px",
        fontWeight: "bold",
        flexShrink: 0,
    },

    profileName: {
        margin: "0 0 8px 0",
        fontSize: "42px",
        color: "#0f172a",
    },

    profileSubject: {
        margin: "0 0 16px 0",
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: "20px",
    },

    profileMeta: {
        color: "#475569",
        lineHeight: "1.7",
    },

    profileCard: {
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "28px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        marginBottom: "24px",
    },

    sectionTitle: {
        margin: "0 0 18px 0",
        fontSize: "28px",
        color: "#0f172a",
    },

    profileGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "20px",
    },

    infoBox: {
        backgroundColor: "#f8fafc",
        borderRadius: "20px",
        padding: "22px",
        border: "1px solid #e2e8f0",
    },

    infoLabel: {
        margin: "0 0 8px 0",
        color: "#64748b",
    },

    infoValue: {
        margin: "0 0 16px 0",
        color: "#0f172a",
        fontSize: "22px",
        fontWeight: "bold",
    },

    profileDescription: {
        margin: "12px 0 0 0",
        color: "#475569",
        lineHeight: "1.6",
    },

    emptyText: {
        color: "#64748b",
        margin: 0,
    },
};