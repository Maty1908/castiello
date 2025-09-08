// ---------- VARIABLES ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartOffcanvas = document.getElementById('cart-offcanvas');
const totalOffcanvas = document.getElementById('total-offcanvas');
const cartCount = document.getElementById('cart-count');
const btnFinalizar = document.getElementById('btnFinalizar');

let selectedPaymentMethod = 'Transferencia';

// ---------- ACTUALIZAR CARRITO ----------
function updateCart(){
  if(!cartOffcanvas || !totalOffcanvas || !cartCount) return;

  cartOffcanvas.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} x ${item.quantity} = $${item.price * item.quantity}
      <div>
        <button onclick="changeQuantity(${index}, -1)">-</button>
        <button onclick="changeQuantity(${index}, 1)">+</button>
      </div>
    `;
    cartOffcanvas.appendChild(li);
  });
  totalOffcanvas.textContent = `Total: $${total}`;
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ---------- CAMBIAR CANTIDAD ----------
function changeQuantity(index, delta){
  cart[index].quantity += delta;
  if(cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

// ---------- AGREGAR PRODUCTO ----------
function addToCart(name, price, quantity = 1){
  const existingItem = cart.find(item => item.name === name);
  if(existingItem){
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }
  updateCart();
}

// ---------- FINALIZAR COMPRA ----------
if(btnFinalizar){
  btnFinalizar.addEventListener('click', () => {
    if(cart.length === 0){
      alert('El carrito está vacío.');
      return;
    }
    alert("Simulación de compra. Carrito enviado.");
    // Aquí podés enviar los datos al backend o a formsubmit
  });
}

// ---------- CARGAR AL INICIO ----------
document.addEventListener("DOMContentLoaded", updateCart);