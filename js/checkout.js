var checkoutState = {
  selectedPackage: null,
  phone: '',
  isValid: false,
  paymentState: 'idle'
};

function updateCheckout(packageId) {
  var pkg = null;
  for (var i = 0; i < packageData.length; i++) {
    if (packageData[i].id === packageId) {
      pkg = packageData[i];
      break;
    }
  }

  checkoutState.selectedPackage = pkg;
  renderCheckoutSummary();
  validatePhone(checkoutState.phone);
}

function renderCheckoutSummary() {
  var summary = document.getElementById('checkout-summary');
  var empty = document.getElementById('checkout-empty');
  var content = document.getElementById('checkout-content-data');

  if (!checkoutState.selectedPackage) {
    if (summary) summary.classList.add('checkout-summary--hidden');
    if (empty) empty.classList.remove('checkout-summary--hidden');
    return;
  }

  if (summary) summary.classList.remove('checkout-summary--hidden');
  if (empty) empty.classList.add('checkout-summary--hidden');

  if (content) {
    content.innerHTML =
      '<div class="checkout-package-info">' +
        '<h3 class="checkout-package-name">' + checkoutState.selectedPackage.name + '</h3>' +
        '<span class="checkout-package-speed">' + checkoutState.selectedPackage.speed + '</span>' +
        '<span class="checkout-package-duration">' + checkoutState.selectedPackage.duration + '</span>' +
      '</div>' +
      '<div class="checkout-price-display">' +
        '<span class="checkout-currency">KSh</span>' +
        '<span class="checkout-amount">' + checkoutState.selectedPackage.price.toLocaleString() + '</span>' +
      '</div>';
  }
}

function validatePhone(phone) {
  var input = document.getElementById('checkout-phone');
  var error = document.getElementById('checkout-phone-error');
  var payBtn = document.getElementById('checkout-pay-btn');

  checkoutState.phone = phone;

  if (phone.length === 0) {
    checkoutState.isValid = false;
    if (error) error.textContent = '';
    if (input) input.classList.remove('input--error', 'input--valid');
    if (payBtn) payBtn.disabled = true;
    return;
  }

  var regex = /^(07|01)\d{8}$|^(2547|2541)\d{8}$/;
  var isValid = regex.test(phone);

  checkoutState.isValid = isValid;

  if (input) {
    input.classList.remove('input--error', 'input--valid');
    input.classList.add(isValid ? 'input--valid' : 'input--error');
  }

  if (error) {
    error.textContent = isValid ? '' : 'Enter a valid Kenyan phone number (e.g. 0712345678)';
  }

  if (payBtn) {
    payBtn.disabled = !isValid || !checkoutState.selectedPackage;
  }
}

function openPaymentModal() {
  var modal = document.getElementById('payment-modal');
  if (!modal) return;

  checkoutState.paymentState = 'loading';
  modal.classList.remove('modal--success', 'modal--failure');
  modal.classList.add('modal--open', 'modal--loading');
  document.body.style.overflow = 'hidden';

  renderModalState();
  startPaymentSimulation();
}

function closePaymentModal() {
  var modal = document.getElementById('payment-modal');
  if (!modal) return;

  modal.classList.remove('modal--open');
  document.body.style.overflow = '';
  checkoutState.paymentState = 'idle';
}

function renderModalState() {
  var body = document.getElementById('modal-body');
  if (!body) return;

  var html = '';

  if (checkoutState.paymentState === 'loading') {
    html =
      '<div class="modal-status">' +
        '<div class="spinner" aria-label="Processing payment"></div>' +
        '<p class="modal-status-text">Sending STK Push...</p>' +
        '<p class="modal-status-hint">Please check your phone for the M-Pesa prompt</p>' +
      '</div>';
  } else if (checkoutState.paymentState === 'success') {
    html =
      '<div class="modal-status">' +
        '<div class="success-icon" aria-label="Payment successful">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' +
        '</div>' +
        '<p class="modal-status-text modal-status-text--success">Payment Successful</p>' +
        '<p class="modal-status-hint">Connecting you...</p>' +
      '</div>';
  } else if (checkoutState.paymentState === 'failure') {
    html =
      '<div class="modal-status">' +
        '<div class="failure-icon" aria-label="Payment failed">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</div>' +
        '<p class="modal-status-text modal-status-text--failure">Payment Failed</p>' +
        '<p class="modal-status-hint">The transaction could not be processed. Please try again.</p>' +
        '<div class="modal-actions">' +
          '<button class="btn btn-primary" id="modal-retry-btn">Retry</button>' +
          '<button class="btn btn-outline" id="modal-cancel-btn">Cancel</button>' +
        '</div>' +
      '</div>';
  }

  body.innerHTML = html;
}

function startPaymentSimulation() {
  setTimeout(function () {
    checkoutState.paymentState = 'success';
    var modal = document.getElementById('payment-modal');
    if (modal) {
      modal.classList.remove('modal--loading');
      modal.classList.add('modal--success');
    }
    renderModalState();

    setTimeout(function () {
      closePaymentModal();
      resetCheckout();
    }, 4000);
  }, 3000);
}

function resetCheckout() {
  checkoutState.selectedPackage = null;
  checkoutState.phone = '';
  checkoutState.isValid = false;

  var input = document.getElementById('checkout-phone');
  var error = document.getElementById('checkout-phone-error');
  var payBtn = document.getElementById('checkout-pay-btn');
  var summary = document.getElementById('checkout-summary');
  var empty = document.getElementById('checkout-empty');

  if (input) { input.value = ''; input.classList.remove('input--error', 'input--valid'); }
  if (error) error.textContent = '';
  if (payBtn) payBtn.disabled = true;
  if (summary) summary.classList.add('checkout-summary--hidden');
  if (empty) empty.classList.remove('checkout-summary--hidden');

  selectedPackageId = null;
  updatePackagesUI();
}

function initCheckout() {
  var phoneInput = document.getElementById('checkout-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      validatePhone(e.target.value);
    });
  }

  document.addEventListener('click', function (e) {
    if (e.target.id === 'checkout-pay-btn' && checkoutState.isValid && checkoutState.selectedPackage) {
      openPaymentModal();
    }

    if (e.target.id === 'modal-retry-btn') {
      checkoutState.paymentState = 'loading';
      var modal = document.getElementById('payment-modal');
      if (modal) {
        modal.classList.remove('modal--success', 'modal--failure');
        modal.classList.add('modal--loading');
      }
      renderModalState();
      startPaymentSimulation();
    }

    if (e.target.id === 'modal-cancel-btn') {
      closePaymentModal();
    }

    var overlay = e.target.closest('.modal-overlay');
    if (overlay) {
      closePaymentModal();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePaymentModal();
    }
  });
}
