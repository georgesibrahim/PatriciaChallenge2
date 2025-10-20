
// Simple 'lightbox': open image in new tab.
document.querySelectorAll('a.glightbox').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    window.open(a.getAttribute('href'), '_blank');
  });
});

// Print button
const printBtn = document.getElementById('print-btn');
if (printBtn) printBtn.addEventListener('click', () => window.print());

// Download PNG of certificate using html2canvas (inline minimal)
function downloadCertPNG() {
  const target = document.getElementById('cert');
  if (!target) return;
  // lazy import via CDN-less minimal approach: use toDataURL from canvas created by drawImage of svg? We'll fallback to print if html2canvas unavailable.
  // For offline simplicity, use CSS 'element capture' fallback: prompt user to use screenshot. Here, we build a canvas snapshot via drawImage after converting to SVG foreignObject.
  try {
    const xml = new XMLSerializer().serializeToString(target);
    const data = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <foreignObject width='100%' height='100%'>${new XMLSerializer().serializeToString(target)}</foreignObject>
    </svg>`;
    const svgBlob = new Blob([data], {type:'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = function(){
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1067;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0b0c10';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(img,0,0,canvas.width,canvas.height);
      const link = document.createElement('a');
      link.download = 'patricia-5k-certificate.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  } catch (e) {
    alert('If the PNG export fails, please use the Print button to save as PDF.');
  }
}
const dl = document.getElementById('download-png');
if (dl) dl.addEventListener('click', downloadCertPNG);

const dlhtml = document.getElementById('download-html');
if (dlhtml) dlhtml.addEventListener('click', () => {
  const blob = new Blob([document.documentElement.outerHTML], {type:'text/html;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'index.html';
  a.click();
});
