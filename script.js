const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');

convertBtn.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (!file) return alert('Selecciona un archivo primero');

  if (file.name.endsWith('.txt')) {
    const reader = new FileReader();
    reader.onload = (e) => generarPDF(e.target.result);
    reader.readAsText(file);
  } else if (file.name.endsWith('.docx')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      mammoth.extractRawText({ arrayBuffer })
        .then(result => generarPDF(result.value))
        .catch(err => alert('Error procesando DOCX: ' + err));
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Formato no soportado. Solo TXT o DOCX.');
  }
});

function generarPDF(text) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(12);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  let y = margin;

  const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
  for (let line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }

  doc.save('documento.pdf');
}



