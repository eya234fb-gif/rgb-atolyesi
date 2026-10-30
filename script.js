const colors = ["red", "green", "blue"];

function updateColor() {
    const red = Number(document.getElementById("red").value);
    const green = Number(document.getElementById("green").value);
    const blue = Number(document.getElementById("blue").value);

    const rgb = `rgb(${red}, ${green}, ${blue})`;
    document.getElementById("colorPreview").style.backgroundColor = rgb;
    document.getElementById("rgbText").textContent = rgb;

    const hex = "#" + [red, green, blue]
        .map(value => value.toString(16).padStart(2, "0"))
        .join("");

    document.getElementById("hexText").textContent = hex;
}

colors.forEach(color => {
    const slider = document.getElementById(color);
    const number = document.getElementById(color + "Number");

    slider.addEventListener("input", () => {
        number.value = slider.value;
        updateColor();
    });

    number.addEventListener("input", () => {
        if (number.value === "") return;

        let value = Number(number.value);
        value = Math.max(0, Math.min(255, value));

        number.value = value;
        slider.value = value;
        updateColor();
    });

    number.addEventListener("change", () => {
        if (number.value === "") {
            number.value = slider.value;
        }
    });
});

updateColor();

document.getElementById("createButton").addEventListener("click", () => {
    const red = Number(document.getElementById("red").value);
    const green = Number(document.getElementById("green").value);
    const blue = Number(document.getElementById("blue").value);

    const output = document.getElementById("imageOutput");
    output.innerHTML = "";

    const canvas = document.createElement("canvas");
    canvas.width = 700;
    canvas.height = 400;

    const context = canvas.getContext("2d");

    const mainColor = `rgb(${red}, ${green}, ${blue})`;
    const lightColor = `rgb(
        ${Math.min(red + 70, 255)},
        ${Math.min(green + 70, 255)},
        ${Math.min(blue + 70, 255)}
    )`;
    const darkColor = `rgb(
        ${Math.max(red - 60, 0)},
        ${Math.max(green - 60, 0)},
        ${Math.max(blue - 60, 0)}
    )`;

    // Gökyüzü
    const sky = context.createLinearGradient(0, 0, 0, 400);
    sky.addColorStop(0, lightColor);
    sky.addColorStop(1, mainColor);
    context.fillStyle = sky;
    context.fillRect(0, 0, 700, 400);

    // Güneş
    context.beginPath();
    context.arc(540, 105, 48, 0, Math.PI * 2);
    context.fillStyle = "rgba(255, 240, 180, 0.9)";
    context.fill();

    // Uzak dağlar
    context.beginPath();
    context.moveTo(0, 280);
    context.lineTo(150, 110);
    context.lineTo(300, 280);
    context.lineTo(450, 135);
    context.lineTo(700, 290);
    context.lineTo(700, 400);
    context.lineTo(0, 400);
    context.closePath();
    context.fillStyle = lightColor;
    context.fill();

    // Ön plandaki tepeler
    context.beginPath();
    context.moveTo(0, 315);
    context.quadraticCurveTo(180, 220, 350, 325);
    context.quadraticCurveTo(530, 390, 700, 285);
    context.lineTo(700, 400);
    context.lineTo(0, 400);
    context.closePath();
    context.fillStyle = darkColor;
    context.fill();

    output.appendChild(canvas);

    // Görseli indirme düğmesi
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Görseli indir";

    downloadButton.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = "rgb-manzaram.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });

    output.appendChild(downloadButton);
});
const imageUpload = document.getElementById("imageUpload");
const uploadedImage = document.getElementById("uploadedImage");
const colorResults = document.getElementById("colorResults");

imageUpload.addEventListener("change", () => {
    const file = imageUpload.files[0];

    if (!file) return;

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = "Yüklenen görsel";
    image.style.maxWidth = "100%";

    uploadedImage.innerHTML = "";
    uploadedImage.appendChild(image);
    colorResults.textContent = "Görselin genel rengi hesaplanıyor...";
    
    image.addEventListener("load", () => {
        // Küçük bir kopya üzerinde hesap yaparak işlemi hızlandır
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = 100;
        canvas.height = 100;
        context.drawImage(image, 0, 0, 100, 100);

        const pixels = context.getImageData(0, 0, 100, 100).data;

        let redTotal = 0;
        let greenTotal = 0;
        let blueTotal = 0;
        let pixelCount = 0;

        for (let i = 0; i < pixels.length; i += 4) {
            redTotal += pixels[i];
            greenTotal += pixels[i + 1];
            blueTotal += pixels[i + 2];
            pixelCount++;
        }

        const red = Math.round(redTotal / pixelCount);
        const green = Math.round(greenTotal / pixelCount);
        const blue = Math.round(blueTotal / pixelCount);

        const hex = "#" + [red, green, blue]
            .map(value => value.toString(16).padStart(2, "0"))
            .join("");

        colorResults.innerHTML = `
            <p>Görselin ortalama rengi:</p>
            <div style="
                width: 50px;
                height: 50px;
                background-color: rgb(${red}, ${green}, ${blue});
                border: 1px solid white;
            "></div>
            <p>RGB: (${red}, ${green}, ${blue})</p>
            <p>HEX: ${hex}</p>
        `;
    });
});