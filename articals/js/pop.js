document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const articleSection = document.querySelector('.article-section');

    articleSection.addEventListener('scroll', () => {
        const scrollTop = articleSection.scrollTop;
        const scrollHeight = articleSection.scrollHeight - articleSection.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // وظائف النافذة المنبثقة للمشاركة
    const mobileShareBtn = document.getElementById('mobileShareBtn');
    const mobileSharePopup = document.getElementById('mobileSharePopup');
    const shareTextOption = document.getElementById('shareTextOption');
    const shareLinkOption = document.getElementById('shareLinkOption');
    const textShareButtons = document.getElementById('textShareButtons');
    const linkShareButtons = document.getElementById('linkShareButtons');

    // إظهار/إخفاء النافذة المنبثقة
    mobileShareBtn.addEventListener('click', () => {
        if (mobileSharePopup.style.display === 'none' || mobileSharePopup.style.display === '') {
            mobileSharePopup.style.display = 'block';
        } else {
            mobileSharePopup.style.display = 'none';
        }
    });

    // إخفاء النافذة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!mobileShareBtn.contains(e.target) && !mobileSharePopup.contains(e.target)) {
            mobileSharePopup.style.display = 'none';
        }
    });

    // خيار مشاركة النص
    shareTextOption.addEventListener('click', () => {
        shareTextOption.classList.add('active');
        shareLinkOption.classList.remove('active');
        textShareButtons.classList.add('show');
        linkShareButtons.classList.remove('show');
    });

    // خيار مشاركة الرابط
    shareLinkOption.addEventListener('click', () => {
        shareLinkOption.classList.add('active');
        shareTextOption.classList.remove('active');
        linkShareButtons.classList.add('show');
        textShareButtons.classList.remove('show');
    });
});

// وظائف مشاركة النص
function copyArticleText() {
    const articleContent = document.querySelector('.article-content');
    const textContent = articleContent.innerText;
    
    navigator.clipboard.writeText(textContent).then(() => {
        showToast('تم نسخ نص المقال بنجاح!');
    }).catch(() => {
        showToast('فشل في نسخ النص');
    });
}

function shareArticleTextWhatsApp() {
    const articleContent = document.querySelector('.article-content');
    const textContent = articleContent.innerText;
    const url = `https://wa.me/?text=${encodeURIComponent(textContent)}`;
    window.open(url, '_blank');
}

function shareArticleTextTwitter() {
    const articleContent = document.querySelector('.article-content');
    const textContent = articleContent.innerText.substring(0, 280); // حد تويتر
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(textContent)}`;
    window.open(url, '_blank');
}

function shareArticleTextTelegram() {
    const articleContent = document.querySelector('.article-content');
    const textContent = articleContent.innerText;
    const url = `https://t.me/share/url?text=${encodeURIComponent(textContent)}`;
    window.open(url, '_blank');
}

// وظائف مشاركة الرابط
function copyArticleLink() {
    const currentUrl = window.location.href;
    
    navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('تم نسخ رابط المقال بنجاح!');
    }).catch(() => {
        showToast('فشل في نسخ الرابط');
    });
}

function shareArticleLinkWhatsApp() {
    const currentUrl = window.location.href;
    const articleTitle = document.querySelector('h1').innerText;
    const message = `${articleTitle}\n${currentUrl}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareArticleLinkTwitter() {
    const currentUrl = window.location.href;
    const articleTitle = document.querySelector('h1').innerText;
    const message = `${articleTitle} ${currentUrl}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function shareArticleLinkTelegram() {
    const currentUrl = window.location.href;
    const articleTitle = document.querySelector('h1').innerText;
    const message = `${articleTitle}\n${currentUrl}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(articleTitle)}`;
    window.open(url, '_blank');
}

// وظيفة إظهار رسالة التأكيد
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 3000);
}