// carrito.js

// Inicializar carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para revisar login
function checkLoginOrRedirect() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "inicio.sesion.html";
    return false;
  }
  return true;
}

// Función para actualizar carrito en pantalla, contador y localStorage
function updateCart() {
  const cartList = document.getElementById("cart-offcanvas");
  const totalElem = document.getElementById("total-offcanvas");
  const cartCount = document.getElementById("cart-count");

  if (cartList) cartList.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("d-flex", "justify-content-between", "align-items-center");

    li.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <div class="cart-item-controls">
        <button onclick="changeQuantity(${index}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${index}, 1)">+</button>
        <span class="cart-item-price">$${item.price * item.quantity}</span>
        <button onclick="removeItem(${index})">Eliminar</button>
      </div>
    `;
    cartList.appendChild(li);

    total += item.price * item.quantity;
    totalItems += item.quantity;
  });

  if (totalElem) totalElem.textContent = `Total: $${total}`;
  if (cartCount) cartCount.textContent = totalItems;

  // Guardar carrito y total en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("montoTotal", total);

  // Guardar resumen del pedido
  const resumen = cart.map(item => `${item.quantity} x ${item.name} - $${item.price * item.quantity}`).join("\n");
  localStorage.setItem("resumenPedido", resumen);
}

// Función para agregar producto
function addToCart(name, price, quantity) {
  if (!checkLoginOrRedirect()) return;

  const cleanName = name.replace(/ *Castiello */gi, "").trim();
  let existingItem = cart.find(item => item.name === cleanName);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name: cleanName, price, quantity });
  }

  updateCart();
}

// Función para eliminar producto
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

// Función para cambiar cantidad (+/-)
function changeQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  updateCart();
}

// Función para enviar pedido
function enviarPedido() {
  if (cart.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  if (!checkLoginOrRedirect()) return;

  const form = document.getElementById("order-form");
  if (!form) return;

  const hiddenName = document.getElementById("hiddenName");
  const hiddenEmail = document.getElementById("hiddenEmail");
  const hiddenPhone = document.getElementById("hiddenPhone");
  const pedidoResumen = document.getElementById("pedidoResumen");
  const pagoMetodo = document.getElementById("pagoMetodo");

  const userData = JSON.parse(localStorage.getItem("userData"));
  hiddenName.value = userData?.name || "Cliente Anónimo";
  hiddenEmail.value = userData?.email || "email@dominio.com";
  hiddenPhone.value = userData?.phone || "0000000000";

  pagoMetodo.value = "Transferencia";

  // Guardar resumen del pedido y total
  const resumen = cart.map(item => `${item.quantity} x ${item.name} - $${item.price * item.quantity}`).join("\n");
  const totalFinal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  pedidoResumen.value = `${resumen}\n\nTotal: $${totalFinal}`;

  // Guardar en localStorage para la página de gracias
  localStorage.setItem("montoTotal", totalFinal);
  localStorage.setItem("resumenPedido", resumen);

  form.submit();

  // Limpiar carrito después de enviar
  cart = [];
  updateCart();
}

// Inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCart();

  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const name = button.getAttribute("data-name");
      const price = Number(button.getAttribute("data-price"));
      addToCart(name, price, 1);
    });
  });

  const btnFinalizar = document.getElementById("btnFinalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", enviarPedido);
  }
});