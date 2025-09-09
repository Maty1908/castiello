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

// Función para actualizar el carrito en la página
function updateCart() {
  const cartList = document.getElementById("cart-offcanvas");
  const totalElem = document.getElementById("cart-total");

  if (!cartList || !totalElem) return;

  // Limpiar carrito actual
  cartList.innerHTML = "";

  // Si el carrito está vacío
  if (cart.length === 0) {
    cartList.innerHTML = "<p>Tu carrito está vacío</p>";
    totalElem.textContent = "$0";
    return;
  }

  // Agregar productos al carrito
  let total = 0;
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
      <button onclick="removeItem(${index})">Eliminar</button>
    `;
    cartList.appendChild(li);
  });

  totalElem.textContent = `$${total.toFixed(2)}`;
}

// Función para eliminar un producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Función para agregar productos al carrito
function addToCart(product) {
  // Verificar si ya existe el producto en el carrito
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Función para limpiar el carrito (por ejemplo después de pagar)
function clearCart() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Inicializar carrito al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  checkLoginOrRedirect();
  updateCart();
});