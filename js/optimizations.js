/**
 * Optimizations JS - Hologramas CR
 * Implementation of: Intent Scoring, Dynamic Congruence, Sticky CTA, and Debug Mode.
 */

(function() {
    // 1. CONGRUENCIA DINÁMICA (URL Params)
    const urlParams = new URLSearchParams(window.location.search);
    const h1Param = urlParams.get('h1');
    if (h1Param) {
        const mainTitle = document.querySelector('h1');
        if (mainTitle) mainTitle.textContent = h1Param;
    }

    // 2. INTENT SCORING
    let intentScore = 0;
    const intentMarkers = {
        scroll25: false,
        scroll50: false,
        scroll90: false,
        videoWatched: false,
        highIntentFired: false,
        debugActive: urlParams.get('debug') === 'true'
    };

    function updateIntent(points, label) {
        intentScore += points;
        if (intentMarkers.debugActive) {
            updateDebugPanel(label);
        }
        if (intentScore >= 12 && !intentMarkers.highIntentFired) {
            fireHighIntentEvent();
            intentMarkers.highIntentFired = true;
        }
    }

    function fireHighIntentEvent() {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'HighIntentUser', { 
                score: intentScore,
                external_id: getOrCreateExternalId()
            });
        }
        console.log('High Intent Event Fired:', intentScore);
    }

    function getOrCreateExternalId() {
        let extId = localStorage.getItem('ext_id');
        if (!extId) {
            extId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('ext_id', extId);
        }
        return extId;
    }

    // 3. DEBUG PANEL
    if (intentMarkers.debugActive) {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.display = 'block';
        panel.innerHTML = `<div>Score: <span id="debug-score">0</span></div><div id="debug-log"></div>`;
        document.body.appendChild(panel);
    }

    function updateDebugPanel(label) {
        const scoreEl = document.getElementById('debug-score');
        const logEl = document.getElementById('debug-log');
        if (scoreEl) scoreEl.textContent = intentScore;
        if (logEl) {
            const entry = document.createElement('div');
            entry.style.fontSize = '10px';
            entry.textContent = `+ ${label} (Score: ${intentScore})`;
            logEl.prepend(entry);
        }
    }

    // 4. SCROLL TRACKING & STICKY CTA
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
        
        if (scrollPercent > 25 && !intentMarkers.scroll25) {
            intentMarkers.scroll25 = true;
            updateIntent(3, 'Scroll 25%');
        }
        if (scrollPercent > 50 && !intentMarkers.scroll50) {
            intentMarkers.scroll50 = true;
            updateIntent(4, 'Scroll 50%');
        }
        if (scrollPercent > 90 && !intentMarkers.scroll90) {
            intentMarkers.scroll90 = true;
            updateIntent(5, 'Scroll 90%');
            updateStickyCTA('final');
        }

        // Show sticky CTA after 500px scroll
        const stickyCta = document.querySelector('.sticky-cta');
        if (stickyCta) {
            const hasVideos = document.querySelectorAll('video').length > 0;
            const videoCondition = hasVideos ? intentMarkers.videoWatched : true;

            if (window.scrollY > 500 && videoCondition) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        }
    });

    function updateStickyCTA(phase) {
        const ctaBtn = document.querySelector('.sticky-cta .btn-primary');
        if (!ctaBtn) return;

        if (phase === 'final') {
            ctaBtn.textContent = '¡ÚLTIMO PASO!';
            ctaBtn.style.background = '#00f078';
            ctaBtn.style.color = '#0d0d0d';
            ctaBtn.style.borderColor = '#00f078';
            ctaBtn.style.boxShadow = '0 0 20px #00f078';
        }
    }

    // Initialize Sticky CTA HTML and Skeleton Loaders
    document.addEventListener('DOMContentLoaded', () => {
        // Create Sticky CTA if it doesn't exist
        if (!document.querySelector('.sticky-cta')) {
            const stickyDiv = document.createElement('div');
            stickyDiv.className = 'sticky-cta';
            stickyDiv.innerHTML = `<a href="solicitar-holograma.html" class="btn-primary">Solicitar Información</a>`;
            document.body.appendChild(stickyDiv);
        }

        // Track Video Plays
        const videos = document.querySelectorAll('video');
        videos.forEach(v => {
            v.addEventListener('play', () => {
                if (!intentMarkers.videoWatched) {
                    intentMarkers.videoWatched = true;
                    updateIntent(5, 'Video Watched');
                }
            }, { once: true });
        });

        // Add Skeleton class to images/videos while loading
        const mediaElements = document.querySelectorAll('img, video');
        mediaElements.forEach(el => {
            if (!el.complete && el.tagName === 'IMG') {
                el.classList.add('skeleton');
                el.onload = () => el.classList.remove('skeleton');
            } else if (el.tagName === 'VIDEO') {
                el.classList.add('skeleton');
                el.onloadeddata = () => el.classList.remove('skeleton');
            }
        });
    });

})();
