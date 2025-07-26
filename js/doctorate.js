  // إضافة تأثيرات تفاعلية للأزرار
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mousedown', function() {
                this.style.transform = 'translateY(1px)';
            });
            button.addEventListener('mouseup', function() {
                this.style.transform = 'translateY(-3px)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        // تأثير تحميل متدرج للعناصر
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(function() {
                document.querySelector('.doctorate-container').style.opacity = '1';
            }, 100);
        });