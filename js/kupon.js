const normalModeBtn = document.getElementById("normalModeBtn");
const autoModeBtn = document.getElementById("autoModeBtn");

const normalMode = document.getElementById("normalMode");
const autoMode = document.getElementById("autoMode");

const designInput = document.getElementById("designInput");
const autoDesignInput = document.getElementById("autoDesignInput");

const designStatus = document.getElementById("designStatus");
const autoDesignStatus = document.getElementById("autoDesignStatus");

const startNumber = document.getElementById("startNumber");
const totalNumber = document.getElementById("totalNumber");

const columns = document.getElementById("columns");
const rows = document.getElementById("rows");

const padding = document.getElementById("padding");
const gap = document.getElementById("gap");

const numberPosition = document.getElementById("numberPosition");

const autoStartNumber = document.getElementById("autoStartNumber");
const autoTotalNumber = document.getElementById("autoTotalNumber");
const autoPadding = document.getElementById("autoPadding");
const autoFontSize = document.getElementById("autoFontSize");
const autoColumns = document.getElementById("autoColumns");
const autoRows = document.getElementById("autoRows");
const autoGap = document.getElementById("autoGap");

const autoFontWeight =
    document.getElementById("autoFontWeight");

const autoTextColor =
    document.getElementById("autoTextColor");

const autoBackgroundColor =
    document.getElementById("autoBackgroundColor");

const autoBackgroundOpacity =
    document.getElementById("autoBackgroundOpacity");

const autoBackgroundOpacityValue =
    document.getElementById("autoBackgroundOpacityValue");

const autoPaddingBox =
    document.getElementById("autoPaddingBox");

const autoRadius =
    document.getElementById("autoRadius");

const autoOrientation =
    document.getElementById("autoOrientation");

const autoTransparent =
    document.getElementById("autoTransparent");

const numberStylePreview =
    document.getElementById("numberStylePreview");

const generateNormalBtn =
    document.getElementById("generateNormalBtn");

const generateAutoBtn =
    document.getElementById("generateAutoBtn");

const printBtn =
    document.getElementById("printBtn");

const preview =
    document.getElementById("preview");

const perPageText =
    document.getElementById("perPage");

const pageCountText =
    document.getElementById("pageCount");

const designSelector =
    document.getElementById("designSelector");

const selectorImage =
    document.getElementById("selectorImage");

const marker1 =
    document.getElementById("marker1");

const marker2 =
    document.getElementById("marker2");

const selectionStatus =
    document.getElementById("selectionStatus");

const point1Text =
    document.getElementById("point1Text");

const point2Text =
    document.getElementById("point2Text");

const resetPointsBtn =
    document.getElementById("resetPointsBtn");

let normalDesignURL = null;
let autoDesignURL = null;

let point1 = null;
let point2 = null;

let currentPoint = 1;

function setMode(mode) {

    if (mode === "normal") {

        normalModeBtn.classList.add("active");
        autoModeBtn.classList.remove("active");

        normalMode.classList.remove("hidden");
        autoMode.classList.add("hidden");

    } else {

        normalModeBtn.classList.remove("active");
        autoModeBtn.classList.add("active");

        normalMode.classList.add("hidden");
        autoMode.classList.remove("hidden");
    }
}

normalModeBtn.addEventListener(
    "click",
    function () {
        setMode("normal");
    }
);

autoModeBtn.addEventListener(
    "click",
    function () {
        setMode("auto");
    }
);

designInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        if (normalDesignURL) {
            URL.revokeObjectURL(normalDesignURL);
        }

        normalDesignURL =
            URL.createObjectURL(file);

        designStatus.textContent =
            `Desain: ${file.name}`;
    }
);

autoDesignInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        if (autoDesignURL) {
            URL.revokeObjectURL(autoDesignURL);
        }

        autoDesignURL =
            URL.createObjectURL(file);

        autoDesignStatus.textContent =
            `Desain: ${file.name}`;

        selectorImage.src =
            autoDesignURL;

        selectorImage.onload =
            function () {

                designSelector.classList.add(
                    "has-image"
                );

                resetPoints();
            };
    }
);

