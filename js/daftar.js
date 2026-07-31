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

    // ===== Status Pendaftaran =====
    const statusEl = document.getElementById('status-pendaftaran');
    const STATUS_PENDAFTARAN = 'Dibuka';

    function updateStatusPendaftaran() {
        const icon = statusEl.querySelector('.status-icon i');
        const title = statusEl.querySelector('h3');
        const desc = statusEl.querySelector('p');

        if (STATUS_PENDAFTARAN === 'Dibuka') {
            icon.className = 'bi bi-check-circle-fill';
            icon.style.color = '#25D366';
            title.textContent = 'Dibuka';
            title.style.color = '#25D366';
            desc.textContent = 'Pendaftaran peserta lomba HUT RI Ke-81 MINSOCSENT sedang dibuka. Segera daftarkan diri Anda!';
            statusEl.style.borderColor = 'rgba(37, 211, 102, 0.2)';
            statusEl.style.background = 'linear-gradient(135deg, rgba(37, 211, 102, 0.05), rgba(37, 211, 102, 0.1))';
        } else {
            icon.className = 'bi bi-x-circle-fill';
            icon.style.color = '#ff0000';
            title.textContent = 'Ditutup';
            title.style.color = '#ff0000';
            desc.textContent = 'Maaf, pendaftaran peserta lomba HUT RI Ke-81 MINSOCSENT sudah ditutup. Terima kasih atas partisipasinya.';
            statusEl.style.borderColor = 'rgba(255, 0, 0, 0.2)';
            statusEl.style.background = 'linear-gradient(135deg, rgba(255, 0, 0, 0.05), rgba(255, 0, 0, 0.1))';
        }
    }

    updateStatusPendaftaran();

    // ===== API =====
    const API_URL = 'https://script.google.com/macros/s/AKfycbxRfR9-AlBO5e-K-tc352i8qxswc0jvC2mteXVTQ_xrVa5rw1YbGjTa1nn3IgenBfqY/exec';

    const loadingEl = document.getElementById('peserta-loading');
    const contentEl = document.getElementById('peserta-content');
    const totalIndividuEl = document.getElementById('total-individu');
    const totalTimEl = document.getElementById('total-tim');
    const totalKeseluruhanEl = document.getElementById('total-keseluruhan');

