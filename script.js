const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');

convertBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return alert("Selecciona un archivo TXT o DOCX");

    const reader = new FileReader();
    
    if (file.name.endsWith(".txt")) {
        reader.onload = () => {
            generarPDF(reader.result);
        };
        reader.readAsText(file);
    } else if (file.name.endsWith(".docx")) {
        reader.onload = (e) => {
            const content = e.target.result;
            const zip = new JSZip(content);
            const doc = new window.docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
            const text = doc.getFullText();
            generarPDF(text);
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert("Formato no soportado");
    }
});

function generarPDF(texto) {
    const doc = new window.jspdf.jsPDF();
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