designSelector.addEventListener(
    "pointerdown",
    function (event) {

        if (
            !autoDesignURL ||
            !designSelector.classList.contains(
                "has-image"
            )
        ) {
            return;
        }

        const rect =
            selectorImage.getBoundingClientRect();

        if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        ) {
            return;
        }

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;

        const xPercent =
            (x / rect.width) * 100;

        const yPercent =
            (y / rect.height) * 100;

        setSelectedPoint(
            currentPoint,
            xPercent,
            yPercent
        );

        if (currentPoint === 1) {
            currentPoint = 2;
        } else {
            currentPoint = 1;
        }

        event.preventDefault();
    }
);

function setSelectedPoint(
    pointNumber,
    xPercent,
    yPercent
) {

    const point = {
        x: xPercent,
        y: yPercent
    };

    if (pointNumber === 1) {

        point1 = point;

        marker1.style.left =
            `${xPercent}%`;

        marker1.style.top =
            `${yPercent}%`;

        marker1.classList.add("active");

        point1Text.textContent =
            `${formatPercent(xPercent)}% × ${formatPercent(yPercent)}%`;

    } else {

        point2 = point;

        marker2.style.left =
            `${xPercent}%`;

        marker2.style.top =
            `${yPercent}%`;

        marker2.classList.add("active");

        point2Text.textContent =
            `${formatPercent(xPercent)}% × ${formatPercent(yPercent)}%`;
    }

    updateSelectionStatus();
}

function formatPercent(value) {
    return Number(value).toFixed(2);
}

function updateSelectionStatus() {

    if (point1 && point2) {

        selectionStatus.classList.add("ready");

        selectionStatus.textContent =
            "2 titik sudah dipilih. Desain siap digunakan.";

        return;
    }

    selectionStatus.classList.remove("ready");

    if (point1) {

        selectionStatus.textContent =
            "Titik 1 sudah dipilih. Sekarang pilih titik 2.";

        return;
    }

    selectionStatus.textContent =
        "Klik atau tap lokasi tengah nomor 1 untuk memilih titik pertama.";
}

function resetPoints() {

    point1 = null;
    point2 = null;
    currentPoint = 1;

    marker1.classList.remove("active");
    marker2.classList.remove("active");

    point1Text.textContent =
        "Belum dipilih";

    point2Text.textContent =
        "Belum dipilih";

    updateSelectionStatus();
}

resetPointsBtn.addEventListener(
    "click",
    resetPoints
);

generateNormalBtn.addEventListener(
    "click",
    generateNormalCoupons
);

generateAutoBtn.addEventListener(
    "click",
    generateAutoCoupons
);

function getNumberValue(
    element,
    defaultValue,
    minimum
) {

    const value =
        parseInt(element.value);

    if (Number.isNaN(value)) {
        return defaultValue;
    }

    return Math.max(
        minimum,
        value
    );
}

function getFloatValue(
    element,
    defaultValue,
    minimum
) {

    const value =
        parseFloat(element.value);

    if (Number.isNaN(value)) {
        return defaultValue;
    }

    return Math.max(
        minimum,
        value
    );
}

function generateNormalCoupons() {

    if (!normalDesignURL) {

        alert(
            "Silakan upload desain kupon terlebih dahulu."
        );

        return;
    }

    const start =
        getNumberValue(
            startNumber,
            1,
            0
        );

    const total =
        getNumberValue(
            totalNumber,
            1,
            1
        );

    const cols =
        getNumberValue(
            columns,
            2,
            1
        );

    const rws =
        getNumberValue(
            rows,
            5,
            1
        );

    const paddingLength =
        getNumberValue(
            padding,
            3,
            1
        );

    const gapMM =
        getFloatValue(
            gap,
            2,
            0
        );

    const position =
        numberPosition.value;

    const couponsPerPage =
        cols * rws;

    const totalPages =
        Math.ceil(
            total / couponsPerPage
        );

    updatePageInfo(
        couponsPerPage,
        totalPages
    );

    preview.innerHTML = "";

    let couponIndex = 0;

    for (
        let page = 0;
        page < totalPages;
        page++
    ) {

        const pageElement =
            createPage(
                cols,
                rws,
                gapMM
            );

        for (
            let i = 0;
            i < couponsPerPage;
            i++
        ) {

            if (couponIndex >= total) {
                break;
            }

            const currentNumber =
                start + couponIndex;

            const formattedNumber =
                formatNumber(
                    currentNumber,
                    paddingLength
                );

            const coupon =
                createCoupon(
                    normalDesignURL
                );

            const number =
                document.createElement("div");

            number.className =
                "coupon-number";

            number.textContent =
                formattedNumber;

            number.classList.add(
                position
            );

            coupon.appendChild(number);
            pageElement.appendChild(coupon);

            couponIndex++;
        }

        preview.appendChild(pageElement);
    }

    scrollToPreview();
}

