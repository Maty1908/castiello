// carrito.js

// Inicializar carrito desde localStorage o vacío
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Función para actualizar carrito en pantalla y en localStorage
function updateCart() {
  const cartList = document.getElementById("cart-offcanvas");
  const totalElem = document.getElementById("total-offcanvas");
  cartList.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x ${item.quantity} - $${item.price * item.quantity}
      <div>
        <button onclick="removeItem(${index})">Eliminar</button>
      </div>
    `;
    cartList.appendChild(li);
    total += item.price * item.quantity;
  });

  totalElem.textContent = `Total: $${total}`;
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Función para agregar producto
function addToCart(name, price, quantity) {
  let existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }
  updateCart();
}

// Función para eliminar producto
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

  const form = document.getElementById("order-form");
  if (!form) return;

  // Ejemplo: rellenar campos del formulario (modifica según tus inputs)
  const hiddenName = document.getElementById("hiddenName");
  const hiddenEmail = document.getElementById("hiddenEmail");
  const hiddenPhone = document.getElementById("hiddenPhone");
  const pedidoResumen = document.getElementById("pedidoResumen");
  const pagoMetodo = document.getElementById("pagoMetodo");

  // Aquí puedes tomar valores de un formulario real si quieres
  hiddenName.value = prompt("Nombre y Apellido") || "Cliente Anónimo";
  hiddenEmail.value = prompt("Email") || "email@dominio.com";
  hiddenPhone.value = prompt("Celular") || "0000000000";
  pagoMetodo.value = prompt("Método de pago") || "No especificado";

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