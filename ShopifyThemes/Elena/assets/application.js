if (document.getElementById('sort_by') != null) {
    document.querySelector('#sort_by').addEventListener('change', function (e) {
        var url = new URL(window.location.href);
        url.searchParams.set('sort_by', e.currentTarget.value);

        window.location = url.href;
    });
}

if (document.getElementById('AddressCountryNew') != null) {
    document.getElementById('AddressCountryNew').addEventListener('change', function (e) {
        var provinces = this.options[this.selectedIndex].getAttribute('data-provinces');
        var provinceSelector = document.getElementById('AddressProvinceNew');
        var provinceArray = JSON.parse(provinces);

        //console.log(provinceArray);
        if (provinceArray.length < 1) {
            provinceSelector.setAttribute('disabled', 'disabled');
        } else {
            provinceSelector.removeAttribute('disabled');
        }

        provinceSelector.innerHTML = '';
        var options = '';
        for (var i = 0; i < provinceArray.length; i++) {
            options += '<option value="' + provinceArray[i][0] + '">' + provinceArray[i][0] + '</option>';
        }

        provinceSelector.innerHTML = options;
    });
}

if (document.getElementById("forgotPassword") != null) {
    document.getElementById("forgotPassword").addEventListener("click", function (e) {
        console.log("I clicked");
        const element = document.querySelector("#forgot_password_form");
        if (element.classList.contains("d-none")) {
            element.classList.remove("d-none");
            element.classList.add("d-block");
        }
    });
}

var localeItems = document.querySelectorAll("#localeItem");
if (localeItems.length > 0) {
    localeItems.forEach(item => {
        item.addEventListener("click", event => {
            document.getElementById("localeCode").value = item.getAttribute("lang");
            document.getElementById("localization_form_tag").submit();
        });
    });
}

var productInfoAnchors = document.querySelectorAll("#productInfoAnchor");

var productModal;

if (document.getElementById('productInfoModal') != null) {
    productModal = new bootstrap.Modal(document.getElementById('productInfoModal'), {});
}

if (productInfoAnchors.length > 0) {
    productInfoAnchors.forEach(item => {
        item.addEventListener("click", event => {

            var url = '/products/' + item.getAttribute('product-handle') + '.js';

            fetch(url)
                .then((resp) => resp.json())
                .then(function (data) {
                    console.log(data);

                    document.getElementById("productInfoImg").src = data.images[0];
                    document.getElementById("productInfoTitle").innerHTML = data.title;
                    document.getElementById("productInfoPrice").innerHTML = item.getAttribute('product-price');
                    document.getElementById("productInfoDescription").innerHTML = data.description;

                    var variants = data.variants;
                    var variantSelect = document.getElementById("modalItemID");

                    variantSelect.innerHTML = '';

                    variants.forEach(function (variant, index) {
                        console.log(variant);

                        variantSelect.options[variantSelect.options.length] = new Option(variant.option1, variant.id);
                    });

                    productModal.show();
                });
        });
    });
}

var modalAddToCartForm = document.querySelector("#addToCartForm");

if (modalAddToCartForm != null) {
    modalAddToCartForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let formData = {
            'items': [
                {
                    'id': document.getElementById("modalItemID").value,
                    'quantity': document.getElementById("modalItemQuantity").value
                }
            ]
        };

        fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then((resp) => {
                return resp.json();
            })
            .then((data) => {
                update_cart();
            })
            .catch((err) => {
                console.error('Error: ' + err);
            })
    });
}

document.addEventListener('DOMContentLoaded', function() {
    update_cart();
});

function update_cart() {
    fetch('/cart.js')
    .then((resp) => resp.json())
    .then((data) => document.getElementById("numberOfCartItems").innerHTML = data.items.length)
    .catch((err) => console.error(err));
}