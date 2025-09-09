// carrito.js

// Obtener carrito del localStorage o crear uno vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para verificar si el usuario está logueado
function checkLoginOrRedirect() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "inicio.sesion.html";
    return false;
  }
  return true;
}

// Función para actualizar carrito en offcanvas y contador
function updateCart() {
  const cartList = document.getElementById("cart-offcanvas");
  const totalElem = document.getElementById("total-offcanvas");
  const cartCount = document.getElementById("cart-count");

  if (!cartList || !totalElem || !cartCount) return;

  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML = "<li>Tu carrito está vacío</li>";
    totalElem.textContent = "Total: $0";
    cartCount.textContent = "0";
    return;
  }

  let total = 0;
  let totalQuantity = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    totalQuantity += item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
      <button onclick="removeItem(${index})">Eliminar</button>
    `;
    cartList.appendChild(li);
  });

  totalElem.textContent = `Total: $${total.toFixed(2)}`;
  cartCount.textContent = totalQuantity;
}

// Función para agregar producto al carrito
function addToCart(product) {
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Función para eliminar un producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Función para limpiar todo el carrito
function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Inicializar botones "Agregar al carrito" del index.html
function initAddToCartButtons() {
  const buttons = document.querySelectorAll('.add-to-cart');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // evita redirección del card
      const name = btn.getAttribute('data-name');
      const price = parseFloat(btn.getAttribute('data-price'));
      const id = index + 1; // id único para cada producto del index

      addToCart({ id, name, price });

      // Abrir offcanvas automáticamente
      const offcanvasEl = document.getElementById('offcanvasCarrito');
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasEl);
      bsOffcanvas.show();
    });
  });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  checkLoginOrRedirect();
  updateCart();
  initAddToCartButtons();
});