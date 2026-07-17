var packageData = [
  {
    id: 'hourly',
    name: 'Hourly',
    duration: '1 Hour',
    speed: 'Unlimited',
    price: 50
  },
  {
    id: 'six-hours',
    name: 'Flex 6',
    duration: '6 Hours',
    speed: 'Unlimited',
    price: 200
  },
  {
    id: 'daily',
    name: 'Daily',
    duration: '1 Day',
    speed: 'Unlimited',
    price: 350
  },
  {
    id: 'weekly',
    name: 'Weekly',
    duration: '7 Days',
    speed: 'Unlimited',
    price: 1000
  }
];

var selectedPackageId = null;

function renderPackages() {
  var grid = document.getElementById('packages-grid');
  if (!grid) return;

  var html = '';
  for (var i = 0; i < packageData.length; i++) {
    var pkg = packageData[i];
    html += createPackageCard(pkg);
  }
  grid.innerHTML = html;
}

function createPackageCard(pkg) {
  var selectedClass = selectedPackageId === pkg.id ? ' package-card--selected' : '';

  return (
    '<div class="package-card' + selectedClass + '" data-package-id="' + pkg.id + '" role="button" tabindex="0" aria-label="Select ' + pkg.name + ' package">' +
      '<div class="package-card-header">' +
        '<h3 class="package-card-name">' + pkg.name + '</h3>' +
        '<span class="package-card-duration">' + pkg.duration + '</span>' +
      '</div>' +
      '<div class="package-card-speed">' +
        '<span class="package-card-speed-value">' + pkg.speed + '</span>' +
      '</div>' +
      '<div class="package-card-price">' +
        '<span class="package-card-currency">KSh</span>' +
        '<span class="package-card-amount">' + pkg.price.toLocaleString() + '</span>' +
      '</div>' +
      '<button class="btn btn-primary package-card-btn" data-package-id="' + pkg.id + '">' +
        'Buy Package' +
      '</button>' +
    '</div>'
  );
}

function selectPackage(id) {
  if (selectedPackageId === id) return;

  selectedPackageId = id;
  updatePackagesUI();
  updateCheckout(id);
  scrollToCheckout();
}

function updatePackagesUI() {
  var cards = document.querySelectorAll('.package-card');
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var pid = card.getAttribute('data-package-id');
    if (pid === selectedPackageId) {
      card.classList.add('package-card--selected');
    } else {
      card.classList.remove('package-card--selected');
    }
  }
}

function scrollToCheckout() {
  var checkout = document.getElementById('checkout');
  if (!checkout) return;

  var headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-height')
  ) || 64;

  var pos = checkout.getBoundingClientRect().top + window.scrollY - headerHeight;
  window.scrollTo({ top: pos, behavior: 'smooth' });
}

function initPackages() {
  renderPackages();

  document.addEventListener('click', function (e) {
    var card = e.target.closest('.package-card');
    if (card) {
      var pid = card.getAttribute('data-package-id');
      if (pid) selectPackage(pid);
      return;
    }

    var btn = e.target.closest('.package-card-btn');
    if (btn) {
      var pid = btn.getAttribute('data-package-id');
      if (pid) selectPackage(pid);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var card = e.target.closest('.package-card');
      if (card) {
        e.preventDefault();
        var pid = card.getAttribute('data-package-id');
        if (pid) selectPackage(pid);
      }
    }
  });
}
