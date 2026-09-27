/* =========================================================
   SITE-95 — FOUNDATION TERMINAL
   JavaScript principal
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    // =====================================================
    // VARIABLES
    // =====================================================

    const navLinks = document.querySelectorAll("[data-page]");
    const pages = document.querySelectorAll(".page");
    const menuButton = document.querySelector(".menu-toggle");
    const sidebar = document.querySelector(".sidebar");
    const overlay = document.querySelector(".sidebar-overlay");
    const searchInput = document.querySelector("#searchInput");
    const searchResults = document.querySelector("#searchResults");

    // =====================================================
    // NAVIGATION
    // =====================================================

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove("active");
        });

        const targetPage = document.getElementById(pageId);

        if (targetPage) {
            targetPage.classList.add("active");
        }

        navLinks.forEach(link => {
            link.classList.remove("active");

            if (link.dataset.page === pageId) {
                link.classList.add("active");
            }
        });

        // Fermer le menu mobile
        closeSidebar();

        // Remonter en haut
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        // Modifier l'URL sans recharger
        history.pushState(
            null,
            "",
            "#" + pageId
        );
    }

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();

            const pageId = link.dataset.page;

            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // =====================================================
    // NAVIGATION AVEC HASH
    // =====================================================

    function loadPageFromHash() {
        const hash = window.location.hash.replace("#", "");

        if (hash && document.getElementById(hash)) {
            showPage(hash);
        } else {
            const home = document.querySelector(".page");
            if (home) {
                home.classList.add("active");
            }
        }
    }

    window.addEventListener("hashchange", loadPageFromHash);

    // =====================================================
    // MENU MOBILE
    // =====================================================

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add("open");
        }

        if (overlay) {
            overlay.classList.add("active");
        }

        document.body.classList.add("menu-open");
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove("open");
        }

        if (overlay) {
            overlay.classList.remove("active");
        }

        document.body.classList.remove("menu-open");
    }

    if (menuButton) {
        menuButton.addEventListener("click", () => {
            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    // =====================================================
    // RECHERCHE
    // =====================================================

    const searchableElements = document.querySelectorAll(
        "[data-searchable]"
    );

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value
                .toLowerCase()
                .trim();

            if (!searchResults) {
                return;
            }

            searchResults.innerHTML = "";

            if (query.length < 2) {
                searchResults.classList.remove("visible");
                return;
            }

            let found = 0;

            searchableElements.forEach(element => {
                const text = element.textContent
                    .toLowerCase();

                if (text.includes(query)) {
                    found++;

                    const result = document.createElement("button");

                    result.className = "search-result";
                    result.textContent =
                        element.dataset.title ||
                        element.textContent.trim().substring(0, 80);

                    result.addEventListener("click", () => {
                        const page = element.closest(".page");

                        if (page) {
                            showPage(page.id);
                        }

                        element.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                        searchInput.value = "";
                        searchResults.classList.remove("visible");
                    });

                    searchResults.appendChild(result);
                }
            });

            if (found === 0) {
                const noResult =
                    document.createElement("div");

                noResult.className = "search-no-result";
                noResult.textContent =
                    "AUCUN DOCUMENT CORRESPONDANT";

                searchResults.appendChild(noResult);
            }

            searchResults.classList.add("visible");
        });
    }

    // Fermer les résultats de recherche
    document.addEventListener("click", event => {
        if (
            searchResults &&
            searchInput &&
            !searchInput.contains(event.target) &&
            !searchResults.contains(event.target)
        ) {
            searchResults.classList.remove("visible");
        }
    });

    // =====================================================
    // HORLOGE DU SITE
    // =====================================================

    const clock = document.querySelector("#siteClock");

    function updateClock() {
        if (!clock) {
            return;
        }

        const now = new Date();

        const hours = String(
            now.getHours()
        ).padStart(2, "0");

        const minutes = String(
            now.getMinutes()
        ).padStart(2, "0");

        const seconds = String(
            now.getSeconds()
        ).padStart(2, "0");

        clock.textContent =
            `${hours}:${minutes}:${seconds}`;
    }

    updateClock();
    setInterval(updateClock, 1000);

    // =====================================================
    // DATE
    // =====================================================

    const dateElement =
        document.querySelector("#siteDate");

    if (dateElement) {
        const now = new Date();

        dateElement.textContent =
            now.toLocaleDateString(
                "fr-FR",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );
    }

    // =====================================================
    // ACCORDÉONS
    // =====================================================

    const accordionButtons =
        document.querySelectorAll(
            ".accordion-header"
        );

    accordionButtons.forEach(button => {
        button.addEventListener("click", () => {
            const content =
                button.nextElementSibling;

            if (!content) {
                return;
            }

            const isOpen =
                button.classList.contains("open");

            // Fermer les autres
            const parent =
                button.parentElement;

            if (parent) {
                parent
                    .querySelectorAll(".accordion-header")
                    .forEach(other => {
                        if (other !== button) {
                            other.classList.remove("open");
                        }
                    });

                parent
                    .querySelectorAll(".accordion-content")
                    .forEach(other => {
                        if (other !== content) {
                            other.style.maxHeight = null;
                        }
                    });
            }

            button.classList.toggle(
                "open",
                !isOpen
            );

            if (!isOpen) {
                content.style.maxHeight =
                    content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // =====================================================
    // CARTES CLIQUABLES
    // =====================================================

    const cards =
        document.querySelectorAll(
            "[data-target-page]"
        );

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const target =
                card.dataset.targetPage;

            if (target) {
                showPage(target);
            }
        });
    });

    // =====================================================
    // CODES D'ALERTE
    // =====================================================

    const alertButtons =
        document.querySelectorAll(
            "[data-alert]"
        );

    const alertDisplay =
        document.querySelector("#alertDisplay");

    alertButtons.forEach(button => {
        button.addEventListener("click", () => {
            const alertCode =
                button.dataset.alert;

            if (alertDisplay) {
                alertDisplay.textContent =
                    alertCode.toUpperCase();
            }

            document.body.dataset.alert =
                alertCode;
        });
    });

    // =====================================================
    // EFFET TERMINAL
    // =====================================================

    const terminalElements =
        document.querySelectorAll(
            ".terminal-text"
        );

    terminalElements.forEach(element => {
        const text =
            element.textContent;

        element.textContent = "";

        let index = 0;

        function typeText() {
            if (index < text.length) {
                element.textContent +=
                    text.charAt(index);

                index++;

                setTimeout(
                    typeText,
                    15
                );
            }
        }

        typeText();
    });

    // =====================================================
    // ANIMATION DES BARRES
    // =====================================================

    const progressBars =
        document.querySelectorAll(
            ".progress-bar"
        );

    progressBars.forEach(bar => {
        const value =
            bar.dataset.value;

        if (value) {
            setTimeout(() => {
                bar.style.width =
                    value + "%";
            }, 300);
        }
    });

    // =====================================================
    // COPIE D'INFORMATIONS
    // =====================================================

    const copyButtons =
        document.querySelectorAll(
            "[data-copy]"
        );

    copyButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const text =
                button.dataset.copy;

            if (!text) {
                return;
            }

            try {
                await navigator.clipboard.writeText(
                    text
                );

                const original =
                    button.textContent;

                button.textContent =
                    "COPIÉ";

                setTimeout(() => {
                    button.textContent =
                        original;
                }, 1500);

            } catch (error) {
                console.error(
                    "Erreur de copie :",
                    error
                );
            }
        });
    });

    // =====================================================
    // MODALES
    // =====================================================

    const modalButtons =
        document.querySelectorAll(
            "[data-modal]"
        );

    modalButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modalId =
                button.dataset.modal;

            const modal =
                document.getElementById(
                    modalId
                );

            if (modal) {
                modal.classList.add("active");
            }
        });
    });

    const modalCloseButtons =
        document.querySelectorAll(
            "[data-close-modal]"
        );

    modalCloseButtons.forEach(button => {
        button.addEventListener("click", () => {
            const modal =
                button.closest(".modal");

            if (modal) {
                modal.classList.remove(
                    "active"
                );
            }
        });
    });

    document.addEventListener(
        "click",
        event => {
            if (
                event.target.classList.contains(
                    "modal"
                )
            ) {
                event.target.classList.remove(
                    "active"
                );
            }
        }
    );

    // =====================================================
    // INITIALISATION
    // =====================================================

    loadPageFromHash();

    console.log(
        "%c[SITE-95]",
        "color:#d71920;font-weight:bold;font-size:20px;"
    );

    console.log(
        "%cFoundation Secure Terminal initialized.",
        "color:#aaa;"
    );

    console.log(
        "%cCLEARANCE REQUIRED — LEVEL 4+",
        "color:#d71920;font-weight:bold;"
    );
});
