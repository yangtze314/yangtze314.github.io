const input = document.querySelector("input");
const div = document.getElementById("qrcode");
input.addEventListener("input", () => {
    div.textContent = "";
    new QRCode(div, input.value);

    if (input.value == "") {
        copy.setAttribute("disabled", "");
        download.setAttribute("disabled", "");
    }
    else {
        copy.removeAttribute("disabled");
        download.removeAttribute("disabled");
    }
});

const copy = document.getElementById("copy");
copy.addEventListener("click", async () => {
    const img = await document.querySelector("img");
    // console.log(img);
    const response = await fetch(img.src);
    const blob = await response.blob();

    try {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        console.log("Copy successful. QR code copied to clipboard.");
    } catch (error) {
        console.log("Copy unsuccessful. " + error);
    }
});

const download = document.getElementById("download");
download.addEventListener("click", async () => {
    const img = await document.querySelector("img");
    const response = await fetch(img.src);
    const blob = await response.blob();

    const objectUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = "qr-code.png";
    link.click();

    URL.revokeObjectURL(objectUrl);
});