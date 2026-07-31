document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.getElementById('btn-buka-surat');
    const envelope = document.getElementById('envelope');
    const letterContainer = document.getElementById('letter-container');
    const letterContent = document.getElementById('letter-content');
    const envelopeContainer = document.querySelector('.envelope-container');

    let isOpen = false;

    openBtn.addEventListener('click', function() {
        if (isOpen) return;
        isOpen = true;

        openBtn.disabled = true;
        openBtn.textContent = 'Membuka...';

        envelope.classList.add('opening');

        setTimeout(function() {
            envelope.classList.add('open');
            openBtn.textContent = 'Telah Dibuka';

            setTimeout(function() {
                envelope.style.display = 'none';
                letterContainer.classList.add('show');

                setTimeout(function() {
                    letterContent.classList.add('unrolled');
                }, 500);

                setTimeout(function() {
                    const proposalBtn = document.getElementById('btn-lihat-proposal');
                    if (proposalBtn) {
                        proposalBtn.style.display = 'inline-flex';
                    }
                }, 1200);
            }, 800);
        }, 400);
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
});

