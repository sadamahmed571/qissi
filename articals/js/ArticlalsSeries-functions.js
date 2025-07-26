// متغيرات عامة
let currentSeries = null;
let currentArticleIndex = 0;

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadSeriesData();
});

// تحميل بيانات السلسلة
function loadSeriesData() {
    // الحصول على بيانات السلسلة من localStorage
    const seriesData = localStorage.getItem('currentSeries');
    if (seriesData) {
        currentSeries = JSON.parse(seriesData);
        displaySeriesInfo();
        displayArticlesNavigation();
        displayCurrentArticle();
        displayNavigationControls();
    } else {
        // إذا لم توجد بيانات، عرض رسالة خطأ
        document.getElementById('seriesInfo').innerHTML = `
            <div class="text-center">
                <h3>لم يتم العثور على السلسلة</h3>
                <p>يرجى العودة إلى صفحة المقالات واختيار سلسلة صحيحة.</p>
                <a href="articals2.html" class="nav-btn">العودة إلى المقالات</a>
            </div>
        `;
    }
}

// عرض معلومات السلسلة
function displaySeriesInfo() {
    document.getElementById('seriesTitle').textContent = currentSeries.title;
    
    const seriesInfo = document.getElementById('seriesInfo');
    seriesInfo.innerHTML = `
        
        <div class="series-meta">
            <div class="series-meta-item">
                <i class="fas fa-tag"></i>
                <span>${currentSeries.category}</span>
            </div>
            <div class="series-meta-item">
                <i class="fas fa-book"></i>
                <span>${currentSeries.articlesCount} أجزاء</span>
            </div>
        </div>
        <p>${currentSeries.description}</p>
        <div style="margin-top: 15px; padding: 15px; background: var(--light-blue); border-radius: 8px;">
            <strong>مقدمة السلسلة:</strong> ${currentSeries.introduction}
        </div>
    `;
}

// عرض التنقل بين المقالات
function displayArticlesNavigation() {
    const navList = document.getElementById('articlesNavList');
    let navHTML = '';
    
    currentSeries.articles.forEach((article, index) => {
        navHTML += `
            <button class="article-nav-btn ${index === currentArticleIndex ? 'active' : ''}" 
                    onclick="changeArticle(${index})">
                الجزء ${index + 1}
            </button>
        `;
    });
    
    navList.innerHTML = navHTML;
}

// عرض المقال الحالي
function displayCurrentArticle() {
    const article = currentSeries.articles[currentArticleIndex];
    const currentArticleDiv = document.getElementById('currentArticle');
    
    // إنشاء قائمة الكلمات المفتاحية
    let tagsHTML = '';
    if (article.tags && article.tags.length > 0) {
        tagsHTML = `
            <div class="article-tags">
                <div class="tags-title">الكلمات المفتاحية:</div>
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
    }

    // إنشاء قائمة المراجع
    let referencesHTML = '';
    if (article.references && article.references.length > 0) {
        referencesHTML = `
            <div class="article-references">
                <h3 class="references-title">المراجع</h3>
                <ul class="references-list">
                    ${article.references.map(ref => `<li>${ref}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    currentArticleDiv.innerHTML = `
        <div class="article-header">
            <h1 class="article-title">${article.title}</h1>
            <div class="article-meta">
                <div class="article-meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${article.date}</span>
                </div>
                <div class="article-meta-item">
                    <i class="fas fa-clock"></i>
                    <span>${article.readingTime}</span>
                </div>
                <div class="article-meta-item">
                    <i class="fas fa-list-ol"></i>
                    <span>الجزء ${currentArticleIndex + 1} من ${currentSeries.articles.length}</span>
                </div>
            </div>
            
            <div class="article-content">
                <p><strong>مقدمة:</strong> ${article.intro}</p>
                <p>${article.content}</p>
            </div>
            
            ${tagsHTML}
            ${referencesHTML}
        `;
}

// عرض أزرار التنقل
function displayNavigationControls() {
    const controlsDiv = document.getElementById('navigationControls');
    const isFirst = currentArticleIndex === 0;
    const isLast = currentArticleIndex === currentSeries.articles.length - 1;
    
    controlsDiv.innerHTML = `
        <button class="nav-btn" onclick="changeArticle(${currentArticleIndex - 1})" 
                ${isFirst ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
            المقال السابق
        </button>
        
        <span style="font-weight: 600; color: var(--text-secondary);">
            ${currentArticleIndex + 1} من ${currentSeries.articles.length}
        </span>
        
        <button class="nav-btn" onclick="changeArticle(${currentArticleIndex + 1})" 
                ${isLast ? 'disabled' : ''}>
            المقال التالي
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
}

// تغيير المقال
function changeArticle(newIndex) {
    if (newIndex < 0 || newIndex >= currentSeries.articles.length) return;
    
    currentArticleIndex = newIndex;
    displayArticlesNavigation();
    displayCurrentArticle();
    displayNavigationControls();
    
    // التمرير إلى أعلى المقال
    document.getElementById('currentArticle').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    showToast(`تم تحميل الجزء ${newIndex + 1}`);
}

// عرض الإشعار
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// التنقل إلى مقال منفرد (للاستخدام المستقبلي)
function navigateToArticle(articleId) {
    const article = currentSeries.articles.find(a => a.id === articleId);
    if (article) {
        localStorage.setItem('currentArticle', JSON.stringify(article));
        window.location.href = 'article.html';
    }
}

