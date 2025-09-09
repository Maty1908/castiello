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
        <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
          <span>${item.name}</span>
          <div>
            <button onclick="decreaseQuantity(${index})">-</button>
            <span style="margin:0 8px;">${item.quantity}</span>
            <button onclick="increaseQuantity(${index})">+</button>
          </div>
          <span>$${item.price * item.quantity}</span>
        </div>
        <div style="margin-top:5px;"><button onclick="removeItem(${index})">Eliminar</button></div>
      `;
      cartList.appendChild(li);
    }
    total += item.price * item.quantity;
    totalItems += item.quantity;
  });

  if (totalElem) totalElem.textContent = `Total: $${total}`;
  if (cartCount) cartCount.textContent = totalItems;

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("montoTotal", total);

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

// Funciones para aumentar/disminuir cantidad
function increaseQuantity(index) {
  cart[index].quantity += 1;
  updateCart();
}
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity -= 1;
  } else {
    cart.splice(index, 1);
  }
  updateCart();
}

// Función para eliminar producto
function removeItem(index) {
  cart.splice(index, 1);
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

  const resumen = cart.map(item => `${item.quantity} x ${item.name} - $${item.price * item.quantity}`).join("\n");
  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  pedidoResumen.value = `${resumen}\n\nTotal: $${total}`;

  localStorage.setItem("montoTotal", total);
  localStorage.setItem("resumenPedido", resumen);

  // Enviar formulario
  form.submit();

  // NO limpiar el carrito aquí, se limpiará en la página de gracias
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