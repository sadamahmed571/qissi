// متغيرات عامة
let allArticles = [];
let filteredArticles = [];
let currentPage = 1;
let articlesPerPage = 6;
let isMarqueePaused = false;

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// تهيئة الصفحة
function initializePage() {
    allArticles = getAllArticles();
    filteredArticles = [...allArticles];
    
    loadMarqueeContent();
    loadFeaturedArticle();
    loadArticlesGrid();
    loadAllArticles();
    setupEventListeners();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // إيقاف/تشغيل الشريط المتحرك عند التمرير
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent) {
        marqueeContent.addEventListener('mouseenter', pauseMarquee);
        marqueeContent.addEventListener('mouseleave', resumeMarquee);
    }
    
    // تأثيرات hover للمقالات
    setupHoverEffects();
}

// تحميل محتوى الشريط المتحرك
function loadMarqueeContent() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (!marqueeContent) return;
    
    // إنشاء نسختين من المحتوى للحركة المستمرة
    const articlesHtml = allArticles.map(article => createMarqueeItem(article)).join('');
    marqueeContent.innerHTML = articlesHtml + articlesHtml; // تكرار للحركة المستمرة
}

// إنشاء عنصر في الشريط المتحرك
function createMarqueeItem(article) {
    const categoryClass = getCategoryClass(article.category);
    const shortIntro = truncateText(article.intro, 80);
    
    return `
        <div class="marquee-item" onclick="navigateToArticle(${article.id})">
            <div class="marquee-item-header">
                <span class="marquee-item-date">${article.date}</span>
                <span class="marquee-item-category ${categoryClass}">${article.category}</span>
            </div>
            <h3 class="marquee-item-title">${article.title}</h3>
            <p class="marquee-item-intro">${shortIntro}</p>
        </div>
    `;
}

// تحميل المقال البارز
function loadFeaturedArticle() {
    const featuredContainer = document.getElementById('featuredArticle');
    if (!featuredContainer || allArticles.length === 0) return;
    
    // اختيار أول مقال كمقال بارز
    const featuredArticle = allArticles[0];
    const shortIntro = truncateText(featuredArticle.intro, 200);
    
    featuredContainer.innerHTML = `
        <div class="featured-article-image">
            <i class="fas fa-newspaper"></i>
        </div>
        <div class="featured-article-content">
            <div class="featured-article-meta">
                <span><i class="fas fa-calendar-alt"></i> ${featuredArticle.date}</span>
                <span><i class="fas fa-tag"></i> ${featuredArticle.category}</span>
                <span><i class="fas fa-clock"></i> ${featuredArticle.readingTime}</span>
            </div>
            <h2 class="featured-article-title">${featuredArticle.title}</h2>
            <p class="featured-article-intro">${shortIntro}</p>
            <button class="read-more-btn" onclick="navigateToArticle(${featuredArticle.id})">
                <span>اقرأ المزيد</span>
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
}

// تحميل شبكة المقالات
function loadArticlesGrid() {
    const gridContainer = document.getElementById('articlesGrid');
    if (!gridContainer) return;
    
    // عرض 4 مقالات (تجاهل المقال البارز)
    const gridArticles = allArticles.slice(1, 5);
    
    gridContainer.innerHTML = gridArticles.map(article => createArticleCard(article)).join('');
}

// إنشاء بطاقة مقال
function createArticleCard(article) {
    const shortIntro = truncateText(article.intro, 60);
    
    return `
        <div class="article-card" onclick="navigateToArticle(${article.id})">
            <div class="article-card-header">
                <div class="article-card-image">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="article-card-meta">
                    <div>${article.date}</div>
                    <div>${article.readingTime}</div>
                </div>
            </div>
            <h3 class="article-card-title">${article.title}</h3>
            <p class="article-card-intro">${shortIntro}</p>
            <button class="read-btn" onclick="event.stopPropagation(); navigateToArticle(${article.id})">
                اقرأ
            </button>
        </div>
    `;
}

// تحميل جميع المقالات مع التنقل بين الصفحات
function loadAllArticles() {
    const container = document.getElementById('allArticlesContainer');
    if (!container) return;
    
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const pageArticles = filteredArticles.slice(startIndex, endIndex);
    
    container.innerHTML = pageArticles.map(article => createArticleItem(article)).join('');
    
    updatePagination();
}

// إنشاء عنصر مقال
function createArticleItem(article) {
    const categoryClass = getCategoryClass(article.category);
    const shortIntro = truncateText(article.intro, 120);
    
    return `
        <div class="article-item" onclick="navigateToArticle(${article.id})">
            <h3 class="article-item-title">${article.title}</h3>
            <div class="article-item-meta">
                <span class="article-item-date">${article.date}</span>
                <span class="article-item-category ${categoryClass}">${article.category}</span>
            </div>
            <p class="article-item-intro">${shortIntro}</p>
            <button class="read-more-btn" onclick="event.stopPropagation(); navigateToArticle(${article.id})">
                <span>اقرأ المقال</span>
                <i class="fas fa-arrow-left"></i>
            </button>
        </div>
    `;
}

// تحديث التنقل بين الصفحات
function updatePagination() {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHtml = '';
    
    // زر السابق
    paginationHtml += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i> السابق
        </button>
    `;
    
    // أرقام الصفحات
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    // زر التالي
    paginationHtml += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            التالي <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = paginationHtml;
}

