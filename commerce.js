const commerceConfig = window.ATHLETIC_BIOTECHNICS_COMMERCE || {};
const product = commerceConfig.product || {};
const cartKey = "ab_cart";

function formatMoney(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value || 0);
}

function getCart() {
  return JSON.parse(localStorage.getItem(cartKey) || "[]");
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addProductToCart() {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  window.location.href = "cart.html";
}

function setupAddToCart() {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", addProductToCart);
  });
}

function updateQuantity(id, direction) {
  const cart = getCart()
    .map((item) => item.id === id ? { ...item, quantity: item.quantity + direction } : item)
    .filter((item) => item.quantity > 0);

  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cartRoot = document.querySelector("[data-cart-root]");
  if (!cartRoot) return;

  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart.length) {
    cartRoot.innerHTML = `
      <div class="commerce-empty">
        <h2>Your cart is empty.</h2>
        <p>Add AB-M1 to reserve your place in the first Athletic Biotechnics product release.</p>
        <a class="button button-primary" href="product.html">View AB-M1</a>
      </div>
    `;
    return;
  }

  cartRoot.innerHTML = `
    <div class="cart-list">
      ${cart.map((item) => `
        <article class="cart-item">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <span class="section-kicker">Product</span>
            <h2>${item.name}</h2>
            <p>Compact tempo hardware for cadence, footwork, plyometrics, rehab progressions, and repeatable movement rhythm.</p>
          </div>
          <div class="cart-controls">
            <strong>${formatMoney(item.price, item.currency)}</strong>
            <div>
              <button type="button" data-qty="${item.id}" data-direction="-1">-</button>
              <span>${item.quantity}</span>
              <button type="button" data-qty="${item.id}" data-direction="1">+</button>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
    <aside class="cart-summary">
      <span class="section-kicker">Order summary</span>
      <h2>${formatMoney(total, product.currency)}</h2>
      <p>Checkout is handled by Stripe or Shopify on the purchase page once your live account IDs are configured.</p>
      <a class="button button-primary" href="purchase.html">Continue to purchase</a>
      <button class="button button-ghost" type="button" data-clear-cart>Clear cart</button>
    </aside>
  `;

  cartRoot.querySelectorAll("[data-qty]").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.qty, Number(button.dataset.direction));
    });
  });

  cartRoot.querySelector("[data-clear-cart]")?.addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });
}

function hasStripeConfig() {
  const stripe = commerceConfig.stripe || {};
  return stripe.publishableKey && !stripe.publishableKey.includes("REPLACE")
    && stripe.buyButtonId && !stripe.buyButtonId.includes("REPLACE");
}

function renderStripeBuyButton() {
  const root = document.querySelector("[data-stripe-buy-button]");
  if (!root) return;

  if (!hasStripeConfig()) {
    root.innerHTML = `
      <div class="embed-placeholder">
        <h3>Stripe Buy Button not connected yet.</h3>
        <p>Add your Stripe publishable key and buy button ID in commerce-config.js.</p>
      </div>
    `;
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://js.stripe.com/v3/buy-button.js";
  document.head.appendChild(script);

  const button = document.createElement("stripe-buy-button");
  button.setAttribute("buy-button-id", commerceConfig.stripe.buyButtonId);
  button.setAttribute("publishable-key", commerceConfig.stripe.publishableKey);
  button.setAttribute("client-reference-id", `ab-m1-${Date.now()}`);
  root.appendChild(button);
}

function hasShopifyConfig() {
  const shopify = commerceConfig.shopify || {};
  return shopify.domain && !shopify.domain.includes("your-store")
    && shopify.storefrontAccessToken && !shopify.storefrontAccessToken.includes("REPLACE")
    && shopify.productId && !shopify.productId.includes("REPLACE");
}

function renderShopifyBuyButton() {
  const root = document.querySelector("[data-shopify-buy-button]");
  if (!root) return;

  if (!hasShopifyConfig()) {
    root.innerHTML = `
      <div class="embed-placeholder">
        <h3>Shopify Buy Button not connected yet.</h3>
        <p>Add your Shopify domain, Storefront access token, and product ID in commerce-config.js.</p>
      </div>
    `;
    return;
  }

  const scriptUrl = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

  function initShopify() {
    const client = ShopifyBuy.buildClient({
      domain: commerceConfig.shopify.domain,
      storefrontAccessToken: commerceConfig.shopify.storefrontAccessToken,
    });

    ShopifyBuy.UI.onReady(client).then((ui) => {
      ui.createComponent("product", {
        id: commerceConfig.shopify.productId,
        node: root,
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: {
          product: {
            layout: "horizontal",
            contents: { img: false, title: false, price: false },
            text: { button: "Buy with Shopify" },
            styles: {
              button: {
                "background-color": "#8b7bb8",
                "font-family": "system-ui, sans-serif",
                "font-weight": "800",
                ":hover": { "background-color": "#9a8cc8" },
              },
            },
          },
          cart: {
            styles: {
              button: { "background-color": "#8b7bb8" },
            },
          },
        },
      });
    });
  }

  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    initShopify();
  } else {
    const script = document.createElement("script");
    script.async = true;
    script.src = scriptUrl;
    script.onload = initShopify;
    document.head.appendChild(script);
  }
}

setupAddToCart();
renderCart();
renderStripeBuyButton();
renderShopifyBuyButton();
