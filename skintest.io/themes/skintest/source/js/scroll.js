document.addEventListener('DOMContentLoaded', function () {
  setScrollToSupport();
  setScrollOnParagraphs();
  btnScrollUp();
  toggleMobileMenu();
  toggleMobileMenuList();
  toggleSupportType();
  setCopyTextButton('.guide h2');
  setCopyTextButton('code');
});

function setScrollToAnchor(button, target) {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
  });
};

function setScrollToSupport() {
  const requestBtn = document.querySelector('.btn-scroll');
  if(requestBtn) {
    const id = requestBtn.getAttribute('href');
    setScrollToAnchor(requestBtn, id);
  };
};

function setScrollOnParagraphs() {
  const links = document.querySelectorAll('.guide__container ul li a');
  if(links) {
    for(let i = 0; i < links.length; i++) {
      setScrollToAnchor(links[i], links[i].getAttribute('href'));
    };
  };
};

function btnScrollUp() {
  const scrollUpBtn = document.querySelector('.btn-up');

  if(scrollUpBtn) {
    window.addEventListener('scroll', function(e) {
      if(window.pageYOffset > 700) {
        scrollUpBtn.classList.remove('hidden');
      } else {
        scrollUpBtn.classList.add('hidden');
      };
    });

    scrollUpBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const id = document.querySelector('.header__logo');
      id.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
      });
    });
  };
};

function toggleMobileMenu() {
  const mobilePopupBtn = document.querySelector('.mobile__burger');
  const mobilePopup = document.querySelector('.mobile');

  const toggleMenu = function() {
    mobilePopupBtn.classList.toggle('button-open');
    document.querySelector('.mobile__item-documentation').classList.remove('opened');
  };

  mobilePopupBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', function (e) {
    const target = e.target;
    const isMenu = target == mobilePopup || mobilePopup.contains(target);
    const isBtnMenu = target == mobilePopupBtn;
    const isMenuActive = mobilePopupBtn.classList.contains('button-open');
    
    if (!isMenu && !isBtnMenu && isMenuActive) {
      toggleMenu();
    };
  });
};

function toggleMobileMenuList() {
  const mobileListMenuBtn = document.querySelector('.mobile__item-documentation');

  mobileListMenuBtn.addEventListener('click', function (e) {
    mobileListMenuBtn.classList.toggle('opened');
  });
};

function toggleSupportType() {
  const supportInput = document.querySelector('.support__checkbox');
  const supportCards = document.querySelector('.support__cards');

  if(supportInput) {
    supportInput.addEventListener('change', function (e) {
      supportCards.classList.toggle('sale');
    });
  };
};

function onCopyText(event) {
  new ClipboardJS('.btn-copy');
  event.target.parentNode.classList.add('copied');
  setTimeout(() => event.target.parentNode.classList.remove('copied'), 1500);
}

function setCopyTextButton(elementsForCopy) {
  const items = document.querySelectorAll(elementsForCopy);
  const isCode = elementsForCopy === 'code';
  if (items) {
    for (var i = 0; i < items.length; i++) {
      const item = items[i];
      const dataForCopy = isCode ? item.innerText : `skintest.io/guide#${item.id}`;
      item.innerHTML += `<button class="btn-copy" onclick="onCopyText(event)" data-clipboard-text="${dataForCopy}"></button>
      <span class="setup__tooltip tooltip">Copied!</span>`;
    }
  }
}