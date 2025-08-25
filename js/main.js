// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initQuoteForm();
    initSmoothScroll();
    initLoadingAnimations();
    
    // 初始化快速咨询表单
    initQuickInquiry();

});

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 移动端菜单切换
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // 点击导航链接关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.service-card, .news-card, .contact-item, .stat-item, .feature');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // 导航菜单滚动关联效果
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // 创建导航高亮观察器
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // 移除所有导航链接的活跃状态
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // 为当前对应的导航链接添加活跃状态
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px'
    });
    
    // 观察所有页面区块
    sections.forEach(section => {
        navObserver.observe(section);
    });
    
    // 平滑滚动到对应区块
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 询价表单功能
function initQuoteForm() {
    const quoteForm = document.querySelector('.quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(quoteForm);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // 验证表单
            if (validateQuoteForm(data)) {
                // 显示成功消息
                showNotification('询价信息已提交，我们将在24小时内联系您！', 'success');
                
                // 重置表单
                quoteForm.reset();
                
                // 这里可以添加实际的表单提交逻辑
                console.log('询价数据:', data);
            }
        });
    }
}

// 表单验证
function validateQuoteForm(data) {
    const required = ['origin', 'destination', 'transport-type', 'cargo-type', 'weight', 'contact-name', 'contact-phone', 'contact-email'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`请填写${getFieldName(field)}`, 'error');
            return false;
        }
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data['contact-email'])) {
        showNotification('请输入有效的邮箱地址', 'error');
        return false;
    }
    
    // 验证电话格式
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data['contact-phone'])) {
        showNotification('请输入有效的电话号码', 'error');
        return false;
    }
    
    return true;
}

// 获取字段中文名称
function getFieldName(field) {
    const fieldNames = {
        'origin': '起运地',
        'destination': '目的地',
        'transport-type': '运输方式',
        'cargo-type': '货物类型',
        'weight': '重量',
        'contact-name': '联系人',
        'contact-phone': '联系电话',
        'contact-email': '邮箱地址'
    };
    return fieldNames[field] || field;
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 关闭按钮事件
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // 自动关闭
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

// 隐藏通知
function hideNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// 平滑滚动
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 70; // 考虑导航栏高度
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 加载动画
function initLoadingAnimations() {
    const elements = document.querySelectorAll('.service-card, .news-card, .stat-item');
    
    elements.forEach((el, index) => {
        el.classList.add('loading');
        
        setTimeout(() => {
            el.classList.add('loaded');
        }, index * 100);
    });
}

// 数字计数动画
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (element.textContent.includes('+') ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (element.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// 当统计数据进入视口时开始计数动画
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-item h3');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// 初始化计数器动画
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initCounterAnimations, 1000);
});

// 添加页面加载完成后的动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// 添加鼠标悬停效果
document.addEventListener('DOMContentLoaded', function() {
    // 服务卡片悬停效果
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 新闻卡片悬停效果
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// 添加表单输入动画
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // 检查是否已有值
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });
});

// 添加滚动进度条
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 初始化滚动进度条
document.addEventListener('DOMContentLoaded', initScrollProgress);

// 添加返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2c5aa0;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(44, 90, 160, 0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬停效果
    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 20px rgba(44, 90, 160, 0.4)';
    });
    
    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(44, 90, 160, 0.3)';
    });
}

// 初始化返回顶部按钮
document.addEventListener('DOMContentLoaded', initBackToTop);

// 添加页面可见性检测
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.title = '环球物流 - 期待您的回来';
    } else {
        document.title = '环球物流 - 专业货代服务';
    }
});

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    // ESC键关闭移动端菜单
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化滚动事件
const optimizedScrollHandler = debounce(function() {
    // 滚动相关的处理逻辑
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
});



// 快速咨询表单功能
function initQuickInquiry() {
    const quickInquiryForm = document.querySelector('.quick-inquiry-form');
    
    if (quickInquiryForm) {
        quickInquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(quickInquiryForm);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // 验证表单
            if (validateQuickInquiryForm(data)) {
                // 显示成功消息
                showNotification('咨询信息已提交，我们将尽快联系您！', 'success');
                
                // 重置表单
                quickInquiryForm.reset();
                
                // 这里可以添加实际的表单提交逻辑
                console.log('快速咨询数据:', data);
            }
        });
    }
}

// 快速咨询表单验证
function validateQuickInquiryForm(data) {
    const required = ['name', 'phone', 'inquiry-type'];
    
    for (let field of required) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`请填写${getQuickInquiryFieldName(field)}`, 'error');
            return false;
        }
    }
    
    // 验证电话格式
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data['phone'])) {
        showNotification('请输入有效的电话号码', 'error');
        return false;
    }
    
    return true;
}

// 获取快速咨询字段中文名称
function getQuickInquiryFieldName(field) {
    const fieldNames = {
        'name': '姓名',
        'phone': '联系电话',
        'inquiry-type': '咨询类型'
    };
    return fieldNames[field] || field;
}

// 添加性能监控
window.addEventListener('load', function() {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('页面加载时间:', loadTime + 'ms');
    }
});