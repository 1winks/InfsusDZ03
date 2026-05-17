import { useEffect, useState } from "react";

export default function EditProfile({ onBack, onLogout }) {
    const username = localStorage.getItem("username") || "";

    const [subjects, setSubjects] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [reviews, setReviews] = useState([]);

    const [instructorData, setInstructorData] = useState({
        name: username,
        age: "",
        phone: "",
        active: true,
    });

    const [profileData, setProfileData] = useState({
        name: username,
        subject: "",
        description: "",
        price: "",
    });

    const [editingProfile, setEditingProfile] = useState(null);

    const [loadingInstructor, setLoadingInstructor] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [loadingExistingProfiles, setLoadingExistingProfiles] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
        fetchSubjects();
        fetchInstructorData();
        fetchInstructorProfiles();
        fetchMyReviews();
    }, []);

    const getToken = () => localStorage.getItem("token");

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
    });

    const handleUnauthorized = () => {
        alert("Sesija je istekla. Prijavi se ponovno.");
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        if (onLogout) {
            onLogout();
        }
    };

    const fetchSubjects = async () => {
        try {
            setLoadingSubjects(true);

            const response = await fetch("http://localhost:8080/api/resources/subjects", {
                method: "GET",
                headers: authHeaders(),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setSubjects(data);
            } else {
                console.error(data);
                alert("Greška kod dohvaćanja predmeta.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoadingSubjects(false);
        }
    };

    const fetchInstructorData = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/resources/instructors", {
                method: "GET",
                headers: authHeaders(),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                const currentInstructor = data.find(
                    (instructor) => getInstructorName(instructor) === username
                );

                if (currentInstructor) {
                    setInstructorData({
                        name: username,
                        age: currentInstructor.age || "",
                        phone: currentInstructor.phone || "",
                        active: true,
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchInstructorProfiles = async () => {
        try {
            setLoadingExistingProfiles(true);

            const response = await fetch(
                `http://localhost:8080/api/resources/profiles/${username}`,
                {
                    method: "GET",
                    headers: authHeaders(),
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setProfiles(data);
            } else {
                console.error(data);
                alert("Greška kod dohvaćanja profila instrukcija.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoadingExistingProfiles(false);
        }
    };

    const fetchMyReviews = async () => {
        try {
            setLoadingReviews(true);

            const response = await fetch(
                `http://localhost:8080/api/resources/reviews/${username}`,
                {
                    method: "GET",
                    headers: authHeaders(),
                }
            );

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setReviews(data);
            } else {
                console.error(data);
                alert("Greška kod dohvaćanja recenzija.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoadingReviews(false);
        }
    };

    const updateInstructor = async (e) => {
        e.preventDefault();

        try {
            setLoadingInstructor(true);

            const response = await fetch("http://localhost:8080/api/resources/instructors/update", {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: instructorData.name,
                    age: instructorData.age ? Number(instructorData.age) : null,
                    phone: instructorData.phone,
                    active: instructorData.active,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Profil instruktora je ažuriran.");
                fetchInstructorData();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod ažuriranja profila instruktora.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoadingInstructor(false);
        }
    };

    const createProfile = async (e) => {
        e.preventDefault();

        if (!profileData.subject || !profileData.price) {
            alert("Predmet i cijena su obavezni.");
            return;
        }

        try {
            setLoadingProfile(true);

            const response = await fetch("http://localhost:8080/api/resources/profiles/create", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: profileData.name,
                    subject: profileData.subject,
                    description: profileData.description,
                    price: Number(profileData.price),
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Profil instrukcija je kreiran.");
                setProfileData({
                    name: username,
                    subject: "",
                    description: "",
                    price: "",
                });
                fetchInstructorProfiles();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod kreiranja profila instrukcija.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const startEditProfile = (profile) => {
        setEditingProfile({
            name: username,
            subject: getProfileSubject(profile),
            description: profile.description || "",
            price: profile.price || "",
        });
    };

    const updateProfile = async (e) => {
        e.preventDefault();

        if (!editingProfile.subject || !editingProfile.price) {
            alert("Predmet i cijena su obavezni.");
            return;
        }

        try {
            setLoadingProfile(true);

            const response = await fetch("http://localhost:8080/api/resources/profiles/update", {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: editingProfile.name,
                    subject: editingProfile.subject,
                    description: editingProfile.description,
                    price: Number(editingProfile.price),
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Profil instrukcija je ažuriran.");
                setEditingProfile(null);
                fetchInstructorProfiles();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod uređivanja profila instrukcija.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const deleteProfile = async (profile) => {
        const subject = getProfileSubject(profile);

        const confirmed = window.confirm(
            `Jesi li siguran da želiš obrisati profil za predmet: ${subject}?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch("http://localhost:8080/api/resources/profiles/delete", {
                method: "DELETE",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: username,
                    subject: subject,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Profil instrukcija je obrisan.");
                fetchInstructorProfiles();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod brisanja profila instrukcija.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        }
    };

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.logoSection}>
                    <button type="button" style={styles.menuButton}>☰</button>
                    <h1 style={styles.logo}>PINSUS</h1>
                </div>

                <div style={styles.navButtons}>
                    <button type="button" style={styles.profileButton} onClick={onBack}>
                        Natrag
                    </button>

                    <button type="button" style={styles.logoutButton} onClick={onLogout}>
                        Odjava
                    </button>
                </div>
            </nav>

            <main style={styles.container}>
                <section style={styles.header}>
                    <h2 style={styles.title}>Uredi profil instruktora</h2>
                    <p style={styles.subtitle}>
                        Uredi osnovne podatke instruktora i upravljaj profilima instrukcija.
                    </p>
                </section>

                <section style={styles.grid}>
                    <form style={styles.card} onSubmit={updateInstructor}>
                        <h3 style={styles.cardTitle}>Osnovni podaci instruktora</h3>

                        <Input label="Korisničko ime" value={instructorData.name} disabled />

                        <Input
                            label="Dob"
                            type="number"
                            placeholder="npr. 22"
                            value={instructorData.age}
                            onChange={(e) =>
                                setInstructorData({ ...instructorData, age: e.target.value })
                            }
                        />

                        <Input
                            label="Broj mobitela"
                            placeholder="npr. 0911234567"
                            value={instructorData.phone}
                            onChange={(e) =>
                                setInstructorData({ ...instructorData, phone: e.target.value })
                            }
                        />

                        <label style={styles.checkboxRow}>
                            <input
                                type="checkbox"
                                checked={instructorData.active}
                                onChange={(e) =>
                                    setInstructorData({ ...instructorData, active: e.target.checked })
                                }
                            />
                            <span>Profil je aktivan i vidljiv korisnicima</span>
                        </label>

                        <button type="submit" style={styles.submitButton} disabled={loadingInstructor}>
                            {loadingInstructor ? "Spremanje..." : "Spremi osnovne podatke"}
                        </button>
                    </form>

                    <form style={styles.card} onSubmit={createProfile}>
                        <h3 style={styles.cardTitle}>Kreiraj novi profil instrukcija</h3>

                        <Input label="Instruktor" value={profileData.name} disabled />

                        <SubjectSelect
                            label="Predmet"
                            value={profileData.subject}
                            onChange={(e) =>
                                setProfileData({ ...profileData, subject: e.target.value })
                            }
                            subjects={subjects}
                            loading={loadingSubjects}
                        />

                        <Input
                            label="Cijena po satu"
                            type="number"
                            placeholder="npr. 15"
                            value={profileData.price}
                            onChange={(e) =>
                                setProfileData({ ...profileData, price: e.target.value })
                            }
                        />

                        <TextArea
                            label="Opis profila"
                            value={profileData.description}
                            onChange={(e) =>
                                setProfileData({ ...profileData, description: e.target.value })
                            }
                            placeholder="Napiši kratki opis instrukcija"
                        />

                        <button type="submit" style={styles.submitButton} disabled={loadingProfile}>
                            {loadingProfile ? "Kreiranje..." : "Kreiraj profil instrukcija"}
                        </button>
                    </form>
                </section>

                <section style={styles.existingProfilesSection}>
                    <h3 style={styles.sectionTitle}>Moji profili instrukcija</h3>

                    {loadingExistingProfiles ? (
                        <div style={styles.messageBox}>Učitavanje profila...</div>
                    ) : profiles.length === 0 ? (
                        <div style={styles.messageBox}>Još nemaš kreiranih profila instrukcija.</div>
                    ) : (
                        <div style={styles.profilesGrid}>
                            {profiles.map((profile, index) => (
                                <article key={`${getProfileSubject(profile)}-${index}`} style={styles.profileCard}>
                                    <h4 style={styles.profileSubject}>{getProfileSubject(profile)}</h4>
                                    <p style={styles.profilePrice}>{profile.price} €/h</p>
                                    <p style={styles.profileDescription}>
                                        {profile.description || "Nema opisa."}
                                    </p>

                                    <div style={styles.profileActions}>
                                        <button
                                            type="button"
                                            style={styles.editButton}
                                            onClick={() => startEditProfile(profile)}
                                        >
                                            Uredi
                                        </button>

                                        <button
                                            type="button"
                                            style={styles.deleteButton}
                                            onClick={() => deleteProfile(profile)}
                                        >
                                            Obriši
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section style={styles.existingProfilesSection}>
                    <h3 style={styles.sectionTitle}>Moje recenzije</h3>

                    {loadingReviews ? (
                        <div style={styles.messageBox}>Učitavanje recenzija...</div>
                    ) : reviews.length === 0 ? (
                        <div style={styles.messageBox}>Još nemaš recenzija.</div>
                    ) : (
                        <div style={styles.profilesGrid}>
                            {reviews.map((review, index) => (
                                <article key={`${getReviewReviewer(review)}-${index}`} style={styles.profileCard}>
                                    <div style={styles.reviewHeader}>
                                        <h4 style={styles.profileSubject}>
                                            ⭐ {getReviewScore(review)}
                                        </h4>

                                        <span style={styles.reviewerName}>
                                            {getReviewReviewer(review) || "Korisnik"}
                                        </span>
                                    </div>

                                    <p style={styles.profileDescription}>
                                        {getReviewComment(review) || "Nema komentara."}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {editingProfile && (
                    <section style={styles.editPanel}>
                        <form style={styles.card} onSubmit={updateProfile}>
                            <h3 style={styles.cardTitle}>Uredi profil: {editingProfile.subject}</h3>

                            <Input label="Instruktor" value={editingProfile.name} disabled />

                            <Input
                                label="Predmet"
                                value={editingProfile.subject}
                                disabled
                            />

                            <Input
                                label="Cijena po satu"
                                type="number"
                                value={editingProfile.price}
                                onChange={(e) =>
                                    setEditingProfile({ ...editingProfile, price: e.target.value })
                                }
                            />

                            <TextArea
                                label="Opis profila"
                                value={editingProfile.description}
                                onChange={(e) =>
                                    setEditingProfile({ ...editingProfile, description: e.target.value })
                                }
                            />

                            <div style={styles.profileActions}>
                                <button type="submit" style={styles.submitButton} disabled={loadingProfile}>
                                    {loadingProfile ? "Spremanje..." : "Spremi promjene"}
                                </button>

                                <button
                                    type="button"
                                    style={styles.cancelButton}
                                    onClick={() => setEditingProfile(null)}
                                >
                                    Odustani
                                </button>
                            </div>
                        </form>
                    </section>
                )}
            </main>
        </div>
    );
}

function Input({ label, type = "text", placeholder, value, onChange, disabled = false }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={{
                    ...styles.input,
                    backgroundColor: disabled ? "#e2e8f0" : "white",
                    cursor: disabled ? "not-allowed" : "text",
                }}
            />
        </div>
    );
}

function TextArea({ label, placeholder, value, onChange }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <textarea
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows="6"
                style={styles.textarea}
            />
        </div>
    );
}

function SubjectSelect({ label, value, onChange, subjects, loading }) {
    return (
        <div style={styles.inputGroup}>
            <label style={styles.label}>{label}</label>
            <select value={value} onChange={onChange} style={styles.input} disabled={loading}>
                <option value="">
                    {loading ? "Učitavanje predmeta..." : "Odaberi predmet"}
                </option>

                {subjects.map((subject, index) => {
                    const subjectName = subject.name || subject.subjectName || subject;

                    return (
                        <option key={subject.id || index} value={subjectName}>
                            {subjectName}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

function getInstructorName(instructor) {
    return instructor.name || instructor.username || instructor.user?.username || "";
}

function getProfileSubject(profile) {
    return profile.subject || profile.subjectName || profile.subject?.name || "";
}

function getReviewReviewer(review) {
    return review.reviewer || review.reviewerName || review.user || "";
}

function getReviewScore(review) {
    return review.score || review.rating || "";
}

function getReviewComment(review) {
    return review.comment || review.reviewComment || "";
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
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
        padding: "40px",
        boxSizing: "border-box",
    },

    header: {
        marginBottom: "30px",
        textAlign: "center",
    },

    title: {
        fontSize: "42px",
        margin: "0 0 10px 0",
        color: "#0f172a",
    },

    subtitle: {
        margin: 0,
        color: "#475569",
        fontSize: "17px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
        gap: "24px",
        width: "100%",
    },

    card: {
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "30px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
    },

    cardTitle: {
        margin: "0 0 8px 0",
        fontSize: "28px",
        color: "#0f172a",
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

    textarea: {
        width: "100%",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        resize: "vertical",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
    },

    checkboxRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#334155",
        fontWeight: "bold",
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
        marginTop: "8px",
    },

    existingProfilesSection: {
        marginTop: "34px",
    },

    sectionTitle: {
        fontSize: "32px",
        margin: "0 0 18px 0",
    },

    profilesGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
    },

    profileCard: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },

    profileSubject: {
        margin: "0 0 8px 0",
        color: "#2563eb",
        fontSize: "24px",
        fontWeight: "bold",
    },

    profilePrice: {
        margin: "0 0 12px 0",
        color: "#0f172a",
        fontSize: "20px",
        fontWeight: "bold",
    },

    profileDescription: {
        color: "#475569",
        lineHeight: "1.6",
        minHeight: "48px",
    },

    profileActions: {
        display: "flex",
        gap: "10px",
        marginTop: "16px",
    },

    reviewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        marginBottom: "12px",
    },

    reviewerName: {
        color: "#64748b",
        fontWeight: "bold",
    },

    editButton: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "#2563eb",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },

    deleteButton: {
        flex: 1,
        padding: "12px",
        border: "none",
        borderRadius: "12px",
        backgroundColor: "#e53935",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
    },

    cancelButton: {
        width: "100%",
        padding: "15px",
        border: "none",
        borderRadius: "14px",
        backgroundColor: "#64748b",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        marginTop: "8px",
    },

    editPanel: {
        marginTop: "34px",
    },

    messageBox: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "30px",
        textAlign: "center",
        color: "#475569",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },
};