// تغيير الصفحة
function changePage(page) {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    loadAllArticles();
    
    // التمرير إلى أعلى قسم المقالات
    document.querySelector('.all-articles-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// البحث في المقالات
function searchArticles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredArticles = [...allArticles];
    } else {
        filteredArticles = allArticles.filter(article => 
            article.title.toLowerCase().includes(searchTerm) ||
            article.intro.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm) ||
            article.category.toLowerCase().includes(searchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    currentPage = 1;
    loadAllArticles();
    
    // عرض رسالة إذا لم توجد نتائج
    if (filteredArticles.length === 0) {
        document.getElementById('allArticlesContainer').innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>لم يتم العثور على مقالات</h3>
                <p>جرب البحث بكلمات مختلفة أو تصفح جميع المقالات</p>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
    }
}

// فلترة حسب الفئة
function filterByCategory() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    if (selectedCategory === 'all') {
        filteredArticles = [...allArticles];
    } else {
        filteredArticles = allArticles.filter(article => 
            article.category === selectedCategory
        );
    }
    
    currentPage = 1;
    loadAllArticles();
    
    // مسح البحث
    document.getElementById('searchInput').value = '';
}

// إيقاف الشريط المتحرك
function pauseMarquee() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent) {
        marqueeContent.style.animationPlayState = 'paused';
        isMarqueePaused = true;
    }
}

// تشغيل الشريط المتحرك
function resumeMarquee() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent) {
        marqueeContent.style.animationPlayState = 'running';
        isMarqueePaused = false;
    }
}

// التنقل إلى مقال
function navigateToArticle(articleId) {
    showToast('جاري تحميل المقال...');
    
    // تأخير قصير لإظهار التأثير
    setTimeout(() => {
        window.location.href = `article.html?id=${articleId}`;
    }, 500);
}

// عرض الإشعار المنبثق
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// الحصول على فئة CSS للمجال
function getCategoryClass(category) {
    const categoryMap = {
        'فلسفة الإسلام': 'category-philosophy',
        'نقد الفكر الإسلامي': 'category-islamic-critique',
        'نقد الفكر الغربي': 'category-western-critique',
        'التعليم والتكنولوجيا': 'category-technology',
        'التكنولوجيا والمجتمع': 'category-technology',
        'البيئة والتكنولوجيا': 'category-environment',
        'أخرى': 'category-other'
    };
    
    return categoryMap[category] || 'category-other';
}

// اختصار النص
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
}

// إعداد تأثيرات hover
function setupHoverEffects() {
    // تأثيرات للأزرار
    const buttons = document.querySelectorAll('.read-more-btn, .read-btn, .control-btn, .pagination-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // تأثيرات للبطاقات
    const cards = document.querySelectorAll('.article-card, .article-item, .marquee-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// تحسين الأداء للتمرير
let ticking = false;
function onScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // إضافة تأثيرات التمرير هنا إذا لزم الأمر
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// تحسين الاستجابة للوحة المفاتيح
document.addEventListener('keydown', function(event) {
    // البحث عند الضغط على Enter
    if (event.key === 'Enter' && event.target.id === 'searchInput') {
        searchArticles();
    }
    
    // التنقل بين الصفحات بالأسهم
    if (event.key === 'ArrowLeft' && event.ctrlKey) {
        const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    }
    
    if (event.key === 'ArrowRight' && event.ctrlKey) {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    }
});

// تحسين التحميل التدريجي
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// تشغيل التحميل التدريجي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// إضافة تأثيرات الانتقال للعناصر الجديدة
function animateNewElements() {
    const newElements = document.querySelectorAll('.article-item, .article-card');
    newElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// تحديث العناصر مع الرسوم المتحركة
function updateArticlesWithAnimation() {
    const container = document.getElementById('allArticlesContainer');
    if (container) {
        container.classList.add('loading');
        
        setTimeout(() => {
            loadAllArticles();
            container.classList.remove('loading');
            animateNewElements();
        }, 300);
    }
}

// إضافة وظائف إضافية للتفاعل
function addAdvancedInteractions() {
    // إضافة إمكانية السحب للشريط المتحرك على الأجهزة اللوحية
    let isDown = false;
    let startX;
    let scrollLeft;
    
    const marqueeWrapper = document.querySelector('.marquee-wrapper');
    if (marqueeWrapper) {
        marqueeWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - marqueeWrapper.offsetLeft;
            scrollLeft = marqueeWrapper.scrollLeft;
            pauseMarquee();
        });
        
        marqueeWrapper.addEventListener('mouseleave', () => {
            isDown = false;
            resumeMarquee();
        });
        
        marqueeWrapper.addEventListener('mouseup', () => {
            isDown = false;
            resumeMarquee();
        });
        
        marqueeWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - marqueeWrapper.offsetLeft;
            const walk = (x - startX) * 2;
            marqueeWrapper.scrollLeft = scrollLeft - walk;
        });
    }
}

// تشغيل التفاعلات المتقدمة
document.addEventListener('DOMContentLoaded', addAdvancedInteractions);

// إضافة دعم للوضع المظلم (اختياري)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// تحميل تفضيل الوضع المظلم
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// تصدير الوظائف للاستخدام العام
window.searchArticles = searchArticles;
window.filterByCategory = filterByCategory;
window.changePage = changePage;
window.navigateToArticle = navigateToArticle;
window.pauseMarquee = pauseMarquee;
window.resumeMarquee = resumeMarquee;

