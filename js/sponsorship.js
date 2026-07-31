document.addEventListener('DOMContentLoaded', function() {
    const sponsors = [
        {
            name: "KEEKI",
            type: "supported",
            logo: "sponsorship/keeki.jpeg"
        },
        {
            name: "TEMEKANIS",
            type: "supported",
            logo: "sponsorship/temekanis.png"
        }
    ];

    function renderSponsors() {
        const grid = document.getElementById('sponsor-grid');
        const empty = document.getElementById('sponsor-empty');

        if (sponsors.length === 0) {
            if (grid) grid.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }

        if (empty) empty.style.display = 'none';

        let html = '';
        sponsors.forEach(function(sp, index) {
            html += '<div class="sponsor-card reveal" style="transition-delay: ' + (0.1 * index) + 's;">';
            html += '<img src="' + sp.logo + '" alt="' + sp.name + '" class="sponsor-logo" loading="lazy" onerror="this.src=\'logo/IMG_20260728_233029.png\'">';
            html += '<h3>' + sp.name + '</h3>';
            html += '<span class="sponsor-type">' + sp.type + '</span>';
            html += '</div>';
        });

        if (grid) {
            grid.innerHTML = html;
            handleScrollReveal();
        }
    }

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function handleScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(function(el) {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const revealPoint = 100;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollReveal);
    window.addEventListener('load', handleScrollReveal);
    handleScrollReveal();

    const bgMusic = document.getElementById('bg-music');
    const musicFloat = document.getElementById('music-float');
    let isMusicPlaying = false;

    if (localStorage.getItem('musicChoice') === 'active') {
        bgMusic.volume = 0.3;
        bgMusic.play().then(function() {
            isMusicPlaying = true;
            musicFloat.classList.add('playing');
        }).catch(function(e) {});
    }

    if (musicFloat) {
        musicFloat.addEventListener('click', function() {
            if (isMusicPlaying) {
                bgMusic.pause();
                isMusicPlaying = false;
                musicFloat.classList.remove('playing');
            } else {
                bgMusic.play().then(function() {
                    isMusicPlaying = true;
                    musicFloat.classList.add('playing');
                }).catch(function(e) {});
            }
        });
    }

    function startMusicOnInteraction() {
        if (!localStorage.getItem('musicChoice') && bgMusic.paused) {
            localStorage.setItem('musicChoice', 'active');
            bgMusic.volume = 0.3;
            bgMusic.play().then(function() {
                isMusicPlaying = true;
                musicFloat.classList.add('playing');
            }).catch(function(e) {});
        }
        document.removeEventListener('click', startMusicOnInteraction);
        window.removeEventListener('scroll', startMusicOnInteraction);
    }

    document.addEventListener('click', startMusicOnInteraction);
    window.addEventListener('scroll', startMusicOnInteraction);

    renderSponsors();
});
