(() => {
  "use strict"

  const header = document.getElementById("navigation")
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("primary-navigation")
  const navLinks = Array.from(document.querySelectorAll(".nav-link"))
  const mobileQuery = window.matchMedia("(max-width: 820px)")

  function setMenu(open, returnFocus = false) {
    if (!navToggle || !navMenu) return

    const shouldOpen = Boolean(open && mobileQuery.matches)
    navMenu.classList.toggle("is-open", shouldOpen)
    navToggle.setAttribute("aria-expanded", String(shouldOpen))
    navToggle.setAttribute("aria-label", shouldOpen ? "Close navigation menu" : "Open navigation menu")
    document.body.classList.toggle("menu-open", shouldOpen)

    if (returnFocus) navToggle.focus()
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true"
      setMenu(!isOpen)
    })

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenu(false))
    })

    document.addEventListener("pointerdown", (event) => {
      if (navToggle.getAttribute("aria-expanded") !== "true") return
      if (!header?.contains(event.target)) setMenu(false)
    })

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
        setMenu(false, true)
      }
    })

    const handleBreakpointChange = () => setMenu(false)
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", handleBreakpointChange)
    } else {
      mobileQuery.addListener(handleBreakpointChange)
    }
  }

  if (header) {
    let scrollQueued = false

    function updateHeader() {
      header.classList.toggle("is-scrolled", window.scrollY > 12)
      scrollQueued = false
    }

    window.addEventListener(
      "scroll",
      () => {
        if (scrollQueued) return
        scrollQueued = true
        window.requestAnimationFrame(updateHeader)
      },
      { passive: true },
    )

    updateHeader()
  }

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`
      link.classList.toggle("active", isActive)
      if (isActive) {
        link.setAttribute("aria-current", "page")
      } else {
        link.removeAttribute("aria-current")
      }
    })
  }

  const sections = Array.from(document.querySelectorAll("main section[id]"))
  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visible[0]) setActiveLink(visible[0].target.id)
      },
      {
        rootMargin: "-22% 0px -58% 0px",
        threshold: [0, 0.05, 0.15, 0.3],
      },
    )

    sections.forEach((section) => sectionObserver.observe(section))
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const sectionId = link.getAttribute("href")?.slice(1)
      if (sectionId) setActiveLink(sectionId)
    })
  })

  const venuesToggle = document.getElementById("venues-toggle-btn")
  const additionalVenues = Array.from(document.querySelectorAll(".additional-venue"))

  if (venuesToggle && additionalVenues.length) {
    const toggleLabel = venuesToggle.querySelector(".toggle-label")

    venuesToggle.addEventListener("click", () => {
      const shouldExpand = venuesToggle.getAttribute("aria-expanded") !== "true"

      venuesToggle.setAttribute("aria-expanded", String(shouldExpand))
      if (toggleLabel) toggleLabel.textContent = shouldExpand ? "Show fewer venues" : "Show all venues"

      additionalVenues.forEach((venue) => {
        venue.hidden = !shouldExpand
        venue.classList.toggle("is-revealed", shouldExpand)
      })
    })
  }

  document.querySelectorAll(".image-frame img").forEach((image) => {
    const markMissing = () => image.parentElement?.classList.add("image-missing")

    image.addEventListener("error", markMissing, { once: true })
    if (image.complete && image.naturalWidth === 0) markMissing()
  })
})()
