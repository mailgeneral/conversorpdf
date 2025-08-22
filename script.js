// Debug: ver qué exporta la librería jsPDF
console.log("window.jspdf:", window.jspdf);
console.log("window.jspPDF:", window.jspPDF);
console.log("window.jsPDF:", window.jsPDF);

const fileInput = document.getElementById("fileInput");
const convertBtn = document.getElementById("convertBtn");

convertBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (!file) {
    alert("Por favor selecciona un archivo primero.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = e.target.result;
    generarPDF(text);
  };
  reader.readAsText(file);
});

function generarPDF(texto) {
  // Cubre todas las variantes posibles según cómo cargue la librería
  const { jsPDF } = window.jspdf || window.jspPDF || window;

  if (!jsPDF) {
    console.error("❌ No se pudo encontrar jsPDF en window.");
    alert("Error: jsPDF no está cargado.");
    return;
  }

  const doc = new jsPDF();

  const lineHeight = 10;
  const lines = doc.splitTextToSize(texto, 180);
  let y = 20;

  lines.forEach(line => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += lineHeight;
  });

  doc.save("documento.pdf");
}

