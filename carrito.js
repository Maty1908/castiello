// carrito.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Comprobar login
function checkLoginOrRedirect() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "inicio.sesion.html";
    return false;
  }
  return true;
}

// Actualizar carrito en pantalla
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
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.marginBottom = "8px";
      li.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px;">
          <span>${item.name}</span>
          <button onclick="decreaseQty(${index})" style="padding:2px 6px;">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQty(${index})" style="padding:2px 6px;">+</button>
        </div>
        <span>$${item.price * item.quantity}</span>
      `;
      cartList.appendChild(li);
    }
    total += item.price * item.quantity;
    totalItems += item.quantity;
  });

  if (totalElem) totalElem.textContent = `Total: $${total}`;
  if (cartCount) cartCount.textContent = totalItems;

  // Guardar en localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("montoTotal", total);
  const resumen = cart.map(item => `${item.quantity} x ${item.name} - $${item.price * item.quantity}`).join("\n");
  localStorage.setItem("resumenPedido", resumen);
}

// Funciones para botones + y -
function increaseQty(index) {
  cart[index].quantity++;
  updateCart();
}

function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1); // eliminar si llega a 0
  }
  updateCart();
}

// Agregar producto al carrito
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

// Enviar pedido
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

  pedidoResumen.value = localStorage.getItem("resumenPedido") + `\n\nTotal: $${localStorage.getItem("montoTotal")}`;
  pagoMetodo.value = "Transferencia";

  form.submit();

  // Limpiar carrito
  cart = [];
  updateCart();
}

// Inicializar eventos
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
  if (btnFinalizar) btnFinalizar.addEventListener("click", enviarPedido);
});