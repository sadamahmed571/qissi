// وظائف الصفحة - articles-functions.js

// متغيرات عامة
let currentPage = 1;
const articlesPerPage = 6;
let filteredArticles = [];
let isMarqueeRunning = true;

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// تهيئة الصفحة
function initializePage() {
    loadMarqueeArticles();
    loadImportantArticles();
    loadArticlesSeries();
    loadAllArticles();
    initializeSwiper();
}

// تحميل مقالات الشريط المتحرك
function loadMarqueeArticles() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (!marqueeContent) return;

    let marqueeHTML = '';
    
    // استخدام 10 مقالات من articles-data.js و 5 مقالات من ImportantArticalsData.js
    const articlesFromData = articlesData.slice(0, 15); // أول 10 مقالات من articles-data.js
    const importantArticles = ImportantArticalsData.slice(0, 5); // أول 5 مقالات من ImportantArticalsData.js
    
    // دمج المقالات (بحد أقصى 15 مقال)
    const allMarqueeArticles = [...articlesFromData, ...importantArticles];
    
    allMarqueeArticles.forEach(article => {
        const shortIntro = article.intro.length > 100 ? 
            article.intro.substring(0, 80) + '...' : article.intro;
        
        const categoryClass = getCategoryClass(article.category);
        
        marqueeHTML += `
            <div class="marquee-item" onclick="navigateToArticle(${article.id})">
                <div class="marquee-item-header">
                    <span class="marquee-item-category ${categoryClass}"><i class="fas fa-tag"></i> ${article.category}</span>
                    <span class="marquee-item-date"><i class="fas fa-calendar-alt"></i> ${article.date}</span>
                </div>
                <h3 class="marquee-item-title">${article.title}</h3>
                <p class="marquee-item-intro">${shortIntro}</p>
            </div>
        `;
    });
    
    marqueeContent.innerHTML = marqueeHTML;
}

// تحميل المقالات الهامة
function loadImportantArticles() {
    loadFeaturedArticle();
    loadImportantSlider();
}

// تحميل المقال البارز الأول
function loadFeaturedArticle() {
    const featuredArticleContainer = document.getElementById('featuredArticle');
    if (!featuredArticleContainer || ImportantArticalsData.length === 0) return;

    const featuredArticle = ImportantArticalsData[0];
    const shortIntro = featuredArticle.intro.length > 200 ? 
        featuredArticle.intro.substring(0, 203) + '...' : featuredArticle.intro;
    const categoryClass = getCategoryClass(featuredArticle.category); // Updated to add category class

    featuredArticleContainer.innerHTML = `
        <div class="Important-Articals-top">
            <div class="Important-Articals-left">
                <div class="Important-Articals-meta">                   
                    <span class="${categoryClass}"><i class="fas fa-tag"></i> ${featuredArticle.category}</span>
                    <span><i class="fas fa-clock"></i> ${featuredArticle.readingTime}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${featuredArticle.date}</span>
                </div>
                <h2 class="Important-Articals-title">${featuredArticle.title}</h2>
            </div>
            <div class="Important-Articals-image-container">
                <img src="../images/5.jpg" class="Important-Articals-image" id="5">   
            </div>
        </div>
        
        <div class="Important-Articals-intro-section">
            <p class="Important-Articals-intro">${shortIntro}</p>
        </div>
        
        <div class="Important-Articals-actions">
            <button class="read-more-btn" onclick="navigateToArticle(${featuredArticle.id})">
                <i class="fas fa-angle-double-left"></i>
                <span>اكمل القراءة</span>
            </button>
        </div>
    `;
}

// تحميل سلايدر المقالات الهامة
function loadImportantSlider() {
    // سيتم تحديث محتوى السلايدر عبر JavaScript بعد تهيئة Swiper
    updateSwiperContent();
}

