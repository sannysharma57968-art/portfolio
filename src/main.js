import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

// =====================
// NAV — Smooth scroll
// =====================
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    gsap.to(window, {
      duration: 1,
      scrollTo: link.getAttribute("href"),
      ease: "power3.inOut"
    })
  })
})

// =====================
// HERO — Text animations
// =====================
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

// =====================
// CURSOR
// =====================
const cursor = document.querySelector(".cursor")

window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1
  })
})

// =====================
// PROFILE CARD — 3D tilt
// =====================
const card = document.querySelector(".profile-card")

card.addEventListener("mousemove", (e) => {
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = (y - centerY) / 15
  const rotateY = (centerX - x) / 15
  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  const xPercent = (x / rect.width) * 100
  const yPercent = (y / rect.height) * 100
  card.style.setProperty("--x", `${xPercent}%`)
  card.style.setProperty("--y", `${yPercent}%`)
})

card.addEventListener("mouseleave", () => {
  card.style.transform = `rotateX(0deg) rotateY(0deg)`
})

// =====================
// STATS COUNTER
// =====================
const stats = document.querySelectorAll(".stat-num")

ScrollTrigger.create({
  trigger: ".profile-card",
  start: "top 80%",
  once: true,
  onEnter: () => {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute("data-target"))
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: 3,
        ease: "power2.out",
        onUpdate: function() {
          stat.textContent = Math.ceil(obj.val) + "+"
        }
      })
    })
  }
})

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
  const filtered = filter === "all"
    ? projects
    : projects.filter(p => p.category === filter)

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-category="${p.category}">
      <div class="project-img">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}" />`
          : `<div class="project-placeholder">
               <span>🖥️</span>
               <p>Screenshot Coming Soon</p>
             </div>`
        }
        <div class="project-overlay">
          ${p.liveUrl && p.liveUrl !== "#"
            ? `<a href="${p.liveUrl}" target="_blank" class="project-live">Live ↗</a>`
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
            ? `<a href="${p.liveUrl}" target="_blank" class="project-link-live">View Live ↗</a>`
            : ""
          }
          ${p.githubUrl
            ? `<a href="${p.githubUrl}" target="_blank" class="project-link-github">GitHub →</a>`
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
// SERVICES → CLICK TO CONTACT
// =====================
const serviceCards = document.querySelectorAll("#services .card");

serviceCards.forEach(card => {
  card.addEventListener("click", () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: "#contact",
      ease: "power3.inOut"
    });
  });
});

// =====================
// CONTACT FORM
// =====================

const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);

  const submitBtn = contactForm.querySelector(".form-submit");

  // Button loading state
  submitBtn.innerHTML = "Sending...";
  submitBtn.disabled = true;

  try {

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (result.success) {

      const toast = document.getElementById("toast");

if (toast) {

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);

}
      // Reset form
      contactForm.reset();

    } else {

      alert("Something went wrong!");

    }

  } catch (error) {

    alert("Error sending message!");

  }

  // Restore button
  submitBtn.textContent = "Send Message →";
  submitBtn.disabled = false;

});


