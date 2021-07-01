document.addEventListener("DOMContentLoaded", setScroll, false);
document.addEventListener("DOMContentLoaded", toggleMobileMenu, false);
document.addEventListener("DOMContentLoaded", toggleMobileMenuList, false);

function setScroll() {
  const requestBtn = document.querySelector('.btn-request');
  requestBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const id = requestBtn.getAttribute('href');
    document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
  });
}

function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile__burger');
  mobileMenu.addEventListener('click', function (e) {
    if(mobileMenu.classList.contains('button-open')) {
      mobileMenu.classList.remove('button-open');
    } else {
      mobileMenu.classList.add('button-open');
    }
  })
}

function toggleMobileMenuList() {
  const mobileListMenu = document.querySelector('.mobile__item-documentation');
  mobileListMenu.addEventListener('click', function (e) {
    if(mobileListMenu.classList.contains('opened')) {
      mobileListMenu.classList.remove('opened');
    } else {
      mobileListMenu.classList.add('opened');
    }
  })
}

