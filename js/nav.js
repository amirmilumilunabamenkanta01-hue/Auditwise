// ============================================================
// js/nav.js
// Injects the shared navigation + footer into every page.
// Usage: Add <div data-nav></div> at top and <div data-footer></div>
// at bottom of any HTML page, then import this file.
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
                <p>AI-powered smart contract security reports for developers and auditors.</p>
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

async function renderNav() {
    const navMount = document.querySelector('[data-nav]');
    if (navMount) navMount.innerHTML = NAV_HTML;

    // Update nav actions based on auth state
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
}

function renderFooter() {
    const footerMount = document.querySelector('[data-footer]');
    if (footerMount) footerMount.innerHTML = FOOTER_HTML;
}

renderNav();
renderFooter();
