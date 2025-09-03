import { useEffect } from "react";
import AOS from "aos";
import Swiper from "swiper";
import PureCounter from "@srexi/purecounterjs";
import GLightbox from "glightbox";

export const useTemplateFeatures = () => {
  useEffect(() => {
    // ---------------------------
    // Scroll class toggle on body
    // ---------------------------
    const toggleScrolled = () => {
      const body = document.body;
      const header = document.getElementById("header");
      if (!header) return;
      if (
        !header.classList.contains("scroll-up-sticky") &&
        !header.classList.contains("sticky-top") &&
        !header.classList.contains("fixed-top")
      )
        return;

      window.scrollY > 100
        ? body.classList.add("scrolled")
        : body.classList.remove("scrolled");
    };

    window.addEventListener("scroll", toggleScrolled);
    window.addEventListener("load", toggleScrolled);

    // ---------------------------
    // Mobile nav toggle
    // ---------------------------
    const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

    const mobileNavToggle = () => {
      document.body.classList.toggle("mobile-nav-active");
      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.classList.toggle("bi-list");
        mobileNavToggleBtn.classList.toggle("bi-x");
      }
    };

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener("click", mobileNavToggle);
    }

    // ---------------------------
    // Mobile nav hide on nav links
    // ---------------------------
    const navLinks = document.querySelectorAll("#navmenu a");
    const closeMobileNavOnClick = () => {
      if (document.body.classList.contains("mobile-nav-active")) {
        mobileNavToggle();
      }
    };

    navLinks.forEach((link) =>
      link.addEventListener("click", closeMobileNavOnClick)
    );

    // ---------------------------
    // Dropdown toggle
    // ---------------------------
    const dropdownToggles = document.querySelectorAll(".navmenu .toggle-dropdown");

    const handleDropdownClick = (e) => {
      e.preventDefault();
      const target = e.currentTarget;
      if (!target.parentNode) return;

      target.parentNode.classList.toggle("active");

      const sibling = target.parentNode.nextElementSibling;
      if (sibling) {
        sibling.classList.toggle("dropdown-active");
      }
      e.stopImmediatePropagation();
    };

    dropdownToggles.forEach((drop) =>
      drop.addEventListener("click", handleDropdownClick)
    );

    // ---------------------------
    // Scroll top button
    // ---------------------------
    const scrollTopBtn = document.querySelector(".scroll-top");
    const toggleScrollTop = () => {
      if (!scrollTopBtn) return;
      window.scrollY > 100
        ? scrollTopBtn.classList.add("active")
        : scrollTopBtn.classList.remove("active");
    };

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    window.addEventListener("scroll", toggleScrollTop);
    window.addEventListener("load", toggleScrollTop);

    // ---------------------------
    // Initialize AOS
    // ---------------------------
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });

    // ---------------------------
    // Initialize Swiper
    // ---------------------------
    document.querySelectorAll(".init-swiper").forEach((el) => {
      const configEl = el.querySelector(".swiper-config");
      if (!configEl) return;
      const config = JSON.parse(configEl.innerHTML.trim());
      new Swiper(el, config);
    });

    // ---------------------------
    // Initialize PureCounter
    // ---------------------------
    new PureCounter();

    // ---------------------------
    // Initialize GLightbox
    // ---------------------------
    GLightbox({ selector: ".glightbox" });

    // ---------------------------
    // Cleanup
    // ---------------------------
    return () => {
      window.removeEventListener("scroll", toggleScrolled);
      window.removeEventListener("scroll", toggleScrollTop);
      window.removeEventListener("load", toggleScrolled);
      window.removeEventListener("load", toggleScrollTop);

      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.removeEventListener("click", mobileNavToggle);
      }

      navLinks.forEach((link) =>
        link.removeEventListener("click", closeMobileNavOnClick)
      );

      dropdownToggles.forEach((drop) =>
        drop.removeEventListener("click", handleDropdownClick)
      );

      if (scrollTopBtn) {
        scrollTopBtn.removeEventListener("click", () => {});
      }
    };
  }, []);
};
