const socket = io();
console.log("🟢 Cliente conectado a WebSocket");

// Escucha productos actualizados
socket.on("productosActualizados", (productos) => {
  console.log("📥 Productos actualizados recibidos:", productos);
  const lista = document.getElementById("product-list");
  lista.innerHTML = "";
  productos.forEach((prod) => {
    const li = document.createElement("li");
    li.innerText = `${prod.title} - $${prod.price}`;
    lista.appendChild(li);
  });
});

// Formulario de nuevo producto
const form = document.getElementById("product-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nuevoProducto = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    code: document.getElementById("code").value,
    price: parseFloat(document.getElementById("price").value),
    status: document.getElementById("status").value === "true",
    stock: parseInt(document.getElementById("stock").value),
    category: document.getElementById("category").value,
    thumbnails: document.getElementById("thumbnails").value,
  };

  // Validación básica por si se rompe algo
  if (nuevoProducto.title && !isNaN(nuevoProducto.price)) {
    socket.emit("nuevoProducto", nuevoProducto);
    form.reset();
  }
});
const deleteForm = document.getElementById("delete-form");
deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("deleteId").value;

  if (id) {
    socket.emit("eliminarProducto", id);
    deleteForm.reset();
  }
});
