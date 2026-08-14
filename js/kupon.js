const designInput = document.getElementById("designInput");

const startNumber = document.getElementById("startNumber");
const totalNumber = document.getElementById("totalNumber");

const columns = document.getElementById("columns");
const rows = document.getElementById("rows");

const padding = document.getElementById("padding");
const gap = document.getElementById("gap");

const numberPosition = document.getElementById("numberPosition");

const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");

const preview = document.getElementById("preview");

const perPageText = document.getElementById("perPage");
const pageCountText = document.getElementById("pageCount");

const designStatus = document.getElementById("designStatus");
const detectionResult = document.getElementById("detectionResult");


let designURL = null;

let designImage = null;

let detectedNumberBox = null;


/* =========================
   UPLOAD DESAIN
========================= */

designInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (designURL) {
        URL.revokeObjectURL(designURL);
    }

    designURL = URL.createObjectURL(file);

    designStatus.textContent =
        `Desain: ${file.name}`;

    detectionResult.className =
        "detection-result";

    detectionResult.innerHTML =
        `<i class="bi bi-hourglass-split"></i>
         <span>Menganalisis desain...</span>`;

    const image = new Image();

    image.onload = function () {

        designImage = image;

        detectedNumberBox =
            detectNumberArea(image);

        if (detectedNumberBox) {

            detectionResult.className =
                "detection-result success";

            detectionResult.innerHTML =
                `<i class="bi bi-check-circle"></i>
                 <span>
                    Area nomor berhasil dideteksi secara otomatis.
                 </span>`;

        } else {

            detectionResult.className =
                "detection-result warning";

            detectionResult.innerHTML =
                `<i class="bi bi-exclamation-circle"></i>
                 <span>
                    Area nomor tidak terdeteksi. Posisi manual akan digunakan.
                 </span>`;
        }
    };

    image.onerror = function () {

        designImage = null;

        detectedNumberBox = null;

        detectionResult.className =
            "detection-result error";

        detectionResult.innerHTML =
            `<i class="bi bi-x-circle"></i>
             <span>
                Desain gagal dibaca.
             </span>`;
    };

    image.src = designURL;
});


/* =========================
   DETEKSI AREA NOMOR
========================= */

