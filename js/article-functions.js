// متغيرات عامة
let currentArticleId = 1;
let currentArticleData = null;

// تحميل المقال عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    currentArticleId = getArticleIdFromURL();
    loadArticle(currentArticleId);
    setupScrollProgress();
    setupReadingTime();
});

// تحميل بيانات المقال وعرضها
function loadArticle(articleId) {
    currentArticleData = getArticleData(articleId);
    
    if (!currentArticleData) {
        console.error('لم يتم العثور على المقال');
        return;
    }

    // تحديث عنوان الصفحة
    document.title = `${currentArticleData.title} - المقالات`;
    
    // تحديث محتوى الصفحة
    document.getElementById('articleTitle').textContent = currentArticleData.title;
    document.getElementById('articleDate').textContent = currentArticleData.date;
    document.getElementById('articleCategory').textContent = currentArticleData.category;
    document.getElementById('readingTime').textContent = currentArticleData.readingTime;
    document.getElementById('articleIntro').textContent = currentArticleData.intro;
    document.getElementById('articleContent').innerHTML = currentArticleData.content;
    
    // تحديث أزرار التنقل
    updateNavigationButtons();
    
    // إعادة تعيين شريط التقدم
    resetProgressBar();
}

// تحديث أزرار التنقل
function updateNavigationButtons() {
    const prevArticle = getPreviousArticle(currentArticleId);
    const nextArticle = getNextArticle(currentArticleId);
    
    const prevBtn = document.getElementById('prevArticle');
    const nextBtn = document.getElementById('nextArticle');
    
    if (prevArticle && prevArticle.id !== currentArticleId) {
        prevBtn.style.display = 'flex';
        prevBtn.querySelector('span').textContent = prevArticle.title;
    } else {
        prevBtn.style.display = 'none';
    }
    
    if (nextArticle && nextArticle.id !== currentArticleId) {
        nextBtn.style.display = 'flex';
        nextBtn.querySelector('span').textContent = nextArticle.title;
    } else {
        nextBtn.style.display = 'none';
    }
}

// التنقل بين المقالات
function navigateArticle(direction) {
    let targetArticle;
    
    if (direction === 'next') {
        targetArticle = getNextArticle(currentArticleId);
    } else {
        targetArticle = getPreviousArticle(currentArticleId);
    }
    
    if (targetArticle && targetArticle.id !== currentArticleId) {
        // تحديث URL
        const newUrl = `${window.location.pathname}?id=${targetArticle.id}`;
        window.history.pushState({articleId: targetArticle.id}, '', newUrl);
        
        // تحميل المقال الجديد
        currentArticleId = targetArticle.id;
        loadArticle(currentArticleId);
        
        // التمرير إلى أعلى الصفحة
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

// العودة للصفحة السابقة
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // إذا لم تكن هناك صفحة سابقة، الانتقال لصفحة المقالات الرئيسية
        window.location.href = 'articles.html';
    }
}

// إعداد شريط التقدم في القراءة
function setupScrollProgress() {
    window.addEventListener('scroll', updateProgressBar);
}

// تحديث شريط التقدم
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
    
    if (scrollTop < articleStart) {
        progressBar.style.width = '0%';
    } else if (scrollTop > articleEnd) {
        progressBar.style.width = '100%';
    } else {
        const progress = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100;
        progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
    }
}

// إعادة تعيين شريط التقدم
function resetProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

// حساب وقت القراءة
function setupReadingTime() {
    if (!currentArticleData) return;
    
    const content = currentArticleData.intro + ' ' + currentArticleData.content.replace(/<[^>]*>/g, '');
    const wordsPerMinute = 200; // متوسط سرعة القراءة بالعربية
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    
    document.getElementById('readingTime').textContent = `${readingTime} دقائق`;
}

// نسخ نص المقال
function copyArticle() {
    if (!currentArticleData) return;
    
    const fullText = `${currentArticleData.title}\n\n${currentArticleData.intro}\n\n${currentArticleData.content.replace(/<[^>]*>/g, '')}\n\nبقلم: ${currentArticleData.author}`;
    
    navigator.clipboard.writeText(fullText).then(() => {
        showToast('تم نسخ المقال بنجاح!');
    }).catch(() => {
        // طريقة بديلة للنسخ
        const textArea = document.createElement('textarea');
        textArea.value = fullText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('تم نسخ المقال بنجاح!');
    });
}

// نسخ رابط المقال
function copyLink() {
    const currentUrl = window.location.href;
    
    navigator.clipboard.writeText(currentUrl).then(() => {
        showToast('تم نسخ الرابط بنجاح!');
    }).catch(() => {
        // طريقة بديلة للنسخ
        const textArea = document.createElement('textarea');
        textArea.value = currentUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('تم نسخ الرابط بنجاح!');
    });
}

// مشاركة على فيسبوك
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData.title);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
}

// مشاركة على واتساب
function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData.title);
    const text = encodeURIComponent(`${currentArticleData.title}\n\n${url}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
}

// مشاركة على تويتر
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData.title);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
}

// مشاركة على تيليجرام
function shareOnTelegram() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentArticleData.title);
    const text = encodeURIComponent(`${currentArticleData.title}\n\n${url}`);
    const telegramUrl = `https://t.me/share/url?url=${url}&text=${title}`;
    window.open(telegramUrl, '_blank');
}

// عرض رسالة التأكيد
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// التعامل مع تغيير URL عبر التاريخ
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.articleId) {
        currentArticleId = event.state.articleId;
        loadArticle(currentArticleId);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
});

// إضافة تأثيرات تفاعلية للأزرار
document.addEventListener('DOMContentLoaded', function() {
    // تأثير hover للأزرار
    const buttons = document.querySelectorAll('.share-btn, .nav-btn, .back-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // تأثير النقر
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.95)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1)';
        });
    });
});

// تحسين الأداء للتمرير
let ticking = false;
function updateProgressBar() {
    if (!ticking) {
        requestAnimationFrame(() => {
            const article = document.querySelector('.article-container');
            const progressBar = document.getElementById('progressBar');
            
            if (!article || !progressBar) return;
            
            const articleTop = article.offsetTop;
            const articleHeight = article.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            const articleStart = articleTop - windowHeight / 2;
            const articleEnd = articleTop + articleHeight - windowHeight / 2;
            
            if (scrollTop < articleStart) {
                progressBar.style.width = '0%';
            } else if (scrollTop > articleEnd) {
                progressBar.style.width = '100%';
            } else {
                const progress = ((scrollTop - articleStart) / (articleEnd - articleStart)) * 100;
                progressBar.style.width = `${Math.max(0, Math.min(100, progress))}%`;
            }
            
            ticking = false;
        });
        ticking = true;
    }
}

