document.addEventListener('click', function () {
  setScroll();
  toggleMobileMenu();
  toggleMobileMenuList();
})

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
  const mobilePopupBtn = document.querySelector('.mobile__burger');
  const mobilePopup = document.querySelector('.mobile');

  const toggleMenu = function() {
    mobilePopupBtn.classList.toggle('button-open');
  }

  mobilePopupBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  })

  document.addEventListener('click', function (e) {
    const target = e.target;
    const isMenu = target == mobilePopup || mobilePopup.contains(target);
    const isBtnMenu = target == mobileMenu;
    const isMenuActive = mobilePopupBtn.classList.contains('button-open');
    
    if (!isMenu && !isBtnMenu && isMenuActive) {
      toggleMenu();
    }
  });
}

function toggleMobileMenuList() {
  const mobileListMenuBtn = document.querySelector('.mobile__item-documentation');

  mobileListMenuBtn.addEventListener('click', function (e) {
    mobileListMenuBtn.classList.toggle('opened');
  });
}

