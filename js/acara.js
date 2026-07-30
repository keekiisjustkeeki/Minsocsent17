document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function handleScrollReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
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

    document.querySelectorAll('.lomba-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    document.querySelectorAll('.ripple-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            btn.appendChild(ripple);
            setTimeout(function() {
                ripple.remove();
            }, 600);
        });
    });

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
});