function generateAutoCoupons() {

    if (!autoDesignURL) {

        alert(
            "Silakan upload desain kupon terlebih dahulu."
        );

        return;
    }

    if (!point1 || !point2) {

        alert(
            "Silakan pilih 2 titik nomor terlebih dahulu."
        );

        return;
    }

    const start =
        getNumberValue(
            autoStartNumber,
            1,
            0
        );

    const total =
        getNumberValue(
            autoTotalNumber,
            1,
            1
        );

    const paddingLength =
        getNumberValue(
            autoPadding,
            3,
            1
        );

    const fontSize =
        getNumberValue(
            autoFontSize,
            18,
            6
        );

    const cols =
        getNumberValue(
            autoColumns,
            4,
            1
        );

    const rws =
        getNumberValue(
            autoRows,
            15,
            1
        );

    const gapMM =
        getFloatValue(
            autoGap,
            2,
            0
        );

    const fontWeight =
        autoFontWeight.value;

    const textColor =
        autoTextColor.value;

    const backgroundColor =
        autoBackgroundColor.value;

    const backgroundOpacity =
        getNumberValue(
            autoBackgroundOpacity,
            100,
            0
        );

    const boxPadding =
        getNumberValue(
            autoPaddingBox,
            5,
            0
        );

    const radius =
        getNumberValue(
            autoRadius,
            3,
            0
        );

    const orientation =
        autoOrientation.value;

    const transparent =
        autoTransparent.checked;

    const couponsPerPage =
        cols * rws;

    const totalPages =
        Math.ceil(
            total / couponsPerPage
        );

    updatePageInfo(
        couponsPerPage,
        totalPages
    );

    preview.innerHTML = "";

    let couponIndex = 0;

    for (
        let page = 0;
        page < totalPages;
        page++
    ) {

        const pageElement =
            createPage(
                cols,
                rws,
                gapMM
            );

        for (
            let i = 0;
            i < couponsPerPage;
            i++
        ) {

            if (couponIndex >= total) {
                break;
            }

            const currentNumber =
                start + couponIndex;

            const formattedNumber =
                formatNumber(
                    currentNumber,
                    paddingLength
                );

            const coupon =
                createCoupon(
                    autoDesignURL
                );

            createAutoNumber(
                coupon,
                formattedNumber,
                point1,
                fontSize,
                fontWeight,
                textColor,
                backgroundColor,
                backgroundOpacity,
                boxPadding,
                radius,
                false,
                transparent
            );

            createAutoNumber(
                coupon,
                formattedNumber,
                point2,
                fontSize,
                fontWeight,
                textColor,
                backgroundColor,
                backgroundOpacity,
                boxPadding,
                radius,
                orientation === "horizontal",
                transparent
            );

            pageElement.appendChild(coupon);

            couponIndex++;
        }

        preview.appendChild(pageElement);
    }

    scrollToPreview();
}

function createPage(
    cols,
    rows,
    gapMM
) {

    const page =
        document.createElement("div");

    page.className =
        "a4-page";

    page.style.gridTemplateColumns =
        `repeat(${cols}, 1fr)`;

    page.style.gridTemplateRows =
        `repeat(${rows}, 1fr)`;

    page.style.gap =
        `${gapMM}mm`;

    return page;
}

function createCoupon(imageURL) {

    const coupon =
        document.createElement("div");

    coupon.className =
        "coupon";

    const image =
        document.createElement("img");

    image.src =
        imageURL;

    coupon.appendChild(image);

    return coupon;
}

