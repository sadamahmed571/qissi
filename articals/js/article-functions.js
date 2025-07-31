// Global variables
let currentArticleId = null;
let currentArticleData = null;
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    currentArticleId = getArticleIdFromURL() || getStoredArticleId();
    loadArticle(currentArticleId);
    setupScrollProgress();
    setupButtonEffects();
});
// Load article data and update page
function loadArticle(articleId) {
    // Try to get article from localStorage first
    currentArticleData = JSON.parse(localStorage.getItem('currentArticle')) || getArticleData(articleId);
    if (!currentArticleData) {
        console.error('Article not found');
        document.getElementById('articleContent').textContent = 'المقال غير موجود أو لم يتم تحميله بشكل صحيح.';
        return;
    }
    // Update page metadata
    document.title = `${currentArticleData.title || 'بدون عنوان'} - المقالات`;
    // Update article content
    updateElementText('articleTitle', currentArticleData.title, 'بدون عنوان');
    updateElementText('articleDate', currentArticleData.date, 'غير محدد');
    updateElementText('articleCategory', currentArticleData.category, 'غير محدد');
    updateElementText('articleIntro', currentArticleData.intro, 'لا يوجد مقدمة');
    document.getElementById('articleContent').innerHTML = currentArticleData.content || 'لا يوجد محتوى';
    // Update reading time
    updateReadingTime();
    // Update tags
    updateTags(currentArticleData.tags);
    // Update references
    updateReferences(currentArticleData.references);
    // Update navigation buttons
    updateNavigationButtons();
    // Reset progress bar
    resetProgressBar();
}
// Helper function to update element text
function updateElementText(elementId, value, fallback) {
    document.getElementById(elementId).textContent = value || fallback;
}
// Update tags
function updateTags(tags) {
    const tagsList = document.getElementById('tagsList');
    if (tagsList && Array.isArray(tags)) {
        tagsList.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'tag';
            span.textContent = tag;
            tagsList.appendChild(span);
        });
    }
}
// Update references
function updateReferences(references) {
    const referencesList = document.getElementById('referencesList');

    if (referencesList && Array.isArray(references)) {
        // إزالة المحتوى القديم
        referencesList.innerHTML = '';

        // التحقق هل هناك مراجع فعلاً
        if (references.length > 0) {
            // إنشاء عنصر العنوان فقط إذا كانت هناك مراجع
            const heading = document.createElement('h3');
            heading.className = 'references-title';
            heading.innerHTML = '<i class="fa fa-book" aria-hidden="true"></i> المراجع :';
            referencesList.appendChild(heading);

            // إنشاء قائمة المراجع
            const ul = document.createElement('ul');
            references.forEach(ref => {
                const li = document.createElement('li');
                li.textContent = ref;
                ul.appendChild(li);
            });

            referencesList.appendChild(ul);
        }
    }
}
// Update navigation buttons
function updateNavigationButtons() {
    const prevArticle = getPreviousArticle(currentArticleId);
    const nextArticle = getNextArticle(currentArticleId);
    const prevBtn = document.getElementById('prevArticle');
    const nextBtn = document.getElementById('nextArticle');
    if (prevBtn) {
        prevBtn.style.display = prevArticle && prevArticle.id !== currentArticleId ? 'flex' : 'none';
        if (prevArticle) prevBtn.querySelector('span').textContent = prevArticle.title;
    }
    if (nextBtn) {
        nextBtn.style.display = nextArticle && nextArticle.id !== currentArticleId ? 'flex' : 'none';
        if (nextArticle) nextBtn.querySelector('span').textContent = nextArticle.title;
    }
}
// Navigate between articles
function navigateArticle(direction) {
    const targetArticle = direction === 'next' ? getNextArticle(currentArticleId) : getPreviousArticle(currentArticleId);
    if (targetArticle && targetArticle.id !== currentArticleId) {
        const newUrl = `${window.location.pathname}?id=${targetArticle.id}`;
        window.history.pushState({ articleId: targetArticle.id }, '', newUrl);
        currentArticleId = targetArticle.id;
        loadArticle(currentArticleId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
// Go back
function goBack() {
    window.history.length > 1 ? window.history.back() : (window.location.href = 'articles.html');
}
// Setup scroll progress
function setupScrollProgress() {
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgressBar();
                ticking = false;
            });
            ticking = true;
        }
    });
}
// Update progress bar
function updateProgressBar() {
    const article = document.querySelector('.article-container');
    const progressBar = document.getElementById('progressBar');
    if (!article || !progressBar) return;
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollTop = window.pageYOffset;
    const articleStart = articleTop - windowHeight / 2;
    const articleEnd = articleTop + articleHeight - windowHeight / 2;
    let progress = 0;
    if (scrollTop >= articleStart && scrollTop <= articleEnd) {
        progress = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100;
    } else if (scrollTop > articleEnd) {
        progress = 100;
    }
    progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
}
// Reset progress bar
function resetProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) progressBar.style.width = '0%';
}
// Calculate reading time
function updateReadingTime() {
    if (!currentArticleData) return;
    const content = `${currentArticleData.intro || ''} ${currentArticleData.content?.replace(/<[^>]*>/g, '') || ''}`;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    updateElementText('readingTime', `${readingTime} دقائق`, 'غير محدد');
}
// Copy article text
function copyArticle() {
    if (!currentArticleData) return;
    const fullText = `${currentArticleData.title || ''}\n\n${currentArticleData.intro || ''}\n\n${currentArticleData.content?.replace(/<[^>]*>/g, '') || ''}\n\nبقلم: ${currentArticleData.author || ''}`;
    copyToClipboard(fullText, 'تم نسخ المقال بنجاح!');
}
// Copy article link
function copyLink() {
    copyToClipboard(window.location.href, 'تم نسخ الرابط بنجاح!');
}
// Helper function for clipboard copying
function copyToClipboard(text, successMessage) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage);
    }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(successMessage);
    });
}
// Share on social media
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData?.title || '');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank', 'width=600,height=400');
}
function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData?.title || '');
    window.open(`https://wa.me/?text=${title}%0A%0A${url}`, '_blank');
}
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData?.title || '');
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank', 'width=600,height=400');
}
function shareOnTelegram() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData?.title || '');
    window.open(`https://t.me/share/url?url=${url}&text=${title}`, '_blank');
}
// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
// Handle URL history changes
window.addEventListener('popstate', (event) => {
    if (event.state?.articleId) {
        currentArticleId = event.state.articleId;
        loadArticle(currentArticleId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
// Setup button effects
function setupButtonEffects() {
    const buttons = document.querySelectorAll('.share-btn, .nav-btn, .back-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => button.style.transform = 'translateY(-2px)');
        button.addEventListener('mouseleave', () => button.style.transform = 'translateY(0)');
        button.addEventListener('mousedown', () => button.style.transform = 'translateY(0) scale(0.95)');
        button.addEventListener('mouseup', () => button.style.transform = 'translateY(-2px) scale(1)');
    });
}
// Placeholder for getting article ID from localStorage
function getStoredArticleId() {
    const article = JSON.parse(localStorage.getItem('currentArticle'));
    return article?.id || null;
}
// Placeholder functions (to be implemented based on your backend)
function getArticleIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || null;
}
function getArticleData(articleId) {
    // Implement your article fetching logic here
    return null;
}
function getPreviousArticle(articleId) {
    // Implement your previous article logic
    return null;
}
function getNextArticle(articleId) {
    // Implement your next article logic
    return null;
}
// Optimize scroll performance
let ticking = false;