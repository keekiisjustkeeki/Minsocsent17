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

let designURL = null;


/* =========================
   UPLOAD DESAIN
========================= */

designInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    if (designURL) {
        URL.revokeObjectURL(designURL);
    }

    designURL = URL.createObjectURL(file);

});


/* =========================
   GENERATE
========================= */

generateBtn.addEventListener("click", generateCoupons);


function generateCoupons() {

    if (!designURL) {
        alert("Silakan upload desain kupon terlebih dahulu.");
        return;
    }

    const start = parseInt(startNumber.value) || 1;
    const total = parseInt(totalNumber.value) || 1;

    const cols = parseInt(columns.value) || 1;
    const rws = parseInt(rows.value) || 1;

    const paddingLength = parseInt(padding.value) || 1;

    const gapMM = parseFloat(gap.value) || 0;

    const position = numberPosition.value;

    const couponsPerPage = cols * rws;

    const totalPages = Math.ceil(total / couponsPerPage);

    perPageText.textContent = couponsPerPage;
    pageCountText.textContent = totalPages;

    preview.innerHTML = "";

    let currentNumber = start;

    for (let page = 0; page < totalPages; page++) {

        const pageElement = document.createElement("div");

        pageElement.className = "a4-page";

        pageElement.style.gridTemplateColumns =
            `repeat(${cols}, 1fr)`;

        pageElement.style.gridTemplateRows =
            `repeat(${rws}, 1fr)`;

        pageElement.style.gap = `${gapMM}mm`;


        for (let i = 0; i < couponsPerPage; i++) {

            if (currentNumber >= start + total) {
                break;
            }

            const coupon = document.createElement("div");

            coupon.className = "coupon";


            const image = document.createElement("img");

            image.src = designURL;

            coupon.appendChild(image);


            const number = document.createElement("div");

            number.className =
                `coupon-number ${position}`;


            number.textContent =
                String(currentNumber)
                .padStart(paddingLength, "0");


            coupon.appendChild(number);

            pageElement.appendChild(coupon);

            currentNumber++;

        }

        preview.appendChild(pageElement);

    }

}


/* =========================
   PRINT / PDF
========================= */

printBtn.addEventListener("click", function () {

    if (!preview.children.length) {

        alert("Generate kupon terlebih dahulu.");

        return;

    }

    window.print();

});


/* =========================
   UPDATE INFO OTOMATIS
========================= */

function updateInfo() {

    const cols = parseInt(columns.value) || 1;
    const rws = parseInt(rows.value) || 1;

    const total = parseInt(totalNumber.value) || 1;

    const perPage = cols * rws;

    const pages = Math.ceil(total / perPage);

    perPageText.textContent = perPage;

    pageCountText.textContent = pages;

}


columns.addEventListener("input", updateInfo);
rows.addEventListener("input", updateInfo);
totalNumber.addEventListener("input", updateInfo);

updateInfo();