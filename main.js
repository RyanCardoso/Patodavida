const TARGET_DATE_PT = new Date("2026-01-28T14:00:00+00:00").getTime();
const TARGET_DATE_BR = new Date("2026-01-28T14:00:00-03:00").getTime();

const START_DATE = new Date("2026-01-07T00:00:00+00:00").getTime();
const END_DATE = TARGET_DATE_PT;

const TIMEZONE_API_PT =
  /* "https://world-time-api3.p.rapidapi.com/timezone/Europe/Lisbon"; */
  "https://worldtimeapi.org/api/timezone/Europe/Lisbon";

const TIMEZONE_API_BR =
  "https://worldtimeapi.org/api/timezone/America/Sao_Paulo";
/* "https://world-time-api3.p.rapidapi.com/timezone/America/Sao_Paulo"; */

const options = {
  method: "GET",
  headers: {
    /* "x-rapidapi-key": "1ca25f5e29msh997ce8473650f05p15c697jsn05ff81fcfa74",
    "x-rapidapi-host": "world-time-api3.p.rapidapi.com", */
  },
};

let currentTimePT;
let currentTimeBR;

const countdownPTEl = document.getElementById("timezone_pt");
const countdownBREl = document.getElementById("timezone_br");

async function initClock() {
  try {
    const [resPT, resBR] = await Promise.all([
      fetch(TIMEZONE_API_PT, options),
      fetch(TIMEZONE_API_BR, options),
    ]);

    const dataPT = await resPT.json();
    const dataBR = await resBR.json();

    // Usando unixtime para evitar bug de timezone
    currentTimePT = dataPT.unixtime * 1000;
    currentTimeBR = dataBR.unixtime * 1000;

    updateCountdown();
    setInterval(updateCountdown, 1000);
  } catch (err) {
    countdownPTEl.innerText = "Erro ao obter horário oficial 😢";
    console.error(err);
  }
}

function updateCountdown() {
  currentTimePT += 1000;
  currentTimeBR += 1000;

  const diffPT = TARGET_DATE_PT - currentTimePT;
  const diffBR = TARGET_DATE_BR - currentTimeBR;

  renderCountdown(diffPT, countdownPTEl, "Portugal");
  renderCountdown(diffBR, countdownBREl, "Brasil");

  updateImagePosition(currentTimePT);

  if (diffPT <= 0) {
    document.getElementById("countdown").innerHTML = "💖 Chegou o grande dia!";
    mostrarGaleria();
    return;
  }
}

function renderCountdown(diff, element, label) {
  /*   if (diff <= 0) {
    element.innerHTML = "💖 Chegou o grande dia!";
    return;
  }
 */
  const totalSeconds = Math.floor(diff / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.round(days / 7);

  element.innerHTML = `
    ${weeks} semanas (aproximadamente)<br>
    ${days} dias -
    ${hours % 24} horas -
    ${minutes % 60} minutos -
    ${totalSeconds % 60} segundos
  `;
}

function mostrarGaleria() {
  console.log("Mostrar fotos do casal 💕");
  // aqui você troca layout, mostra imagens, animações etc
}

function updateImagePosition(currentTime) {
  const imgLeft = document.getElementById("img-left");

  const totalDuration = END_DATE - START_DATE;
  const elapsed = currentTime - START_DATE;

  const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);

  const startX = 0;
  const endX = 60;

  const currentX = startX + (endX - startX) * progress;

  imgLeft.style.left = `${currentX}%`;
}

initClock();

function checkOrientation() {
  const isPortrait = screen.orientation.type.includes("portrait");
  const getApp = document.getElementById("app");
  const getAlert = document.getElementById("alert");

  if (isPortrait) {
    getApp.style.display = "none";
    getAlert.style.display = "flex";
  } else {
    getApp.style.display = "flex";
    getAlert.style.display = "none";
  }
}

window.addEventListener("load", checkOrientation);
screen.orientation.addEventListener("change", checkOrientation);
