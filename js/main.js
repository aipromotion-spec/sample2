// =========================================================
// 株式会社テスト コーポレートサイト / main.js
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Header: scrolled state ---- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveal animation ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- Animated stat counters (TOP page) ---- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split('.')[1] || '').length;
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent = value.toFixed(decimals);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target.toFixed(decimals);
        };
        requestAnimationFrame(step);
        countIo.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countIo.observe(el));
  }

  /* ---- Contact form: lightweight client-side handling ---- */
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const requiredFields = contactForm.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#E0523F';
        } else {
          field.style.borderColor = '';
        }
      });
      const feedback = document.querySelector('#form-feedback');
      if (!valid) {
        if (feedback) {
          feedback.textContent = '未入力の必須項目があります。ご確認のうえ、再度送信してください。';
          feedback.style.color = '#E0523F';
        }
        return;
      }
      // NOTE: このフォームはデモ用のフロントエンドのみです。
      // 実際にメール送信するには、送信先サーバー（例: 独自API / フォーム送信サービス等）との連携が必要です。
      if (feedback) {
        feedback.textContent = 'お問い合わせありがとうございます。担当者よりご連絡いたします。（※本フォームはデモ表示です。実際の送信には送信先サーバーとの連携設定が必要です）';
        feedback.style.color = '#1565C0';
      }
      contactForm.reset();
    });
  }

  /* ---- Active nav link highlight ---- */
  const currentPage = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.gnav-list a, .mobile-nav-list a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

});
