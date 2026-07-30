document.addEventListener('DOMContentLoaded', function() {
    const cover = document.getElementById('proposal-cover');
    const bookContainer = document.getElementById('book-container');
    const pages = document.querySelectorAll('.book-page');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const pageIndicator = document.getElementById('page-indicator');
    const startBtn = document.getElementById('btn-mulai-membaca');

    let currentPage = 0;
    let totalPages = pages.length;
    let isFlipping = false;
    let touchStartX = 0;
    let touchEndX = 0;

    function showPage(index) {
        pages.forEach(function(page, i) {
            if (i === index) {
                page.classList.add('active');
                page.classList.remove('flipped');
            } else if (i < index) {
                page.classList.remove('active');
                page.classList.add('flipped');
            } else {
                page.classList.remove('active');
                page.classList.remove('flipped');
            }
        });
        updateIndicator();
        updateButtons();
    }

    function updateIndicator() {
        pageIndicator.textContent = (currentPage + 1) + ' / ' + totalPages;
    }

    function updateButtons() {
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages - 1;
    }

    function nextPage() {
        if (isFlipping || currentPage >= totalPages - 1) return;
        isFlipping = true;
        currentPage++;
        showPage(currentPage);
        setTimeout(function() {
            isFlipping = false;
        }, 800);

        if (currentPage === totalPages - 1) {
            closeBook();
        }
    }

    function prevPage() {
        if (isFlipping || currentPage <= 0) return;
        isFlipping = true;
        currentPage--;
        showPage(currentPage);
        setTimeout(function() {
            isFlipping = false;
        }, 800);
    }

    function closeBook() {
        setTimeout(function() {
            bookContainer.classList.add('book-closing');
            setTimeout(function() {
                bookContainer.style.display = 'none';
                cover.style.display = 'flex';
                bookContainer.classList.remove('book-closing');
                currentPage = 0;
                showPage(0);
                cover.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
        }, 2000);
    }

    startBtn.addEventListener('click', function() {
        cover.style.display = 'none';
        bookContainer.classList.add('show');
        bookContainer.style.display = 'flex';
        currentPage = 0;
        showPage(0);
        bookContainer.scrollIntoView({ behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', nextPage);
    prevBtn.addEventListener('click', prevPage);

    document.addEventListener('keydown', function(e) {
        if (!bookContainer.classList.contains('show')) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevPage();
        }
    });

    bookContainer.addEventListener('click', function(e) {
        if (!bookContainer.classList.contains('show')) return;
        const rect = bookContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        if (x > width / 2) {
            nextPage();
        } else {
            prevPage();
        }
    });

    bookContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookContainer.addEventListener('touchend', function(e) {
        if (!bookContainer.classList.contains('show')) return;
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextPage();
            } else {
                prevPage();
            }
        }
    }, { passive: true });

    showPage(0);

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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

