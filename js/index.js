document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const musicDialog = document.getElementById('music-dialog');
    const bgMusic = document.getElementById('bg-music');
    const musicFloat = document.getElementById('music-float');
    let isMusicPlaying = false;

    setTimeout(function() {
        loadingScreen.classList.add('hidden');
        setTimeout(function() {
            loadingScreen.style.display = 'none';
            if (!localStorage.getItem('musicChoice')) {
                musicDialog.classList.add('show');
            }
        }, 800);
    }, 2500);

    document.getElementById('btn-music-active').addEventListener('click', function() {
        musicDialog.classList.remove('show');
        localStorage.setItem('musicChoice', 'active');
        bgMusic.volume = 0.3;
        bgMusic.play().then(function() {
            isMusicPlaying = true;
            musicFloat.classList.add('playing');
        }).catch(function(e) {});
    });

    document.getElementById('btn-music-skip').addEventListener('click', function() {
        musicDialog.classList.remove('show');
        localStorage.setItem('musicChoice', 'skip');
    });

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

    if (localStorage.getItem('musicChoice') === 'active') {
        bgMusic.volume = 0.3;
        bgMusic.play().then(function() {
            isMusicPlaying = true;
            musicFloat.classList.add('playing');
        }).catch(function(e) {});
    }

    const video = document.getElementById('hero-video');
    const videoOverlay = document.getElementById('video-overlay');
    const videoPlayBtn = document.getElementById('btn-video-play');

    videoPlayBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        video.muted = false;
        video.play();
        videoOverlay.classList.add('sound-active');
    });

    videoOverlay.addEventListener('click', function() {
        video.muted = !video.muted;
        if (!video.muted) {
            videoOverlay.classList.add('sound-active');
            videoPlayBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        } else {
            videoOverlay.classList.remove('sound-active');
            videoPlayBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        }
    });

    video.addEventListener('click', function() {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    function handleScrollReveal() {
        const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
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

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

