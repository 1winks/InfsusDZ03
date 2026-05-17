import { useState } from "react";

export default function OstaviRecenziju({ instructor, onBack, onLogout }) {
    const [reviewData, setReviewData] = useState({
        rating: "5",
        comment: "",
    });

    const instructorName = getInstructorUsername(instructor);
    const instructorEmail = getInstructorEmail(instructor);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!reviewData.rating) {
            alert("Ocjena je obavezna.");
            return;
        }

        if (!reviewData.comment.trim()) {
            alert("Komentar je obavezan.");
            return;
        }

        const reviewer = localStorage.getItem("username");
        const reviewed = instructorName;

        if (reviewer === reviewed) {
            alert("Ne možeš sam sebi ostaviti recenziju.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/resources/reviews/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    comment: reviewData.comment,
                    score: Number(reviewData.rating),
                    reviewer: reviewer,
                    reviewed: reviewed,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                alert("Sesija je istekla. Prijavi se ponovno.");
                localStorage.removeItem("token");
                localStorage.removeItem("username");

                if (onLogout) {
                    onLogout();
                }

                return;
            }

            if (response.ok) {
                alert("Recenzija je spremljena.");

                setReviewData({
                    rating: "5",
                    comment: "",
                });

                if (onBack) {
                    onBack();
                }
            } else {
                const error = await response.text();
                alert(error || "Greška kod spremanja recenzije.");
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
                    <h1 style={styles.logo}>EduConnect</h1>
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
                    <h2 style={styles.title}>Ostavi recenziju</h2>
                    <p style={styles.subtitle}>
                        Ocijeni instruktora i napiši kratki komentar o iskustvu.
                    </p>
                </section>

                <section style={styles.contentGrid}>
                    <article style={styles.instructorCard}>
                        <div style={styles.avatar}>
                            {instructorName ? instructorName.charAt(0).toUpperCase() : "I"}
                        </div>

                        <h3 style={styles.instructorName}>{instructorName || "Instruktor"}</h3>
                        <p style={styles.instructorLabel}>Instruktor</p>

                        {instructorEmail && <p style={styles.instructorInfo}>📧 {instructorEmail}</p>}
                        {instructor?.phone && <p style={styles.instructorInfo}>📞 {instructor.phone}</p>}
                        {instructor?.age && <p style={styles.instructorInfo}>🎂 {instructor.age} godina</p>}
                    </article>

                    <form style={styles.formCard} onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Ocjena</label>
                            <select
                                value={reviewData.rating}
                                onChange={(e) =>
                                    setReviewData({ ...reviewData, rating: e.target.value })
                                }
                                style={styles.input}
                            >
                                <option value="5">5 - Odlično</option>
                                <option value="4">4 - Vrlo dobro</option>
                                <option value="3">3 - Dobro</option>
                                <option value="2">2 - Dovoljno</option>
                                <option value="1">1 - Loše</option>
                            </select>
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Komentar</label>
                            <textarea
                                value={reviewData.comment}
                                onChange={(e) =>
                                    setReviewData({ ...reviewData, comment: e.target.value })
                                }
                                placeholder="Napiši svoje iskustvo s instruktorom"
                                rows="8"
                                style={styles.textarea}
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            Spremi recenziju
                        </button>
                    </form>
                </section>
            </main>
        </div>
    );
}

function getInstructorUsername(instructor) {
    return (
        instructor?.username ||
        instructor?.name ||
        instructor?.user?.username ||
        instructor?.userName ||
        ""
    );
}

function getInstructorEmail(instructor) {
    return instructor?.email || instructor?.user?.email || "";
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
        textAlign: "center",
        marginBottom: "32px",
    },

    title: {
        fontSize: "42px",
        margin: "0 0 10px 0",
    },

    subtitle: {
        margin: 0,
        color: "#475569",
        fontSize: "17px",
    },

    contentGrid: {
        display: "grid",
        gridTemplateColumns: "360px 1fr",
        gap: "24px",
        width: "100%",
    },

    instructorCard: {
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "30px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        height: "fit-content",
    },

    avatar: {
        width: "90px",
        height: "90px",
        borderRadius: "24px",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "42px",
        fontWeight: "bold",
        marginBottom: "18px",
    },

    instructorName: {
        margin: "0 0 8px 0",
        fontSize: "30px",
    },

    instructorLabel: {
        margin: "0 0 20px 0",
        color: "#2563eb",
        fontWeight: "bold",
    },

    instructorInfo: {
        color: "#475569",
        lineHeight: "1.7",
    },

    formCard: {
        backgroundColor: "white",
        borderRadius: "24px",
        padding: "30px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
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
        backgroundColor: "white",
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
};
