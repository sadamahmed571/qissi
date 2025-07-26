 const navToggler = document.querySelector('.nav-toggler');
        const navSidebar = document.querySelector('.nav-sidebar');
        const closeBtn = document.querySelector('.close-btn');

        // فتح القائمة عند الضغط على زر التبديل
        navToggler.addEventListener('click', () => {
            navSidebar.classList.toggle('active');
        });

        // إغلاق القائمة عند الضغط على زر الإغلاق
        closeBtn.addEventListener('click', () => {
            navSidebar.classList.remove('active');
        });