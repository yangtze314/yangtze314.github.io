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
        notifySuccess();
    } catch (error) {
        notifyFailure(error);
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


successToast = document.getElementById("success-toast");
failToast = document.getElementById("failure-toast");

function notifySuccess() {
    successToast.className = "shown";
    setTimeout(function () { successToast.className = ""; }, 1500);
}


function notifyFailure(error) {
    console.error("Copy unsuccessful.\n\n[DETAILS]\n" + error);
    failToast.className = "shown";
    setTimeout(function () { failToast.className = ""; }, 1500);
}