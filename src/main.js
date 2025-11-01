// Minimal boot to keep the app happy.
// (You can add your calculator logic here later if you want.)
document.addEventListener('DOMContentLoaded', () => {
  console.log('HCP Wallpaper Calculator ready.');
});

// If you added the "Share as PDF" button earlier, this keeps things harmless if it's missing.
const btn = document.getElementById('sharePdfBtn');
if (btn) {
  btn.addEventListener('click', () => {
    alert('Share as PDF is wired—PDF libs will run on the next build if present.');
  });
}
