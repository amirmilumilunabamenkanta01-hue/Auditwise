// ============================================================
// js/nav.js
// Injects shared nav, footer, scroll progress, toasts, and
// floating CTA into every page.
// ============================================================

import { supabase } from './config.js';

const NAV_HTML = `
<nav class="nav">
    <div class="container nav-inner">
        <a href="index.html" class="nav-logo">
            <span class="nav-logo-mark">AW</span>
            <span>AuditWise</span>
        </a>
        <div class="nav-links">
            <a href="index.html#how-it-works">How it Works</a>
            <a href="pricing.html">Pricing</a>
            <a href="about.html">About</a>
        </div>
        <div class="nav-actions" id="nav-actions">
            <a href="login.html" class="btn btn-ghost" id="nav-login">Log in</a>
            <a href="login.html" class="btn btn-primary" id="nav-signup">Get Started</a>
        </div>
    </div>
</nav>
`;

const FOOTER_HTML = `
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <a href="index.html" class="nav-logo">
                    <span class="nav-logo-mark">AW</span>
                    <span>AuditWise</span>
                </a>
                <p>AI-powered smart contract security reports for developers, auditors, and security teams.</p>
            </div>
            <div class="footer-col">
                <h4>Product</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="pricing.html">Pricing</a></li>
                    <li><a href="dashboard.html">Dashboard</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><a href="about.html">About</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Legal</h4>
                <ul>
                    <li><a href="privacy.html">Privacy Policy</a></li>
                    <li><a href="terms.html">Terms of Service</a></li>
                    <li><a href="refund.html">Refund Policy</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>&copy; ${new Date().getFullYear()} AuditWise. All rights reserved.</span>
            <span>Built for the smart contract security community</span>
        </div>
        <p class="footer-disclaimer">
            Disclaimer: AuditWise provides AI-assisted analysis of static-analysis tool output. It is not a substitute for a
            manual professional security audit. Reports are informational only. AuditWise is not liable for any financial
            or technical losses arising from the use of its reports.
        </p>
    </div>
</footer>
`;

// ---- Toast notification system ----
let toastContainer = null;

function ensureToastContainer() {
    if (toastContainer) return toastContainer;
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    return toastContainer;
}

/**
 * Global toast helper. Usage:
 *   showToast('Profile saved', 'success');
 *   showToast('Something went wrong', 'error');
 *   showToast('Copied to clipboard');
 */
window.showToast = function (message, type = 'info', duration = 3000) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = type === 'success' ? '✓'
              : type === 'error' ? '✕'
              : 'ℹ';

    toast.innerHTML = `<span style="font-weight: 600;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};

// ---- Scroll progress bar ----
function injectScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const scrollTop = h.scrollTop || document.body.scrollTop;
        const scrollHeight = h.scrollHeight - h.clientHeight;
        const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = percent + '%';
    }, { passive: true });
}

// ---- Floating CTA (homepage only, appears after scroll) ----
function injectFloatingCTA() {
    // Only on index.html
    const isHomepage = /\/(index\.html)?$/.test(window.location.pathname) ||
                       window.location.pathname.endsWith('/Auditwise/') ||
                       window.location.pathname.endsWith('/Auditwise');
    if (!isHomepage) return;

    const cta = document.createElement('a');
    cta.href = '#submit';
    cta.className = 'floating-cta';
    cta.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
        Start a scan
    `;
    document.body.appendChild(cta);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop > 600) {
            cta.classList.add('visible');
        } else {
            cta.classList.remove('visible');
        }
    }, { passive: true });
}

// ---- Nav ----
async function renderNav() {
    const navMount = document.querySelector('[data-nav]');
    if (navMount) navMount.innerHTML = NAV_HTML;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        const actionsEl = document.getElementById('nav-actions');

        if (session && actionsEl) {
            actionsEl.innerHTML = `
                <a href="dashboard.html" class="btn btn-ghost">Dashboard</a>
                <a href="#" class="btn btn-secondary" id="nav-logout">Log out</a>
            `;
            document.getElementById('nav-logout').addEventListener('click', async (e) => {
                e.preventDefault();
                await supabase.auth.signOut();
                window.location.href = 'index.html';
            });
        }
    } catch (err) {
        console.error('Nav auth check failed:', err);
    }
}

// ---- Footer ----
function renderFooter() {
    const footerMount = document.querySelector('[data-footer]');
    if (footerMount) footerMount.innerHTML = FOOTER_HTML;
}

// ---- Reveal on scroll ----
function setupReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

// ---- Favicon + meta (auto-inject if missing) ----
function ensureFavicon() {
    if (document.querySelector('link[rel="icon"]')) return;
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = 'favicon.svg';
    document.head.appendChild(link);

    const theme = document.createElement('meta');
    theme.name = 'theme-color';
    theme.content = '#09090b';
    document.head.appendChild(theme);
}

// ---- Run everything ----
renderNav();
renderFooter();
setupReveal();
injectScrollProgress();
injectFloatingCTA();
ensureFavicon();
