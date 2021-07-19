document.addEventListener('DOMContentLoaded', function () {
  setScrollToSupport();
  setScrollOnParagraphs();
  btnScrollUp();
  toggleMobileMenu();
  toggleMobileMenuList();
  toggleSupportType();
  putCopyTextButton();
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
  var textToCopy = event.target;
  textToCopy.select();
  document.execCommand("copy");
  event.target.parentNode.classList.add('copied');
  setTimeout(() => event.target.parentNode.classList.remove('copied'), 1500);
}

function putCopyTextButton() {
  const titles = document.querySelectorAll('.guide h2');
  if (titles) {
    for (var i = 0; i < titles.length; i++) {
      const title = titles[i];
      const copyBtnValue = title.id;
      title.innerHTML += `<input class="btn-copy" onclick="onCopyText(event)" type="text" value="skintest.io/guide#${copyBtnValue}"></input>`;
    }
  }
}