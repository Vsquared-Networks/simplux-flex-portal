document.addEventListener('DOMContentLoaded', function () {
  initScrollAnimations();
  initSmoothScroll();
  initPackages();
  initCheckout();
  initFooterYear();
});

function initScrollAnimations() {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  var elements = document.querySelectorAll('.animate-on-view');
  elements.forEach(function (el) {
    observer.observe(el);
  });
}

function initSmoothScroll() {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var targetId = link.getAttribute('href');
    if (targetId === '#') return;

    var target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    var headerOffset = 64;

    var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    link.blur();
  });
}

function initFooterYear() {
  var el = document.getElementById('footer-year');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}