// تحديث محتوى السلايدر
function updateSwiperContent() {
    const swiperSlides = document.querySelectorAll('.swiper-slide');
    
    // استخدام المقالات الهامة من الثاني إلى الخامس
    const sliderArticles = ImportantArticalsData.slice(1, 6);
    
    swiperSlides.forEach((slide, index) => {
        if (sliderArticles[index]) {
            const article = sliderArticles[index];
            const shortIntro = article.intro.length > 150 ? 
                article.intro.substring(0, 150) + '...' : article.intro;
            const categoryClass = getCategoryClass(article.category); // Updated to add category class
            
            const slideContent = slide.querySelector('div');
            if (slideContent) {
                slideContent.innerHTML = `
                    <h2>${article.title}</h2>
                    <div class="swiper-slide-meta">
                        <span class="${categoryClass}"><i class="fas fa-tag"></i> ${article.category}</span>
                        <span><i class="fas fa-clock"></i> ${article.readingTime}</span>
                    </div> 
                    <a onclick="navigateToArticle(${article.id})"> إقرأ المقال <i class="fas fa-angle-double-left"></i> </a>
                `;
            }
        }
    });
}

// تحميل سلاسل المقالات - التصميم الجديد
function loadArticlesSeries() {
    const mainArticleContainer = document.getElementById('mainArticleContainer');
    const sideArticlesContainer = document.getElementById('sideArticlesContainer');
    const articlesGrid2 = document.getElementById('articlesGrid2');
    
    if (!mainArticleContainer || !sideArticlesContainer || ArticalsSeriesData.length === 0) return;

    // القسم الأول: عرض أول 4 سلاسل
    // المقال الرئيسي الكبير (أول مقال في البيانات)
    const mainSeries = ArticalsSeriesData[0];
    const mainShortDescription = mainSeries.description.length > 200 ? 
        mainSeries.description.substring(0, 200) + '...' : mainSeries.description;
    const mainCategoryClass = getCategoryClass(mainSeries.category); // الحصول على فئة CSS
    
    mainArticleContainer.innerHTML = `
        <div class="main-article">
            <div class="main-article-image" />
            </div>
            <div class="main-article-content">
                <div class="main-article-header">
                    <h2 class="main-article-title"><i class='far fa-file-alt'></i> ${mainSeries.title}</h2>
                    <span class="main-article-span"><i class="fa-solid fa-list-ul"></i> ${mainSeries.articlesCount} أجزاء</span>
                    <span class="main-article-span ${mainCategoryClass}"><i class="fa fa-tag" aria-hidden="true"></i> ${mainSeries.category}</span>
                </div>
                <p class="main-article-intro">${mainShortDescription}</p>
                <button class="main-article-btn" onclick="event.stopPropagation(); navigateToSeries('${mainSeries.id}')">
                    اقرأ السلسلة
                    <i class="fa fa-angle-left" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;

    // المقالات الجانبية الصغيرة (السلاسل 2-4)
    let sideArticlesHTML = '';
    const sideArticles = ArticalsSeriesData.slice(1, 4); // أخذ 3 مقالات جانبية (السلاسل 2-4)
    
    sideArticles.forEach((series, index) => {
        const shortDescription = series.description.length > 80 ? 
            series.description.substring(0, 80) + '...' : series.description;
        const sideCategoryClass = getCategoryClass(series.category); // الحصول على فئة CSS
        
        sideArticlesHTML += `
            <div class="side-article">
                <div class="side-article-content">                   
                    <h3 class="side-article-title"><i class='far fa-file-alt'></i> ${series.title}</h3>
                    <p class="side-article-intro">${shortDescription}</p>
                    <div class="side-article-header">
                        <span class="side-article-span"><i class="fa-solid fa-list-ul"></i> ${series.articlesCount} أجزاء</span>
                        <span class="side-article-span ${sideCategoryClass}"><i class="fa fa-tag" aria-hidden="true"></i> ${series.category}</span>
                       <button class="read-btn3" onclick="event.stopPropagation(); navigateToSeries('${series.id}')">
                            اقرأ                          <i class="fa fa-angle-left" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    sideArticlesContainer.innerHTML = sideArticlesHTML;

    // القسم الثاني: عرض السلاسل من رقم 5 إلى نهاية العدد
    if (articlesGrid2 && ArticalsSeriesData.length > 4) {
        let grid2HTML = '';
        const remainingSeries = ArticalsSeriesData.slice(4); // من السلسلة رقم 5 إلى النهاية
        
        remainingSeries.forEach((series, index) => {
            const shortDescription = series.description.length > 120 ? 
                series.description.substring(0, 120) + '...' : series.description;
            const categoryClass = getCategoryClass(series.category);
            
            grid2HTML += `
                <div class="article-card2" onclick="navigateToSeries('${series.id}')">
                    <div class="article-card2-header">                       
                        <h3 class="article-card2-title"><i class='far fa-file-alt'></i> سلسلة :  ${series.title}</h3>                     
                    </div>
                </div>
            `;
        });
        
        articlesGrid2.innerHTML = grid2HTML;
    }
}