function escapeHtml(text) {
        if (!text) return '-';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== HELPER: Normalisasi key kolom =====
    function normalizeKey(key) {
        return key.toLowerCase().replace(/[?()]/g, '').replace(/\s+/g, ' ').trim();
    }

    // ===== HELPER: Cari value berdasarkan pola kolom =====
    function getColumnValue(item, patterns) {
        if (!item || typeof item !== 'object') return '';
        for (var key in item) {
            var nk = normalizeKey(key);
            for (var p = 0; p < patterns.length; p++) {
                if (nk.includes(normalizeKey(patterns[p]))) {
                    var val = item[key];
                    return (val !== undefined && val !== null) ? String(val).trim() : '';
                }
            }
        }
        return '';
    }

    // ===== HELPER: Deteksi individu/kelompok =====
    function isGroupRegistration(item) {
        var kelompok = getColumnValue(item, ['nama kelompok', 'kelompok', 'nama tim', 'nama_tim']);
        return kelompok !== '';
    }

    // ===== DEBUG: simpan data mentah =====
    var debugDataRaw = null;

    // ===== FETCH + KONVERSI =====
    async function ambilDataPeserta() {
        try {
            var response = await fetch(API_URL + '?_=' + new Date().getTime());
            // Google Apps Script API kadang redirect, handle text response dulu
            var text = await response.text();
            var data;
            try {
                data = JSON.parse(text);
            } catch(e) {
                console.error('BUKAN JSON:', text.slice(0, 1000));
                return [];
            }
            
            debugDataRaw = data;
            
            // Handle array of arrays (spreadsheet format)
            if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
                var headers = data[0];
                var result = [];
                for (var r = 1; r < data.length; r++) {
                    var row = data[r];
                    if (Array.isArray(row)) {
                        var obj = {};
                        for (var c = 0; c < headers.length; c++) {
                            obj[headers[c]] = (c < row.length) ? row[c] : '';
                        }
                        result.push(obj);
                    }
                }
                return result;
            }
            
            // Handle array of objects
            if (Array.isArray(data)) return data;
            
            // Handle nested
            if (data && data.data && Array.isArray(data.data)) return data.data;
            if (data && data.records && Array.isArray(data.records)) return data.records;
            if (data && data.values && Array.isArray(data.values)) {
                var vals = data.values;
                if (vals.length > 0 && Array.isArray(vals[0])) {
                    var h = vals[0];
                    var res = [];
                    for (var r = 1; r < vals.length; r++) {
                        var row = vals[r];
                        if (Array.isArray(row)) {
                            var obj = {};
                            for (var c = 0; c < h.length; c++) {
                                obj[h[c]] = (c < row.length) ? row[c] : '';
                            }
                            res.push(obj);
                        }
                    }
                    return res;
                }
                return vals;
            }
            
            // Cari array di object
            if (data && typeof data === 'object') {
                for (var key in data) {
                    if (Array.isArray(data[key])) return data[key];
                }
            }
            
            return [];
        } catch (e) {
            console.error('ERROR FETCH:', e);
            return [];
        }
    }

    // ===== DEBUG: Tampilkan data mentah =====
    function tampilkanDebug(data, filteredCount) {
        if (!debugDataRaw) return '';
        var html = '<div class="debug-panel" style="background:#1a1a2e;color:#0f0;padding:12px;border-radius:8px;font-size:11px;margin-bottom:15px;text-align:left;max-height:300px;overflow:auto;border:1px solid #ffd700;">';
        html += '<div style="color:#ffd700;font-weight:bold;margin-bottom:8px;">📋 DEBUG - Data dari API</div>';
        html += '<div>Tipe data: ' + typeof debugDataRaw + ' | Array? ' + Array.isArray(debugDataRaw) + '</div>';
        html += '<div>Total baris (setelah konversi): ' + (data ? data.length : 0) + '</div>';
        html += '<div>Filtered: ' + filteredCount + '</div>';
        if (data && data.length > 0) {
            var keys = Object.keys(data[0]);
            html += '<div style="color:#4fc3f7;margin-top:5px;">Kolom: ' + keys.join(' | ') + '</div>';
            html += '<div style="margin-top:5px;">Item pertama:</div>';
            html += '<div style="color:#aaa;white-space:pre-wrap;font-family:monospace;">' + escapeHtml(JSON.stringify(data[0], null, 2)).slice(0, 1500) + '</div>';
        }
        html += '</div>';
        return html;
    }

    // ===== FILTER: berdasarkan kolom "Mata Lomba (wajib)" =====
    function isLombaMatch(item, namaLomba) {
        if (!item || typeof item !== 'object') return false;
        var mataLomba = getColumnValue(item, ['mata lomba', 'lomba', 'mata lomba (wajib)']);
        if (!mataLomba) return false;
        return mataLomba.toLowerCase().includes(namaLomba.toLowerCase().trim());
    }

    // ===== HITUNG STATISTIK =====
    function hitungStatistik(data) {
        var totalIndividu = 0;
        var totalKelompok = 0;
        
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            if (!item || typeof item !== 'object') continue;
            
            if (isGroupRegistration(item)) {
                totalKelompok++;
            } else {
                totalIndividu++;
            }
        }
        
        totalIndividuEl.textContent = totalIndividu;
        totalTimEl.textContent = totalKelompok;
        totalKeseluruhanEl.textContent = totalIndividu + totalKelompok;
    }

    // ===== TAMPILKAN KARTU INDIVIDU =====
    function tampilkanKartuIndividu(item, nomor) {
        var nama = getColumnValue(item, ['nama lengkap', 'nama_peserta', 'nama']);
        var wa = getColumnValue(item, ['nomor whatsapp', 'whatsapp', 'no wa', 'nomor_wa', 'nomor whatsapp ?']);
        var dusun = getColumnValue(item, ['dusun', 'rt', 'dususn', 'dusun/rt', 'alamat']);
        
        if (!nama) nama = 'Peserta ' + nomor;
        if (!wa) wa = '-';
        if (!dusun) dusun = '-';
        
        var html = '<div class="kartu-peserta">';
        html += '<div class="peserta-nomor">' + nomor + '</div>';
        html += '<div class="peserta-info">';
        html += '<div class="peserta-nama">' + escapeHtml(nama) + '</div>';
        if (wa && wa !== '-') {
            html += '<div class="peserta-dusun"><i class="bi bi-whatsapp" style="color:#25D366;"></i> ' + escapeHtml(wa) + '</div>';
        }
        if (dusun && dusun !== '-') {
            html += '<div class="peserta-dusun"><i class="bi bi-geo-alt"></i> ' + escapeHtml(dusun) + '</div>';
        }
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ===== TAMPILKAN KARTU KELOMPOK =====
    function tampilkanKartuKelompok(item, nomor) {
        // Deteksi apakah ini data individu (kosong) atau kelompok (terisi)
        var namaKelompok = getColumnValue(item, ['nama kelompok', 'kelompok', 'nama tim', 'nama_tim']);
        var ketua = getColumnValue(item, ['nama ketua', 'ketua']);
        var waKetua = getColumnValue(item, ['nomor whatsapp ketua', 'whatsapp ketua', 'wa ketua', 'nomor whatsapp ketua?']);
        
        if (!namaKelompok) return '';
        
        var anggota = [];
        for (var a = 1; a <= 8; a++) {
            var namaAnggota = getColumnValue(item, ['anggota ' + a, 'nama_anggota_' + a, 'anggota_' + a]);
            if (namaAnggota) {
                anggota.push(namaAnggota);
            }
        }
        
        if (!ketua) ketua = '-';
        if (!waKetua) waKetua = '-';
        
        var html = '<div class="kartu-tim" onclick="toggleTim(this)">';
        html += '<div class="tim-header">';
        html += '<div class="tim-icon"><i class="bi bi-people-fill"></i></div>';
        html += '<div class="tim-info">';
        html += '<div class="tim-nama">' + escapeHtml(namaKelompok) + '</div>';
        html += '<div class="tim-ketua">Ketua: ' + escapeHtml(ketua) + '</div>';
        html += '</div>';
        html += '<div class="tim-expand"><i class="bi bi-chevron-down"></i> <span>Tampilkan</span></div>';
        html += '</div>';
        html += '<div class="tim-anggota">';
        html += '<div class="anggota-item"><span class="anggota-label">Ketua</span><span class="anggota-nama">' + escapeHtml(ketua) + '</span></div>';
        if (waKetua && waKetua !== '-') {
            html += '<div class="anggota-item"><span class="anggota-label">WhatsApp</span><span class="anggota-nama">' + escapeHtml(waKetua) + '</span></div>';
        }
        if (anggota.length === 0) {
            html += '<div class="anggota-item"><span class="anggota-nama" style="color:#999;">Tidak ada data anggota</span></div>';
        } else {
            for (var a = 0; a < anggota.length; a++) {
                html += '<div class="anggota-item"><span class="anggota-label">Anggota ' + (a + 1) + '</span><span class="anggota-nama">' + escapeHtml(anggota[a]) + '</span></div>';
            }
        }
        html += '</div>';
        html += '</div>';
        return html;
    }

    // ===== TAMPILKAN SEMUA PESERTA (Langsung, tanpa filter button) =====
    async function tampilkanSemuaPeserta() {
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';
        contentEl.innerHTML = '';

        var dataPeserta = await ambilDataPeserta();
        hitungStatistik(dataPeserta);

        if (!dataPeserta || dataPeserta.length === 0) {
            loadingEl.style.display = 'none';
            contentEl.style.display = 'grid';
            contentEl.innerHTML = '<div class="peserta-empty"><i class="bi bi-inbox"></i> Belum ada data peserta dari Google Sheet.</div>';
            return;
        }

        // Group by Mata Lomba
        var groups = {};
        for (var i = 0; i < dataPeserta.length; i++) {
            var item = dataPeserta[i];
            var mataLomba = getColumnValue(item, ['mata lomba', 'lomba', 'mata lomba (wajib)']);
            if (!mataLomba) mataLomba = 'Tanpa Kategori';
            if (!groups[mataLomba]) groups[mataLomba] = [];
            groups[mataLomba].push(item);
        }

        var html = '';
        var urutan = 0;
        
        // Loop setiap kategori lomba
        for (var lomba in groups) {
            var pesertaList = groups[lomba];
            var kelompokCount = 0;
            var individuCount = 0;
            
            // Hitung dulu
            for (var i = 0; i < pesertaList.length; i++) {
                if (isGroupRegistration(pesertaList[i])) {
                    kelompokCount++;
                } else {
                    individuCount++;
                }
            }

            html += '<div class="lomba-group" style="margin-bottom:30px;">';
            html += '<div class="lomba-group-header" style="background:linear-gradient(135deg,#ff0000,#cc0000);color:#fff;padding:12px 20px;border-radius:12px;margin-bottom:15px;display:flex;align-items:center;justify-content:space-between;">';
            html += '<div><i class="bi bi-trophy-fill" style="margin-right:8px;"></i><strong>' + escapeHtml(lomba) + '</strong></div>';
            html += '<div style="font-size:13px;opacity:0.9;">' + pesertaList.length + ' peserta</div>';
            html += '</div>';
            
            // Tampilkan individu dulu
            for (var i = 0; i < pesertaList.length; i++) {
                if (!isGroupRegistration(pesertaList[i])) {
                    urutan++;
                    html += tampilkanKartuIndividu(pesertaList[i], urutan);
                }
            }
            
            // Tampilkan kelompok
            for (var i = 0; i < pesertaList.length; i++) {
                if (isGroupRegistration(pesertaList[i])) {
                    urutan++;
                    html += tampilkanKartuKelompok(pesertaList[i], urutan);
                }
            }
            
            html += '</div>';
        }

        loadingEl.style.display = 'none';
        contentEl.style.display = 'grid';
        contentEl.innerHTML = tampilkanDebug(dataPeserta, dataPeserta.length) + html;
    }

    // ===== INISIALISASI =====
    async function initData() {
        loadingEl.style.display = 'block';
        contentEl.style.display = 'none';

        var data = await ambilDataPeserta();

        if (!data || data.length === 0) {
            loadingEl.style.display = 'none';
            contentEl.style.display = 'grid';
            contentEl.innerHTML = '<div class="peserta-empty"><i class="bi bi-inbox"></i> Belum ada data peserta dari Google Sheet.</div>';
            return;
        }

        hitungStatistik(data);
        tampilkanSemuaPeserta();
    }

    initData();
});

function toggleTim(el) {
    el.classList.toggle('expanded');
}