function detectNumberArea(image) {

    const canvas = document.createElement("canvas");

    const maxSize = 1000;

    let width = image.naturalWidth;
    let height = image.naturalHeight;

    const scale =
        Math.min(1, maxSize / Math.max(width, height));

    width = Math.max(1, Math.round(width * scale));
    height = Math.max(1, Math.round(height * scale));

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", {
        willReadFrequently: true
    });

    ctx.drawImage(
        image,
        0,
        0,
        width,
        height
    );

    const imageData =
        ctx.getImageData(
            0,
            0,
            width,
            height
        );

    const data = imageData.data;


    /*
     * Membuat peta pixel gelap.
     *
     * Garis kotak / garis putus-putus
     * biasanya mempunyai pixel yang jauh
     * lebih gelap dibanding area kosong.
     */

    const darkMap =
        new Uint8Array(width * height);


    for (let y = 0; y < height; y++) {

        for (let x = 0; x < width; x++) {

            const index =
                (y * width + x) * 4;

            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            const a = data[index + 3];

            if (a < 80) {
                continue;
            }

            const brightness =
                (r + g + b) / 3;

            if (brightness < 120) {

                darkMap[y * width + x] = 1;
            }
        }
    }


    /*
     * Cari kandidat garis horizontal.
     */

    const horizontalLines = [];

    for (let y = 0; y < height; y++) {

        let count = 0;

        for (let x = 0; x < width; x++) {

            if (darkMap[y * width + x]) {
                count++;
            }
        }

        const ratio =
            count / width;

        if (ratio >= 0.08 && ratio <= 0.85) {

            horizontalLines.push(y);
        }
    }


    /*
     * Cari kandidat garis vertikal.
     */

    const verticalLines = [];

    for (let x = 0; x < width; x++) {

        let count = 0;

        for (let y = 0; y < height; y++) {

            if (darkMap[y * width + x]) {
                count++;
            }
        }

        const ratio =
            count / height;

        if (ratio >= 0.08 && ratio <= 0.85) {

            verticalLines.push(x);
        }
    }


    const horizontalGroups =
        groupNearbyValues(horizontalLines);

    const verticalGroups =
        groupNearbyValues(verticalLines);


    const horizontalCenters =
        horizontalGroups.map(group =>
            average(group)
        );

    const verticalCenters =
        verticalGroups.map(group =>
            average(group)
        );


    /*
     * Membentuk kandidat kotak dari
     * perpotongan garis horizontal
     * dan vertikal.
     */

    const candidates = [];


    for (let i = 0; i < horizontalCenters.length; i++) {

        for (let j = i + 1; j < horizontalCenters.length; j++) {

            const top =
                horizontalCenters[i];

            const bottom =
                horizontalCenters[j];

            const boxHeight =
                bottom - top;

            if (boxHeight < height * 0.03) {
                continue;
            }

            if (boxHeight > height * 0.5) {
                continue;
            }


            for (let a = 0; a < verticalCenters.length; a++) {

                for (let b = a + 1; b < verticalCenters.length; b++) {

                    const left =
                        verticalCenters[a];

                    const right =
                        verticalCenters[b];

                    const boxWidth =
                        right - left;

                    if (boxWidth < width * 0.03) {
                        continue;
                    }

                    if (boxWidth > width * 0.7) {
                        continue;
                    }


                    const ratio =
                        boxWidth / boxHeight;


                    /*
                     * Area nomor biasanya
                     * berbentuk rectangle.
                     */

                    if (ratio < 0.2 || ratio > 8) {
                        continue;
                    }


                    /*
                     * Jangan mengambil border
                     * luar gambar.
                     */

                    const margin = width * 0.03;

                    if (left < margin) {
                        continue;
                    }

                    if (right > width - margin) {
                        continue;
                    }

                    if (top < height * 0.03) {
                        continue;
                    }

                    if (bottom > height * 0.97) {
                        continue;
                    }


                    candidates.push({
                        left,
                        top,
                        right,
                        bottom,
                        width: boxWidth,
                        height: boxHeight
                    });
                }
            }
        }
    }


    if (!candidates.length) {
        return null;
    }


    /*
     * Nilai kandidat.
     *
     * Kita lebih menyukai kotak:
     *
     * - tidak terlalu besar
     * - cukup jelas
     * - berada di area desain
     */

    candidates.forEach(candidate => {

        const area =
            candidate.width *
            candidate.height;

        const imageArea =
            width * height;

        const areaRatio =
            area / imageArea;


        let score = 0;


        /*
         * Kotak kecil sampai menengah
         * lebih mungkin menjadi area nomor.
         */

        if (areaRatio >= 0.005 &&
            areaRatio <= 0.25) {

            score += 30;
        }


        /*
         * Rasio kupon nomor biasanya
         * tidak terlalu ekstrem.
         */

        const ratio =
            candidate.width /
            candidate.height;

        if (ratio >= 0.5 &&
            ratio <= 5) {

            score += 20;
        }


        /*
         * Area dekat bagian bawah
         * atau samping sering digunakan
         * untuk nomor kupon.
         */

        const centerX =
            (candidate.left +
             candidate.right) / 2;

        const centerY =
            (candidate.top +
             candidate.bottom) / 2;


        const normalizedX =
            centerX / width;

        const normalizedY =
            centerY / height;


        if (normalizedY > 0.5) {
            score += 10;
        }

        if (normalizedX > 0.5) {
            score += 10;
        }


        /*
         * Hindari kotak yang terlalu dekat
         * dengan tepi desain.
         */

        const edgeDistance =
            Math.min(
                candidate.left,
                width - candidate.right,
                candidate.top,
                height - candidate.bottom
            );


        if (edgeDistance > width * 0.05) {
            score += 15;
        }


        candidate.score = score;
    });


    candidates.sort(
        (a, b) => b.score - a.score
    );


    const best =
        candidates[0];


    if (!best || best.score < 40) {
        return null;
    }


    /*
     * Kembalikan posisi dalam
     * koordinat persentase.
     */

    return {
        left:
            (best.left / width) * 100,

        top:
            (best.top / height) * 100,

        width:
            (best.width / width) * 100,

        height:
            (best.height / height) * 100
    };
}


/* =========================
   GROUP PIXEL
========================= */

function groupNearbyValues(values) {

    if (!values.length) {
        return [];
    }

    const groups = [];

    let current = [values[0]];

    for (let i = 1; i < values.length; i++) {

        const previous =
            values[i - 1];

        const currentValue =
            values[i];

        if (currentValue - previous <= 3) {

            current.push(currentValue);

        } else {

            groups.push(current);

            current = [currentValue];
        }
    }

    groups.push(current);

    return groups;
}


/* =========================
   AVERAGE
========================= */

function average(values) {

    if (!values.length) {
        return 0;
    }

    return values.reduce(
        (sum, value) => sum + value,
        0
    ) / values.length;
}


