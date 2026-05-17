import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";
import OstaviRecenziju from "./OstaviRecenziju";
import LessonsPage from "./LessonsPage";

export default function PregledInstruktora({ onLogout }) {
    const [instructors, setInstructors] = useState([]);
    const [profileCards, setProfileCards] = useState([]);
    const [selectedInstructor, setSelectedInstructor] = useState(null);
    const [selectedInstructorProfiles, setSelectedInstructorProfiles] = useState([]);
    const [selectedInstructorReviews, setSelectedInstructorReviews] = useState([]);
    const [reviewInstructor, setReviewInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileLoading, setProfileLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("subject");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showLessons, setShowLessons] = useState(false);
    const isAdmin = checkIsAdmin();

    useEffect(() => {
        fetchInstructorsAndProfiles();
    }, []);

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        localStorage.removeItem("role");

        if (onLogout) {
            onLogout();
        }
    };

    const handleUnauthorized = () => {
        alert("Sesija je istekla. Prijavi se ponovno.");
        logout();
    };

    const fetchInstructorsAndProfiles = async () => {
        try {
            setLoading(true);

            const instructorsResponse = await fetch(
                "http://localhost:8080/api/resources/instructors",
                {
                    method: "GET",
                    headers: authHeaders(),
                }
            );

            if (instructorsResponse.status === 401 || instructorsResponse.status === 403) {
                handleUnauthorized();
                return;
            }

            const instructorsData = await instructorsResponse.json();

            if (!instructorsResponse.ok) {
                console.error(instructorsData);
                alert("Greška kod dohvaćanja instruktora.");
                return;
            }

            setInstructors(instructorsData);

            const allProfiles = await Promise.all(
                instructorsData.map(async (instructor) => {
                    const instructorName = getInstructorUsername(instructor);

                    if (!instructorName) {
                        return [];
                    }

                    const profileResponse = await fetch(
                        `http://localhost:8080/api/resources/profiles/${instructorName}`,
                        {
                            method: "GET",
                            headers: authHeaders(),
                        }
                    );

                    if (profileResponse.status === 401 || profileResponse.status === 403) {
                        handleUnauthorized();
                        return [];
                    }

                    if (!profileResponse.ok) {
                        return [];
                    }

                    const profiles = await profileResponse.json();

                    let reviews = [];

                    try {
                        const reviewsResponse = await fetch(
                            `http://localhost:8080/api/resources/reviews/${instructorName}`,
                            {
                                method: "GET",
                                headers: authHeaders(),
                            }
                        );

                        if (reviewsResponse.ok) {
                            reviews = await reviewsResponse.json();
                        }
                    } catch (error) {
                        console.error("Greška kod dohvaćanja recenzija:", error);
                    }

                    return profiles.map((profile, index) => ({
                        id: `${instructorName}-${getProfileSubject(profile)}-${index}`,
                        instructor,
                        profile,
                        reviews,
                    }));
                })
            );

            setProfileCards(allProfiles.flat());
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setLoading(false);
        }
    };

    const blockInstructor = async (instructor) => {
        const username = getInstructorUsername(instructor);

        const confirmed = window.confirm(
            `Jesi li siguran da želiš blokirati instruktora ${username}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/resources/instructors/update", {
                method: "PUT",
                headers: authHeaders(),
                body: JSON.stringify({
                    name: username,
                    age: getInstructorAge(instructor) ? Number(getInstructorAge(instructor)) : null,
                    phone: getInstructorPhone(instructor),
                    active: false,
                }),
            });

            if (response.status === 401 || response.status === 403) {
                handleUnauthorized();
                return;
            }

            if (response.ok) {
                alert("Instruktor je uspješno blokiran.");
                setSelectedInstructor(null);
                setSelectedInstructorProfiles([]);
                setSelectedInstructorReviews([]);
                fetchInstructorsAndProfiles();
            } else {
                const error = await response.text();
                console.error(error);
                alert("Greška kod blokiranja instruktora.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
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
            setSelectedInstructorProfiles([]);
            setSelectedInstructorReviews([]);

            const [profilesResponse, reviewsResponse] = await Promise.all([
                fetch(`http://localhost:8080/api/resources/profiles/${username}`, {
                    method: "GET",
                    headers: authHeaders(),
                }),
                fetch(`http://localhost:8080/api/resources/reviews/${username}`, {
                    method: "GET",
                    headers: authHeaders(),
                }),
            ]);

            if (
                profilesResponse.status === 401 ||
                profilesResponse.status === 403 ||
                reviewsResponse.status === 401 ||
                reviewsResponse.status === 403
            ) {
                handleUnauthorized();
                return;
            }

            const profilesData = await profilesResponse.json();
            const reviewsData = await reviewsResponse.json();

            if (profilesResponse.ok) {
                setSelectedInstructorProfiles(profilesData);
            } else {
                console.error(profilesData);
                alert("Greška kod dohvaćanja profila instruktora.");
            }

            if (reviewsResponse.ok) {
                setSelectedInstructorReviews(reviewsData);
            } else {
                console.error(reviewsData);
                alert("Greška kod dohvaćanja recenzija instruktora.");
            }
        } catch (error) {
            console.error(error);
            alert("Backend nije dostupan.");
        } finally {
            setProfileLoading(false);
        }
    };

    const filteredAndSortedProfiles = profileCards
        .filter(({ instructor, profile }) => {
            if (selectedSubject && getProfileSubject(profile) !== selectedSubject) {
                return false;
            }

            const instructorName = getInstructorUsername(instructor).toLowerCase();
            const email = getInstructorEmail(instructor).toLowerCase();
            const phone = getInstructorPhone(instructor).toLowerCase();
            const subject = getProfileSubject(profile).toLowerCase();
            const description = getProfileDescription(profile).toLowerCase();
            const query = search.toLowerCase();

            return (
                instructorName.includes(query) ||
                email.includes(query) ||
                phone.includes(query) ||
                subject.includes(query) ||
                description.includes(query)
            );
        })
        .sort((a, b) => {
            const subjectA = getProfileSubject(a.profile).toLowerCase();
            const subjectB = getProfileSubject(b.profile).toLowerCase();
            const priceA = Number(getProfilePrice(a.profile)) || 0;
            const priceB = Number(getProfilePrice(b.profile)) || 0;
            const ratingA = getAverageScoreNumber(a.reviews);
            const ratingB = getAverageScoreNumber(b.reviews);

            if (sortBy === "subject") {
                return subjectA.localeCompare(subjectB);
            }

            if (sortBy === "price-asc") {
                return priceA - priceB;
            }

            if (sortBy === "price-desc") {
                return priceB - priceA;
            }

            if (sortBy === "rating-desc") {
                return ratingB - ratingA;
            }

            if (sortBy === "rating-asc") {
                return ratingA - ratingB;
            }

            return 0;
        });

    if (showEditProfile) {
        return (
            <EditProfile
                onBack={() => {
                    setShowEditProfile(false);
                    fetchInstructorsAndProfiles();
                }}
                onLogout={logout}
            />
        );
    }

    if (reviewInstructor) {
        return (
            <OstaviRecenziju
                instructor={reviewInstructor}
                onBack={() => {
                    setReviewInstructor(null);
                    if (selectedInstructor) {
                        fetchProfilesForInstructor(selectedInstructor);
                    }
                }}
                onLogout={logout}
            />
        );
    }

    if (selectedInstructor) {
        return (
            <InstructorProfile
                instructor={selectedInstructor}
                profiles={selectedInstructorProfiles}
                reviews={selectedInstructorReviews}
                loading={profileLoading}
                onBack={() => {
                    setSelectedInstructor(null);
                    setSelectedInstructorProfiles([]);
                    setSelectedInstructorReviews([]);
                }}
                onLogout={logout}
                onReview={() => setReviewInstructor(selectedInstructor)}
                onBlock={() => blockInstructor(selectedInstructor)}
                isAdmin={isAdmin}
            />
        );
    }
    if (showLessons) {
        return (
            <LessonsPage
                onBack={() => setShowLessons(false)}
                onLogout={onLogout}
            />
        );
    }

    return (
        <div style={styles.page}>
            <Navbar
                onLogout={logout}
                onEditProfile={() => setShowEditProfile(true)}
                onOpenLessons={() => setShowLessons(true)}
            />

            <main style={styles.container}>
                <h2 style={styles.title}>Pregled profila instrukcija</h2>

                <section style={styles.controls}>
                    <input
                        type="text"
                        placeholder="Pretraži"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />

                    <div style={styles.sortControls}>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            style={styles.sortSelect}
                        >
                            <option value="">Svi predmeti</option>

                            {[...new Set(profileCards.map(({ profile }) => getProfileSubject(profile)))].map(
                                (subject, index) => (
                                    <option key={`${subject}-${index}`} value={subject}>
                                        {subject}
                                    </option>
                                )
                            )}
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={styles.sortSelect}
                        >
                            <option value="price-asc">Cijena: najniža prvo</option>
                            <option value="price-desc">Cijena: najviša prvo</option>
                            <option value="rating-desc">Ocjena: najviša prvo</option>
                            <option value="rating-asc">Ocjena: najniža prvo</option>
                        </select>
                    </div>
                </section>

                {loading ? (
                    <div style={styles.messageBox}>Učitavanje profila instrukcija...</div>
                ) : filteredAndSortedProfiles.length === 0 ? (
                    <div style={styles.messageBox}>Nema profila instrukcija za prikaz.</div>
                ) : (
                    <div style={styles.cardsContainer}>
                        {filteredAndSortedProfiles.map(({ id, instructor, profile, reviews }) => (
                            <InstructionProfileCard
                                key={id}
                                instructor={instructor}
                                profile={profile}
                                reviews={reviews}
                                onOpenProfile={() => fetchProfilesForInstructor(instructor)}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

function Navbar({ onLogout, onEditProfile, onOpenLessons }) {
    return (
        <nav style={styles.navbar}>
            <div style={styles.logoSection}>
                <button style={styles.menuButton}>☰</button>
                <h1 style={styles.logo}>PINSUS</h1>
            </div>

            <button
                style={styles.profileButton}
                onClick={onOpenLessons}
            >
                Lessons
            </button>

            <div style={styles.navButtons}>
                <button style={styles.profileButton} onClick={onEditProfile}>
                    Uredi profil
                </button>

                <button style={styles.logoutButton} onClick={onLogout}>
                    Odjava
                </button>
            </div>
        </nav>
    );
}

function InstructionProfileCard({ instructor, profile, reviews, onOpenProfile }) {
    const username = getInstructorUsername(instructor);
    const email = getInstructorEmail(instructor);
    const phone = getInstructorPhone(instructor);
    const age = getInstructorAge(instructor);
    const subject = getProfileSubject(profile);
    const price = getProfilePrice(profile);
    const description = getProfileDescription(profile);
    const averageScore = calculateAverageScore(reviews);

    return (
        <article style={styles.card}>
            <div style={styles.cardHeader}>
                <div style={styles.avatar}>{username ? username.charAt(0).toUpperCase() : "I"}</div>

                <div>
                    <h3 style={styles.cardTitle}>{username || "Instruktor"}</h3>
                    <p style={styles.subject}>{subject || "Predmet nije unesen"}</p>
                </div>
            </div>

            <div style={styles.cardStats}>
                <div style={styles.priceBox}>{price ? `${price} €/h` : "Cijena nije unesena"}</div>
                <div style={styles.ratingBox}>⭐ {averageScore}</div>
            </div>

            <p style={styles.description}>{description || "Nema opisa profila instrukcija."}</p>

            <div style={styles.infoSection}>
                {email && <p> {email}</p>}
                {phone && <p>📞 {phone}</p>}
                {age && <p> {age} godina</p>}
            </div>

            <button style={styles.profileViewButton} onClick={onOpenProfile}>
                Pogledaj profil instruktora
            </button>
        </article>
    );
}

function InstructorProfile({ instructor, profiles, reviews, loading, onBack, onLogout, onReview, onBlock, isAdmin }) {
    const username = getInstructorUsername(instructor);
    const email = getInstructorEmail(instructor);
    const phone = getInstructorPhone(instructor);
    const age = getInstructorAge(instructor);
    const averageScore = calculateAverageScore(reviews);

    return (
        <div style={styles.page}>
            <nav style={styles.navbar}>
                <div style={styles.logoSection}>
                    <button style={styles.menuButton}>☰</button>
                    <h1 style={styles.logo}>PINSUS</h1>
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
                        <p style={styles.profileSubject}>Podaci o instruktoru</p>

                        <div style={styles.profileMeta}>
                            {email && <p> {email}</p>}
                            {phone && <p>📞 {phone}</p>}
                            {age && <p> {age} godina</p>}
                            <p>⭐ Prosječna ocjena: {averageScore}</p>
                        </div>
                    </div>
                </section>

                <section style={styles.profileCard}>
                    <div style={styles.profileHeaderActions}>
                        <h3 style={styles.sectionTitle}>Profili instrukcija</h3>

                        <div style={styles.actionButtons}>
                            <button style={styles.reviewButton} onClick={onReview}>
                                Ostavi recenziju
                            </button>

                            {isAdmin && localStorage.getItem("username") !== username && (
                                <button style={styles.blockButton} onClick={onBlock}>
                                    Blokiraj instruktora
                                </button>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <p style={styles.emptyText}>Učitavanje profila...</p>
                    ) : profiles.length === 0 ? (
                        <p style={styles.emptyText}>Ovaj instruktor još nema kreiran profil.</p>
                    ) : (
                        <div style={styles.profileGrid}>
                            {profiles.map((profile, index) => (
                                <ProfileItem key={`${getProfileSubject(profile)}-${index}`} profile={profile} />
                            ))}
                        </div>
                    )}
                </section>

                <section style={styles.profileCard}>
                    <h3 style={styles.sectionTitle}>Recenzije</h3>

                    {loading ? (
                        <p style={styles.emptyText}>Učitavanje recenzija...</p>
                    ) : reviews.length === 0 ? (
                        <p style={styles.emptyText}>Ovaj instruktor još nema recenzija.</p>
                    ) : (
                        <div style={styles.reviewsGrid}>
                            {reviews.map((review, index) => (
                                <ReviewItem key={`${getReviewReviewer(review)}-${index}`} review={review} />
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

function ReviewItem({ review }) {
    return (
        <div style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
                <strong>{getReviewReviewer(review) || "Korisnik"}</strong>
                <span>⭐ {getReviewScore(review)}</span>
            </div>

            <p style={styles.reviewComment}>{getReviewComment(review)}</p>
        </div>
    );
}

function checkIsAdmin() {
    const storedRoles = localStorage.getItem("roles") || localStorage.getItem("role") || "";

    try {
        const parsedRoles = JSON.parse(storedRoles);

        if (Array.isArray(parsedRoles)) {
            return parsedRoles.some((role) => String(role).toUpperCase().includes("ADMIN"));
        }
    } catch (error) {
        // Ako nije JSON nego običan string, koristi se donja provjera.
    }

    return storedRoles.toUpperCase().includes("ADMIN");
}

function calculateAverageScore(reviews) {
    if (!reviews || reviews.length === 0) {
        return "Nema ocjena";
    }

    return getAverageScoreNumber(reviews).toFixed(2);
}

function getAverageScoreNumber(reviews) {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    const total = reviews.reduce((sum, review) => {
        return sum + (Number(getReviewScore(review)) || 0);
    }, 0);

    return total / reviews.length;
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

    controls: {
        display: "grid",
        gridTemplateColumns: "1fr 520px",
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

    sortControls: {
        display: "flex",
        gap: "12px",
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

    cardsContainer: {
        width: "100%",
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
        alignItems: "center",
        gap: "16px",
        marginBottom: "18px",
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
        flexShrink: 0,
    },

    cardTitle: {
        margin: "0 0 6px 0",
        fontSize: "26px",
    },

    subject: {
        margin: 0,
        color: "#2563eb",
        fontWeight: "bold",
        fontSize: "18px",
    },

    cardStats: {
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginBottom: "16px",
    },

    priceBox: {
        backgroundColor: "#dbeafe",
        color: "#1d4ed8",
        fontWeight: "bold",
        fontSize: "22px",
        padding: "12px 16px",
        borderRadius: "14px",
        marginBottom: "16px",
        display: "inline-block",
    },

    ratingBox: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
        fontWeight: "bold",
        fontSize: "22px",
        padding: "12px 16px",
        borderRadius: "14px",
        display: "inline-block",
    },

    description: {
        color: "#475569",
        lineHeight: "1.6",
        minHeight: "52px",
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

    profileHeaderActions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "18px",
    },

    actionButtons: {
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
    },

    reviewButton: {
        backgroundColor: "#0f172a",
        color: "white",
        border: "none",
        padding: "14px 20px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
    },

    blockButton: {
        backgroundColor: "#dc2626",
        color: "white",
        border: "none",
        padding: "14px 20px",
        borderRadius: "12px",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "15px",
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

    reviewsGrid: {
        display: "grid",
        gap: "16px",
    },

    reviewCard: {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "18px",
    },

    reviewHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        color: "#0f172a",
    },

    reviewComment: {
        margin: 0,
        color: "#475569",
        lineHeight: "1.6",
    },
};
