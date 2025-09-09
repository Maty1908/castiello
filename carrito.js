// carrito.js

// Inicializar carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Revisar si usuario está logueado
function checkLoginOrRedirect() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "inicio.sesion.html";
    return false;
  }
  return true;
}

// Actualizar carrito en pantalla, subtotal y contador
function updateCart() {
  const cartList = document.getElementById("cart-offcanvas");
  const totalElem = document.getElementById("total-offcanvas");
  const cartCount = document.getElementById("cart-count");

  if (!cartList) return;

  cartList.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.marginBottom = "10px";

    li.innerHTML = `
      <span>${item.name}</span>
      <div>
        <button onclick="decreaseQty(${index})">-</button>
        <span style="margin:0 8px;">${item.quantity}</span>
        <button onclick="increaseQty(${index})">+</button>
      </div>
      <span>$${item.price * item.quantity}</span>
    `;
    cartList.appendChild(li);

    total += item.price * item.quantity;
    totalItems += item.quantity;
  });

  if (totalElem) totalElem.textContent = `Total: $${total}`;
  if (cartCount) cartCount.textContent = totalItems;

  // Guardar carrito y total en localStorage para la página de gracias
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("montoTotal", total);

  // Guardar resumen del pedido en formato legible
  const resumen = cart.map(item => `${item.quantity} x ${item.name} - $${item.price * item.quantity}`).join("\n");
  localStorage.setItem("resumenPedido", resumen);
}

// Funciones para aumentar y disminuir cantidad
function increaseQty(index) {
  cart[index].quantity += 1;
  updateCart();
}

function decreaseQty(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

// Agregar producto
function addToCart(name, price, quantity) {
  if (!checkLoginOrRedirect()) return;

  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
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
  pagoMetodo.value = "Transferencia";

  pedidoResumen.value = cart.map(item => `${item.quantity} x ${item.name} - $${item.price * item.quantity}`).join("\n");

  form.submit();

  // NO BORRAR el carrito aquí; se borra en la página de gracias
}

// Inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  updateCart();

  // Botones de agregar al carrito
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
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