// تحميل جميع المقالات
// تعريف المصفوفة التي سيتم عرضها
let filteredArticles = [];
let currentPage = 1;
const articlesPerPage = 6;

// تحميل جميع المقالات من المصادر الثلاثة
function loadAllArticles() {
    filteredArticles = [
        ...ArticalsSeriesData,
        ...ImportantArticalsData,
        ...articlesData
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // فرز حسب الأحدث

    displayArticles();
    setupPagination();
}

// عرض المقالات في الصفحة الحالية
function displayArticles() {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const articlesToDisplay = filteredArticles.slice(startIndex, endIndex);

    const container = document.getElementById("articlesContainer");
    container.innerHTML = "";

    articlesToDisplay.forEach(article => {
        container.innerHTML += `
            <div class="article-card">
                <h3>${article.title}</h3>
                <p>${article.intro}</p>
                <span>🗂️ ${article.category} — ⏱️ ${article.readingTime}</span>
            </div>
        `;
    });
}

// إعداد الترقيم للصفحات
function setupPagination() {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.classList.toggle("active", i === currentPage);
        button.addEventListener("click", () => {
            currentPage = i;
            displayArticles();
            setupPagination();
        });
        paginationContainer.appendChild(button);
    }
}

// تنفيذ التحميل عند بداية الصفحة
window.addEventListener("DOMContentLoaded", loadAllArticles);

// تحديث أزرار التنقل بين الصفحات
function updatePagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    let paginationHTML = '';

    // زر السابق
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;

    // أرقام الصفحات
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    // زر التالي
    paginationHTML += `
        <button class="pagination-btn" onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

// تغيير الصفحة
function changePage(page) {
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayArticles();
    
    // التمرير إلى أعلى قسم المقالات
    document.querySelector('.all-articles-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// البحث في المقالات
function searchArticles() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    
    filteredArticles = articlesData.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchTerm) ||
                            article.intro.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    displayArticles();
}

// فلترة حسب المجال
function filterByCategory() {
    searchArticles();
}

// الحصول على فئة CSS للفئة
function getCategoryClass(category) {
    const categoryClasses = {
        'فلسفة الإسلام': 'category-فلسفة-الإسلام',
        'نقد الفكر الإسلامي': 'category-نقد-الفكر-الإسلامي',
        'نقد الفكر الغربي': 'category-نقد-الفكر-الغربي',
        'متفرقات': 'category-متفرقات'
    };
    
    return categoryClasses[category] || 'category-متفرقات';
}

// التنقل إلى مقال
function navigateToArticle(articleId) {
    // البحث في جميع قواعد البيانات
    let article = articlesData.find(a => a.id === articleId);
    if (!article) {
        article = ImportantArticalsData.find(a => a.id === articleId);
    }
    if (!article) {
        // البحث في سلاسل المقالات
        for (let series of ArticalsSeriesData) {
            article = series.articles.find(a => a.id === articleId);
            if (article) break;
        }
    }
    
    if (article) {
        // حفظ بيانات المقال في localStorage للوصول إليها في الصفحة الجديدة
        localStorage.setItem('currentArticle', JSON.stringify(article));
        window.location.href = 'article.html';
    } else {
        showToast('المقال غير موجود');
    }
}

// التنقل إلى سلسلة مقالات
function navigateToSeries(seriesId) {
    const series = ArticalsSeriesData.find(s => s.id === seriesId);
    if (series) {
        localStorage.setItem('currentSeries', JSON.stringify(series));
        window.location.href = 'ArticlalsSeries.html';
    } else {
        showToast('السلسلة غير موجودة');
    }
}

// إيقاف/تشغيل الشريط المتحرك
function pauseMarquee() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent) {
        marqueeContent.style.animationPlayState = 'paused';
        isMarqueeRunning = false;
    }
}

function resumeMarquee() {
    const marqueeContent = document.getElementById('marqueeContent');
    if (marqueeContent) {
        marqueeContent.style.animationPlayState = 'running';
        isMarqueeRunning = true;
    }
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

// تحسين الأداء - تحميل الصور بشكل تدريجي
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// تهيئة التحميل التدريجي للصور
document.addEventListener('DOMContentLoaded', lazyLoadImages);
