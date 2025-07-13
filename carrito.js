let cart = [];

// Guardar en localStorage
function saveCart() {
    localStorage.setItem('modaCart', JSON.stringify(cart));
}

// Cargar desde localStorage
function loadCart() {
    const storedCart = localStorage.getItem('modaCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCart();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCart();

    // Añadir producto desde botón
    document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
        button.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCart(id, name, price);

            this.textContent = 'Añadido ✓';
            this.classList.remove('bg-indigo-600');
            this.classList.add('bg-green-500');
            setTimeout(() => {
                this.textContent = 'Añadir';
                this.classList.add('bg-indigo-600');
                this.classList.remove('bg-green-500');
            }, 1500);
        });
    });

    // Mostrar/Ocultar carrito
    document.getElementById('cart-btn').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.remove('translate-x-full');
        document.getElementById('cart-overlay').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);

    function closeCart() {
        document.getElementById('cart-sidebar').classList.add('translate-x-full');
        document.getElementById('cart-overlay').classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Vaciar carrito (botón opcional si lo agregas)
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            cart = [];
            updateCart();
            saveCart();
        });
    }
});

// Añadir al carrito
function addToCart(id, name, price) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    updateCart();
    saveCart();
}

// Actualizar carrito visualmente
function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const sidebarCount = document.getElementById('sidebar-cart-count');
    const subtotalEl = document.getElementById('cart-subtotal');

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    cartCount.textContent = totalItems;
    sidebarCount.textContent = totalItems;
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center py-8">Tu carrito está vacío</p>';
        return;
    }

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'flex py-4 cart-item';
        div.innerHTML = `
            <div class="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                <img src="https://placehold.co/200x200" alt="${item.name}" class="w-full h-full object-cover">
            </div>
            <div class="ml-4 flex-grow">
                <h4 class="font-medium">${item.name}</h4>
                <p class="text-indigo-600 font-bold">$${item.price.toFixed(2)}</p>
                <div class="flex items-center mt-1">
                    <button class="decrease-quantity text-gray-500 px-2" data-id="${item.id}">-</button>
                    <span class="quantity mx-2">${item.quantity}</span>
                    <button class="increase-quantity text-gray-500 px-2" data-id="${item.id}">+</button>
                    <button class="remove-item ml-auto text-red-500" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Listeners para aumentar, disminuir, eliminar
    setTimeout(() => {
        document.querySelectorAll('.increase-quantity').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    updateCart();
                    saveCart();
                }
            });
        });

        document.querySelectorAll('.decrease-quantity').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const item = cart.find(i => i.id === id);
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(i => i.id !== id);
                }
                updateCart();
                saveCart();
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                if (confirm('¿Eliminar este producto del carrito?')) {
                    cart = cart.filter(i => i.id !== id);
                    updateCart();
                    saveCart();
                }
            });
        });
    }, 50);
}