function createAutoNumber(
    coupon,
    text,
    point,
    fontSize,
    fontWeight,
    textColor,
    backgroundColor,
    backgroundOpacity,
    boxPadding,
    radius,
    horizontal,
    transparent
) {

    const number =
        document.createElement("div");

    number.className =
        "coupon-number auto-number";

    if (horizontal) {
        number.classList.add("horizontal");
    }

    number.textContent =
        text;

    number.style.left =
        `${point.x}%`;

    number.style.top =
        `${point.y}%`;

    number.style.fontSize =
        `${fontSize}px`;

    number.style.fontWeight =
        fontWeight;

    number.style.color =
        textColor;

    number.style.padding =
        `${boxPadding}px`;

    number.style.borderRadius =
        `${radius}px`;

    if (transparent) {

        number.style.background =
            "transparent";

    } else {

        number.style.background =
            hexToRgba(
                backgroundColor,
                backgroundOpacity / 100
            );
    }

    coupon.appendChild(number);
}

function hexToRgba(
    hex,
    alpha
) {

    const clean =
        hex.replace("#", "");

    const r =
        parseInt(
            clean.substring(0, 2),
            16
        );

    const g =
        parseInt(
            clean.substring(2, 4),
            16
        );

    const b =
        parseInt(
            clean.substring(4, 6),
            16
        );

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function formatNumber(
    number,
    paddingLength
) {

    return String(number)
        .padStart(
            paddingLength,
            "0"
        );
}

function updatePageInfo(
    perPage,
    pages
) {

    perPageText.textContent =
        perPage;

    pageCountText.textContent =
        pages;
}

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

function scrollToPreview() {

    setTimeout(
        function () {

            preview.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        },
        100
    );
}

function updateNumberStylePreview() {

    const fontSize =
        getNumberValue(
            autoFontSize,
            18,
            6
        );

    const fontWeight =
        autoFontWeight.value;

    const textColor =
        autoTextColor.value;

    const backgroundColor =
        autoBackgroundColor.value;

    const opacity =
        getNumberValue(
            autoBackgroundOpacity,
            100,
            0
        );

    const paddingValue =
        getNumberValue(
            autoPaddingBox,
            5,
            0
        );

    const radiusValue =
        getNumberValue(
            autoRadius,
            3,
            0
        );

    numberStylePreview.style.fontSize =
        `${fontSize}px`;

    numberStylePreview.style.fontWeight =
        fontWeight;

    numberStylePreview.style.color =
        textColor;

    numberStylePreview.style.padding =
        `${paddingValue}px`;

    numberStylePreview.style.borderRadius =
        `${radiusValue}px`;

    if (autoTransparent.checked) {

        numberStylePreview.style.background =
            "transparent";

    } else {

        numberStylePreview.style.background =
            hexToRgba(
                backgroundColor,
                opacity / 100
            );
    }

    numberStylePreview.textContent =
        formatNumber(
            getNumberValue(
                autoStartNumber,
                1,
                0
            ),
            getNumberValue(
                autoPadding,
                3,
                1
            )
        );
}

[
    autoFontSize,
    autoFontWeight,
    autoTextColor,
    autoBackgroundColor,
    autoBackgroundOpacity,
    autoPaddingBox,
    autoRadius,
    autoTransparent,
    autoStartNumber,
    autoPadding
].forEach(
    element => {

        element.addEventListener(
            "input",
            updateNumberStylePreview
        );

        element.addEventListener(
            "change",
            updateNumberStylePreview
        );
    }
);

autoBackgroundOpacity.addEventListener(
    "input",
    function () {

        autoBackgroundOpacityValue.textContent =
            `${autoBackgroundOpacity.value}%`;

        updateNumberStylePreview();
    }
);

columns.addEventListener(
    "input",
    function () {}
);

rows.addEventListener(
    "input",
    function () {}
);

totalNumber.addEventListener(
    "input",
    function () {}
);

autoColumns.addEventListener(
    "input",
    function () {}
);

autoRows.addEventListener(
    "input",
    function () {}
);

autoTotalNumber.addEventListener(
    "input",
    function () {}
);

updateNumberStylePreview();

window.addEventListener(
    "beforeunload",
    function () {

        if (normalDesignURL) {
            URL.revokeObjectURL(normalDesignURL);
        }

        if (autoDesignURL) {
            URL.revokeObjectURL(autoDesignURL);
        }
    }
);