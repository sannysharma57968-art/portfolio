import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
const hasFinePointer = window.matchMedia("(pointer: fine)").matches

// =====================
// NAV - Smooth scroll
// =====================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("href")
    if (!target || target === "#" || !document.querySelector(target)) return

    e.preventDefault()
    gsap.to(window, {
      duration: prefersReducedMotion ? 0 : 1,
      scrollTo: target,
      ease: "power3.inOut"
    })
  })
})

// =====================
// HERO - Text animations
// =====================
if (!prefersReducedMotion) {
  gsap.from(".hero-text span", {
    y: 80, opacity: 0, duration: 0.8,
    stagger: 0.12, ease: "power3.out",
    delay: 0.1, clearProps: "all"
  })

  gsap.from(".hero-sub", {
    y: 25, opacity: 0, duration: 0.7,
    ease: "power3.out", delay: 0.5, clearProps: "all"
  })

  gsap.from(".btn-primary, .btn-secondary", {
    y: 15, opacity: 0, duration: 0.4,
    stagger: 0.1, ease: "power3.out",
    delay: 0.55, clearProps: "all"
  })

  gsap.from(".hero-social", {
    y: 15, opacity: 0, duration: 0.4,
    ease: "power3.out", delay: 0.7, clearProps: "all"
  })
}

// =====================
// CURSOR
// =====================
const cursor = document.querySelector(".cursor")

if (cursor && hasFinePointer && !prefersReducedMotion) {
  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" })
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" })

  window.addEventListener("mousemove", (e) => {
    cursorX(e.clientX)
    cursorY(e.clientY)
  })
}

// =====================
// PROFILE CARD - 3D tilt
// =====================
const profileCard = document.querySelector(".profile-card")

if (profileCard && hasFinePointer && !prefersReducedMotion) {
  profileCard.addEventListener("mousemove", (e) => {
    const rect = profileCard.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 15
    const rotateY = (centerX - x) / 15
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    profileCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    profileCard.style.setProperty("--x", `${xPercent}%`)
    profileCard.style.setProperty("--y", `${yPercent}%`)
  })

  profileCard.addEventListener("mouseleave", () => {
    profileCard.style.transform = "rotateX(0deg) rotateY(0deg)"
  })
}

// =====================
// STATS COUNTER
// =====================
const stats = document.querySelectorAll(".stat-num")

if (profileCard && stats.length) {
  ScrollTrigger.create({
    trigger: ".profile-card",
    start: "top 80%",
    once: true,
    onEnter: () => {
      stats.forEach(stat => {
        const target = parseInt(stat.getAttribute("data-target"), 10)
        const obj = { val: 0 }

        gsap.to(obj, {
          val: Number.isNaN(target) ? 0 : target,
          duration: prefersReducedMotion ? 0 : 3,
          ease: "power2.out",
          onUpdate: function() {
            stat.textContent = Math.ceil(obj.val) + "+"
          }
        })
      })
    }
  })
}

// =====================
// PROJECTS
// =====================
const projects = [
  {
    title: "E-Commerce Store",
    category: "ecommerce",
    image: "",
    description: "Full featured online store with payment integration and modern UI.",
    liveUrl: "#",
    githubUrl: ""
  },
  {
    title: "Portfolio Landing Page",
    category: "landing",
    image: "",
    description: "High converting landing page with smooth animations.",
    liveUrl: "#",
    githubUrl: ""
  },
  {
    title: "Business Website",
    category: "website",
    image: "",
    description: "Modern responsive business website with clean design.",
    liveUrl: "#",
    githubUrl: ""
  }
]

function renderProjects(filter = "all") {
  const grid = document.getElementById("projects-grid")
  if (!grid) return

  const filtered = filter === "all"
    ? projects
    : projects.filter(p => p.category === filter)

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-category="${p.category}">
      <div class="project-img">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}" loading="lazy" />`
          : `<div class="project-placeholder">
               <span>🖥️</span>
               <p>Screenshot Coming Soon</p>
             </div>`
        }
        <div class="project-overlay">
          ${p.liveUrl && p.liveUrl !== "#"
            ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-live">Live ↗</a>`
            : `<span class="project-soon">Coming Soon</span>`
          }
        </div>
      </div>
      <div class="project-info">
        <span class="project-tag">${p.category}</span>
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <div class="project-links">
          ${p.liveUrl && p.liveUrl !== "#"
            ? `<a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="project-link-live">View Live ↗</a>`
            : ""
          }
          ${p.githubUrl
            ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link-github">GitHub →</a>`
            : ""
          }
        </div>
      </div>
    </div>
  `).join("")
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"))
    btn.classList.add("active")
    renderProjects(btn.getAttribute("data-filter"))
  })
})

renderProjects()

// =====================
// SERVICES - CLICK TO CONTACT
// =====================
const serviceCards = document.querySelectorAll("#services .card")

serviceCards.forEach(card => {
  card.setAttribute("role", "button")
  card.setAttribute("tabindex", "0")
  card.setAttribute("aria-label", "Go to contact form")

  const goToContact = () => {
    if (!document.querySelector("#contact")) return

    gsap.to(window, {
      duration: prefersReducedMotion ? 0 : 1,
      scrollTo: "#contact",
      ease: "power3.inOut"
    })
  }

  card.addEventListener("click", goToContact)
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      goToContact()
    }
  })
})

// =====================
// CONTACT FORM
// =====================
const contactForm = document.getElementById("contact-form")

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(contactForm)
    const submitBtn = contactForm.querySelector(".form-submit")

    if (submitBtn) {
      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        const toast = document.getElementById("toast")

        if (toast) {
          toast.classList.add("show")

          setTimeout(() => {
            toast.classList.remove("show")
          }, 3000)
        }

        contactForm.reset()
      } else {
        alert("Something went wrong!")
      }
    } catch (error) {
      alert("Error sending message!")
    }

    if (submitBtn) {
      submitBtn.textContent = "Send Message →"
      submitBtn.disabled = false
    }
  })
}
