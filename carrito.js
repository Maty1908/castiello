// carrito.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function checkLoginOrRedirect() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    window.location.href = "inicio.sesion.html";
    return false;
  }
  return true;
}

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
  localStorage.setItem("montoTotal", total);
}

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

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}

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

  let totalFinal = 0;
  const resumen = cart.map(item => {
    const subtotal = item.price * item.quantity;
    totalFinal += subtotal;
    return `${item.quantity} x ${item.name} - $${subtotal}`;
  }).join("\n");

  localStorage.setItem("montoTotal", totalFinal);
  localStorage.setItem("resumenPedido", resumen);

  pedidoResumen.value = `${resumen}\n\nTotal: $${totalFinal}`;

  form.submit();

  cart = [];
  updateCart();
}

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
