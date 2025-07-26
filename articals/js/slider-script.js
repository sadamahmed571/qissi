// JavaScript الخاص بالسلايدر
function initializeSlider() {
  var swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 3,
      slideShadows: true
    },
    keyboard: {
      enabled: true
    },
    mousewheel: {
      thresholdDelta: 70
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    autoplay: { // إضافة خاصية التحريك التلقائي هنا
      delay: 3000, // 3000 مللي ثانية = 3 ثوانٍ
      disableOnInteraction: false // لمنع إيقاف التحريك التلقائي عند تفاعل المستخدم
    },
    breakpoints: {
      640: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 1
      },
      1024: {
        slidesPerView: 2
      },
      1560: {
        slidesPerView: 3
      }
    }
  });
}

// تشغيل السلايدر عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  initializeSlider();
});