/* =========================
   GENERATE
========================= */

generateBtn.addEventListener(
    "click",
    generateCoupons
);


function generateCoupons() {

    if (!designURL) {

        alert(
            "Silakan upload desain kupon terlebih dahulu."
        );

        return;
    }


    const start =
        Math.max(
            0,
            parseInt(startNumber.value) || 1
        );


    const total =
        Math.max(
            1,
            parseInt(totalNumber.value) || 1
        );


    const cols =
        Math.max(
            1,
            parseInt(columns.value) || 1
        );


    const rws =
        Math.max(
            1,
            parseInt(rows.value) || 1
        );


    const paddingLength =
        Math.max(
            1,
            parseInt(padding.value) || 1
        );


    const gapMM =
        Math.max(
            0,
            parseFloat(gap.value) || 0
        );


    const position =
        numberPosition.value;


    const couponsPerPage =
        cols * rws;


    /*
     * PENTING:
     *
     * Total Nomor = nomor unik.
     *
     * Setiap nomor dicetak 2 kali.
     */

    const totalCoupons =
        total * 2;


    const totalPages =
        Math.ceil(
            totalCoupons /
            couponsPerPage
        );


    perPageText.textContent =
        couponsPerPage;


    pageCountText.textContent =
        totalPages;


    preview.innerHTML = "";


    let couponIndex = 0;


    for (
        let page = 0;
        page < totalPages;
        page++
    ) {

        const pageElement =
            document.createElement("div");


        pageElement.className =
            "a4-page";


        pageElement.style.gridTemplateColumns =
            `repeat(${cols}, 1fr)`;


        pageElement.style.gridTemplateRows =
            `repeat(${rws}, 1fr)`;


        pageElement.style.gap =
            `${gapMM}mm`;


        for (
            let i = 0;
            i < couponsPerPage;
            i++
        ) {


            if (
                couponIndex >=
                totalCoupons
            ) {

                break;
            }


            const coupon =
                document.createElement("div");


            coupon.className =
                "coupon";


            const image =
                document.createElement("img");


            image.src =
                designURL;


            coupon.appendChild(image);


            /*
             * Nomor naik setiap 2 kupon.
             *
             * 0 / 2 = 0
             * 1 / 2 = 0
             * 2 / 2 = 1
             * 3 / 2 = 1
             */

            const currentNumber =
                start +
                Math.floor(
                    couponIndex / 2
                );


            const formattedNumber =
                String(currentNumber)
                .padStart(
                    paddingLength,
                    "0"
                );


            const number =
                document.createElement("div");


            number.className =
                "coupon-number";


            number.textContent =
                formattedNumber;


            /*
             * AUTO DETECT
             */

            if (
                position === "auto" &&
                detectedNumberBox
            ) {

                number.classList.add(
                    "auto-number"
                );


                number.style.left =
                    `${detectedNumberBox.left}%`;


                number.style.top =
                    `${detectedNumberBox.top}%`;


                number.style.width =
                    `${detectedNumberBox.width}%`;


                number.style.height =
                    `${detectedNumberBox.height}%`;


            } else {

                /*
                 * FALLBACK MANUAL
                 */

                number.classList.add(
                    position === "auto"
                        ? "bottom-right"
                        : position
                );
            }


            coupon.appendChild(number);

            pageElement.appendChild(coupon);


            couponIndex++;
        }


        preview.appendChild(
            pageElement
        );
    }
}


/* =========================
   PRINT / PDF
========================= */

printBtn.addEventListener(
    "click",
    function () {

        if (
            !preview.children.length
        ) {

            alert(
                "Generate kupon terlebih dahulu."
            );

            return;
        }


        window.print();
    }
);


/* =========================
   UPDATE INFO
========================= */

function updateInfo() {

    const cols =
        Math.max(
            1,
            parseInt(columns.value) || 1
        );


    const rws =
        Math.max(
            1,
            parseInt(rows.value) || 1
        );


    const total =
        Math.max(
            1,
            parseInt(totalNumber.value) || 1
        );


    const perPage =
        cols * rws;


    /*
     * Setiap nomor = 2 kupon.
     */

    const totalCoupons =
        total * 2;


    const pages =
        Math.ceil(
            totalCoupons /
            perPage
        );


    perPageText.textContent =
        perPage;


    pageCountText.textContent =
        pages;
}


columns.addEventListener(
    "input",
    updateInfo
);


rows.addEventListener(
    "input",
    updateInfo
);


totalNumber.addEventListener(
    "input",
    updateInfo
);


updateInfo();