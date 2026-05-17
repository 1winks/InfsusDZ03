import { useEffect, useState } from "react";

export default function LessonsPage({ onBack, onLogout }) {
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("date-asc");
    const [filterType, setFilterType] = useState("all");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const username = localStorage.getItem("username") || "";

    const [newLesson, setNewLesson] = useState({
        topic: "",
        date: "",
        teacher: username,
        student: "",
    });

    useEffect(() => {
        fetchLessons();
    }, []);

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    const handleUnauthorized = () => {
        alert("Sesija je istekla. Prijavi se ponovno.");
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        localStorage.removeItem("role");

        if (onLogout) {
            onLogout();
        }
    };

    const fetchLessons = async () => {
        try {
            setLoading(true);

            const username = localStorage.getItem("username");

            if (!username) {
                handleUnauthorized();
                return;
            }

            const [taughtResponse, listenedResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/resources/lessons/taught/${username}`, {
                    method: "GET",
                    headers: authHeaders(),
                }),
                fetch(`http://localhost:8080/api/resources/lessons/listened/${username}`, {
                    method: "GET",
                    headers: authHeaders(),
                }),
            ]);

            if (
                taughtResponse.status === 401 ||
                taughtResponse.status === 403 ||
                listenedResponse.status === 401 ||
                listenedResponse.status === 403
            ) {
                handleUnauthorized();
                return;
            }

            const taughtData = taughtResponse.ok ? await taughtResponse.json() : [];
            const listenedData = listenedResponse.ok ? await listenedResponse.json() : [];

            const allLessons = [
                ...taughtData.map((lesson, index) => ({
                    ...lesson,
                    id: `taught-${index}-${getLessonTopic(lesson)}-${getLessonDate(lesson)}`,
                    type: "taught",
                    typeLabel: "Predaješ",
                })),
                ...listenedData.map((lesson, index) => ({
                    ...lesson,
                    id: `listened-${index}-${getLessonTopic(lesson)}-${getLessonDate(lesson)}`,
                    type: "listened",
                    typeLabel: "Slušaš",
                })),
            ];

            setLessons(allLessons);
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoading(false);
        }
    };

    const createLesson = async (e) => {
        e.preventDefault();

        if (!newLesson.topic || !newLesson.date || !newLesson.student) {
            alert("Tema, datum i student su obavezni.");
            return;
        }

        try {
            console.log("TOKEN:", localStorage.getItem("token"));
            console.log("LESSON BODY:", {
                topic: newLesson.topic,
                date: newLesson.date,
                teacher: username,
                student: newLesson.student,
            });
            const response = await fetch("http://localhost:8080/api/resources/lessons/create", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                    topic: newLesson.topic,
                    date: newLesson.date,
                    teacher: localStorage.getItem("username"),
                    student: newLesson.student,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Lesson je uspješno kreiran.");

                setNewLesson({
                    topic: "",
                    date: "",
                    teacher: username,
                    student: "",
                });

                setShowCreateForm(false);
                fetchLessons();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod kreiranja lesson-a.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        }
    };

    const deleteLesson = async (lesson) => {
        const confirmed = window.confirm(
            `Jesi li siguran da želiš obrisati lesson: ${getLessonTopic(lesson)}?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch("http://localhost:8080/api/resources/lessons/delete", {
                method: "DELETE",
                headers: authHeaders(),
                body: JSON.stringify({
                    date: getLessonDate(lesson),
                    topic: getLessonTopic(lesson),
                    teacher: getLessonTeacher(lesson),
                    student: getLessonStudent(lesson),
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Lesson je obrisan.");
                fetchLessons();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod brisanja lesson-a.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        }
    };

    const filteredLessons = lessons
        .filter((lesson) => {
            if (filterType !== "all" && lesson.type !== filterType) {
                return false;
            }

            const topic = getLessonTopic(lesson).toLowerCase();
            const teacher = getLessonTeacher(lesson).toLowerCase();
            const student = getLessonStudent(lesson).toLowerCase();
            const typeLabel = (lesson.typeLabel || "").toLowerCase();
            const query = search.toLowerCase();

            return (
                topic.includes(query) ||
                teacher.includes(query) ||
                student.includes(query) ||
                typeLabel.includes(query)
            );
        })
        .sort((a, b) => {
            const dateA = new Date(getLessonDate(a)).getTime() || 0;
            const dateB = new Date(getLessonDate(b)).getTime() || 0;
            const topicA = getLessonTopic(a).toLowerCase();
            const topicB = getLessonTopic(b).toLowerCase();

            if (sortBy === "date-asc") return dateA - dateB;
            if (sortBy === "date-desc") return dateB - dateA;
            if (sortBy === "topic-asc") return topicA.localeCompare(topicB);
            if (sortBy === "topic-desc") return topicB.localeCompare(topicA);

            return 0;
        });

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
                    <h2 style={styles.title}>Lessons</h2>
                    <p style={styles.subtitle}>Pregled instrukcija koje predaješ i koje slušaš.</p>
                </section>

                <div style={styles.topActions}>
                    <button
                        type="button"
                        style={styles.createButton}
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? "Zatvori formu" : "Dodaj lesson"}
                    </button>
                </div>

                {showCreateForm && (
                    <form style={styles.createForm} onSubmit={createLesson}>
                        <h3 style={styles.formTitle}>Kreiraj novi lesson</h3>

                        <div style={styles.formGrid}>
                            <input
                                type="text"
                                placeholder="Tema lesson-a"
                                value={newLesson.topic}
                                onChange={(e) =>
                                    setNewLesson({ ...newLesson, topic: e.target.value })
                                }
                                style={styles.searchInput}
                            />

                            <input
                                type="date"
                                value={newLesson.date}
                                onChange={(e) =>
                                    setNewLesson({ ...newLesson, date: e.target.value })
                                }
                                style={styles.searchInput}
                            />

                            <input
                                type="text"
                                placeholder="Username učenika"
                                value={newLesson.student}
                                onChange={(e) =>
                                    setNewLesson({ ...newLesson, student: e.target.value })
                                }
                                style={styles.searchInput}
                            />
                        </div>

                        <button type="submit" style={styles.submitButton}>
                            Kreiraj lesson
                        </button>
                    </form>
                )}

                <section style={styles.controls}>
                    <input
                        type="text"
                        placeholder="Pretraži po temi, instruktoru ili učeniku"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />

                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={styles.sortSelect}
                    >
                        <option value="all">Sve lekcije</option>
                        <option value="taught">Predajem</option>
                        <option value="listened">Slušam</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={styles.sortSelect}
                    >
                        <option value="date-asc">Datum: najranije prvo</option>
                        <option value="date-desc">Datum: najkasnije prvo</option>
                        <option value="topic-asc">Tema A-Z</option>
                        <option value="topic-desc">Tema Z-A</option>
                    </select>
                </section>

                {loading ? (
                    <div style={styles.messageBox}>Učitavanje lessons...</div>
                ) : filteredLessons.length === 0 ? (
                    <div style={styles.messageBox}>Nema lessons za prikaz.</div>
                ) : (
                    <section style={styles.cardsGrid}>
                        {filteredLessons.map((lesson) => (
                            <LessonCard
                                key={lesson.id}
                                lesson={lesson}
                                onDelete={() => deleteLesson(lesson)}
                            />
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
}

function LessonCard({ lesson, onDelete }) {
    const topic = getLessonTopic(lesson);
    const date = getLessonDate(lesson);
    const teacher = getLessonTeacher(lesson);
    const student = getLessonStudent(lesson);

    return (
        <article style={styles.card}>
            <div style={styles.cardHeader}>
                <div style={styles.iconBox}>📘</div>

                <div>
                    <h3 style={styles.cardTitle}>{topic || "Lesson"}</h3>
                    <p style={lesson.type === "taught" ? styles.badgeTaught : styles.badgeListened}>
                        {lesson.typeLabel}
                    </p>
                </div>
            </div>

            <div style={styles.lessonInfo}>
                {date && <p>📅 Datum: {formatDate(date)}</p>}
                {teacher && <p>👨‍🏫 Instruktor: {teacher}</p>}
                {student && <p>👤 Učenik: {student}</p>}
            </div>

            <button type="button" style={styles.deleteButton} onClick={onDelete}>
                Obriši lesson
            </button>
        </article>
    );
}

function getLessonTopic(lesson) {
    return lesson.topic || lesson.lessonTopic || lesson.title || "";
}

function getLessonDate(lesson) {
    return lesson.date || lesson.lessonDate || "";
}

function getLessonTeacher(lesson) {
    return (
        lesson.teacher ||
        lesson.teacherName ||
        lesson.instructor ||
        lesson.instructorName ||
        lesson.instructor?.username ||
        lesson.teacher?.username ||
        ""
    );
}

function getLessonStudent(lesson) {
    return (
        lesson.student ||
        lesson.studentName ||
        lesson.user ||
        lesson.userName ||
        lesson.student?.username ||
        lesson.user?.username ||
        ""
    );
}

function formatDate(dateValue) {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleDateString("hr-HR");
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
        marginBottom: "30px",
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

    controls: {
        display: "grid",
        gridTemplateColumns: "1fr 220px 240px",
        gap: "16px",
        marginBottom: "30px",
    },

    searchInput: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        boxSizing: "border-box",
    },

    sortSelect: {
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        backgroundColor: "white",
        boxSizing: "border-box",
    },

    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "24px",
    },

    card: {
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },

    cardHeader: {
        display: "flex",
        gap: "16px",
        alignItems: "center",
        marginBottom: "20px",
    },

    iconBox: {
        width: "60px",
        height: "60px",
        borderRadius: "16px",
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "28px",
        flexShrink: 0,
    },

    cardTitle: {
        margin: "0 0 8px 0",
        fontSize: "26px",
    },

    badgeTaught: {
        display: "inline-block",
        margin: 0,
        backgroundColor: "#dcfce7",
        color: "#166534",
        padding: "8px 12px",
        borderRadius: "999px",
        fontWeight: "bold",
    },

    badgeListened: {
        display: "inline-block",
        margin: 0,
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        padding: "8px 12px",
        borderRadius: "999px",
        fontWeight: "bold",
    },

    lessonInfo: {
        color: "#475569",
        lineHeight: "1.8",
        marginBottom: "20px",
    },

    deleteButton: {
        width: "100%",
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "14px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
    },

    topActions: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
    },

    createButton: {
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        padding: "14px 22px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
    },

    createForm: {
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "20px",
        marginBottom: "28px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    },

    formTitle: {
        marginTop: 0,
        marginBottom: "18px",
        fontSize: "28px",
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
        marginBottom: "18px",
    },

    submitButton: {
        backgroundColor: "#16a34a",
        color: "white",
        border: "none",
        padding: "14px 20px",
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
};
