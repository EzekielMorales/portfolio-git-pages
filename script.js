// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

// Copy to Clipboard Utility with Toast
function copyToClipboard(text, buttonElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`คัดลอก "${text}" เรียบร้อยแล้ว!`);
    
    // Quick visual button feedback
    if (buttonElement) {
      const originalHtml = buttonElement.innerHTML;
      buttonElement.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i><span>คัดลอกสำเร็จ!</span>';
      setTimeout(() => {
        buttonElement.innerHTML = originalHtml;
      }, 2000);
    }
  }).catch(err => {
    console.error('Could not copy text: ', err);
    showToast('เกิดข้อผิดพลาดในการคัดลอก');
  });
}

// Toast notification helper
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}
