/* Digital Business Card - JavaScript */

var phoneNumber = "+917016890015";
var emailAddress = "aminkhatri468@gmail.com";

/* The public address of this page (no # or ? parts) */
function getPageLink() {
  var link = window.location.href.split("#")[0];
  link = link.split("?")[0];

  return link;
}

/* Show a small message at the bottom of the screen */
function showToast(message) {
  var toast = document.getElementById("toast");
  toast.innerHTML = message;
  toast.className = "show";

  setTimeout(function () {
    toast.className = "";
  }, 2500);
}

/* Copy text using a temporary textarea (works on local files too) */
function copyText(text, message) {
  var temp = document.createElement("textarea");
  temp.value = text;
  temp.style.position = "fixed";
  temp.style.top = "-1000px";
  document.body.appendChild(temp);
  temp.select();

  var copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  }

  document.body.removeChild(temp);

  if (copied) {
    showToast(message);
  } else {
    showToast("Copy failed - please copy it manually");
  }
}

/* Save the contact as a .vcf file */
function saveContact() {
  var vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    "FN:Amin Khatri",
    "N:Khatri;Amin;;;",
    "ORG:Exotic Infotech",
    "TITLE:Web Developer",
    "TEL;TYPE=CELL:" + phoneNumber,
    "EMAIL;TYPE=INTERNET:" + emailAddress,
    "URL:https://exoticinfotech.com/",
    "ADR;TYPE=WORK:;;;Bharuch;Gujarat;;India;",
    "END:VCARD"
  ].join("\r\n");

  var file = new Blob([vcard], { type: "text/vcard" });
  var link = document.createElement("a");

  link.href = URL.createObjectURL(file);
  link.download = "Amin-Khatri.vcf";
  link.click();

  showToast("Contact downloading");
}

/* Share the card on mobile, copy the link on desktop */
function shareCard() {
  var link = getPageLink();

  if (link === "" || window.location.protocol === "file:") {
    showToast("Upload the site first to share it");
    return;
  }

  if (navigator.share && window.innerWidth < 700) {
    navigator
      .share({
        title: "Amin Khatri",
        text: "Check out my digital business card",
        url: link
      })
      .then(function () {
        showToast("Shared");
      })
      .catch(function () {
        showToast("Share cancelled");
      });
  } else {
    copyText(link, "Link copied");
  }
}

function copyLink() {
  if (window.location.protocol === "file:") {
    showToast("Upload the site first to copy the link");
    return;
  }

  copyText(getPageLink(), "Link copied");
}

function copyPhone() {
  copyText(phoneNumber, "Phone number copied");
}

function copyEmail() {
  copyText(emailAddress, "Email copied");
}

/* Run when the page loads */
window.onload = function () {
  /* Current year in the footer */
  document.getElementById("year").innerHTML = new Date().getFullYear();

  var qrBox = document.getElementById("qrcode");
  var qrUrl = document.getElementById("qr-url");
  var link = getPageLink();

  /* A file opened from the computer has no public link, so the QR
     would not work on a phone. Show a note instead. */
  if (window.location.protocol === "file:") {
    qrBox.innerHTML =
      "<p class='qr-note'>Upload the site first.<br>The QR code will then open this page.</p>";
    qrUrl.innerHTML = "Local preview - no public link yet";
    return;
  }

  if (typeof QRCode === "undefined") {
    qrBox.innerHTML = "<p class='qr-note'>QR code library did not load.</p>";
    qrUrl.innerHTML = link;
    return;
  }

  try {
    new QRCode(qrBox, {
      text: link,
      width: 400,
      height: 400,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    /* The QR library does not add alt text, so we do it here */
    var qrImage = qrBox.getElementsByTagName("img")[0];

    if (qrImage) {
      qrImage.alt = "QR code to open this card";
    }
  } catch (error) {
    qrBox.innerHTML = "<p class='qr-note'>QR code could not be created.</p>";
  }

  qrUrl.innerHTML = link;
};
