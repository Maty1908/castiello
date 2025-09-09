// carrito.js

// Inicializar carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para revisar login y redirigir si no está logueado
function checkLoginOrRedirect() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "inicio.sesion.html";
    return false;
  }
  return true;
}

// Función para actualizar carrito en pantalla, mini contador y localStorage
function updateCart() {
  const cartList = document.getElementById("cart-offcanvas");
  const totalElem = document.getElementById("total-offcanvas");
  const cartCount = document.getElementById("cart-count");

  if (cartList) cartList.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    if (cartList) {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.name} x ${item.quantity} - $${item.price * item.quantity}
        <div>
          <button onclick="removeItem(${index})">Eliminar</button>
        </div>
      `;
      cartList.appendChild(li);
    }
    total += item.price * item.quantity;
    totalItems += item.quantity;
  });

  if (totalElem) totalElem.textContent = `Total: $${total}`;
  if (cartCount) cartCount.textContent = totalItems;

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para agregar producto al carrito
function addToCart(name, price, quantity) {
  if (!checkLoginOrRedirect()) return; // Redirige si no está logueado

  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }
  updateCart();
}

// Función para eliminar producto del carrito
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// Función para enviar pedido por FormSubmit
function enviarPedido() {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  if (!checkLoginOrRedirect()) return; // Redirige si no está logueado

  const form = document.getElementById("order-form");
  if (!form) return;

  const hiddenName = document.getElementById("hiddenName");
  const hiddenEmail = document.getElementById("hiddenEmail");
  const hiddenPhone = document.getElementById("hiddenPhone");
  const pedidoResumen = document.getElementById("pedidoResumen");
  const pagoMetodo = document.getElementById("pagoMetodo");

  // Tomar datos del usuario desde localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  hiddenName.value = userData.name || "Cliente Anónimo";
  hiddenEmail.value = userData.email || "email@dominio.com";
  hiddenPhone.value = userData.phone || "0000000000";

  pagoMetodo.value = "Transferencia"; // obligatorio

  // Generar resumen del pedido
  pedidoResumen.value = cart.map(item => `${item.name} x ${item.quantity}`).join(", ");

  // Enviar formulario
  form.submit();

  // Limpiar carrito después de enviar
  cart = [];
  updateCart();
}

// Inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCart();

  // Botones de agregar al carrito
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation(); // evitar que card haga redirect
      const name = button.getAttribute("data-name");
      const price = Number(button.getAttribute("data-price"));
      addToCart(name, price, 1);
    });
  });

  // Botón finalizar compra
  const btnFinalizar = document.getElementById("btnFinalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", enviarPedido);
  }
});