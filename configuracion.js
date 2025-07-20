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
    const modalAddBtn = document.getElementById('add-to-cart-from-modal');

    document.querySelectorAll('.view-details').forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.getAttribute('data-image');
            modalName.textContent = img.getAttribute('data-name');
            modalPrice.textContent = `$${parseFloat(img.getAttribute('data-price')).toFixed(2)}`;
            modalDescription.textContent = img.getAttribute('data-description');

            // Establecer datos en el botón del modal
            modalAddBtn.setAttribute('data-id', img.getAttribute('data-id') || Date.now());
            modalAddBtn.setAttribute('data-name', img.getAttribute('data-name'));
            modalAddBtn.setAttribute('data-price', img.getAttribute('data-price'));

            openModal();
        });
    });

    modalAddBtn.addEventListener('click', () => {
        const id = modalAddBtn.getAttribute('data-id');
        const name = modalAddBtn.getAttribute('data-name');
        const price = parseFloat(modalAddBtn.getAttribute('data-price'));

        if (id && name && price) {
            addToCart(id, name, price);
            closeModal();
        }
    });

    // Modal Vista Rápida al hacer clic en imagen
    const modal = document.getElementById('product-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');

    const modalImage = document.getElementById('modal-product-image');
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDescription = document.getElementById('modal-product-description');

    // Animación de apertura/cierre para modal de producto
    function openModal() {
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
        if (modalOverlay) modalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.add('hidden');
            if (modalOverlay) modalOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400); // Debe coincidir con la transición CSS
    }

    closeModalBtn.addEventListener('click', closeModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

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

    // Animación de apertura/cierre para carrito
    function openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        cartSidebar.classList.remove('translate-x-full');
        setTimeout(() => {
            cartSidebar.classList.add('show');
        }, 10);
        cartOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        cartSidebar.classList.remove('show');
        setTimeout(() => {
            cartSidebar.classList.add('translate-x-full');
            cartOverlay.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400);
    }

    document.getElementById('cart-btn').addEventListener('click', openCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.getElementById('cart-overlay').addEventListener('click', closeCart);

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
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que otros listeners cierren la alerta

                const id = btn.getAttribute('data-id');
                // Alerta personalizada con Tailwind y animación
                const confirmBox = document.createElement('div');
                confirmBox.className = "fixed inset-0 flex items-center justify-center z-50";
                confirmBox.innerHTML = `
                    <div class="bg-white rounded-lg shadow-xl p-6 max-w-xs w-full animate-fade-in-up relative z-10">
                        <h3 class="text-lg font-bold mb-2 text-gray-800">¿Eliminar producto?</h3>
                        <p class="mb-4 text-gray-600">¿Seguro que deseas eliminar este producto del carrito?</p>
                        <div class="flex justify-end space-x-2">
                            <button type="button" class="cancel-btn-alert px-4 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancelar</button>
                            <button type="button" class="confirm-btn-alert px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition">Eliminar</button>
                        </div>
                    </div>
                    <div class="fixed inset-0 bg-black bg-opacity-40 animate-fade-in"></div>
                `;
                document.body.appendChild(confirmBox);

                // Animaciones personalizadas (solo se agrega una vez)
                if (!document.getElementById('alert-animations')) {
                    const style = document.createElement('style');
                    style.id = 'alert-animations';
                    style.innerHTML = `
                        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                        @keyframes fade-in-up { from { opacity: 0; transform: translateY(40px);} to { opacity: 1; transform: translateY(0);} }
                        .animate-fade-in { animation: fade-in 0.25s; }
                        .animate-fade-in-up { animation: fade-in-up 0.3s cubic-bezier(.4,2,.3,1); }
                    `;
                    document.head.appendChild(style);
                }

                // Evita que el overlay cierre la alerta automáticamente
                const overlay = confirmBox.querySelector('.fixed.inset-0.bg-black');
                if (overlay) {
                    overlay.addEventListener('click', () => {
                        document.body.removeChild(confirmBox);
                    });
                }

                confirmBox.querySelector('.cancel-btn-alert').onclick = () => {
                    document.body.removeChild(confirmBox);
                };
                confirmBox.querySelector('.confirm-btn-alert').onclick = () => {
                    cart = cart.filter(i => i.id !== id);
                    updateCart();
                    saveCart();
                    document.body.removeChild(confirmBox);
                };
            });
        });
    }, 40); // <-- Cierra setTimeout correctamente
}
    // Mostrar/Ocultar menú móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu) {
                mobileMenu.classList.toggle('hidden');
            }
        });
    }

    // Acordeón para submenú de "Hombre"
    const menMenuBtn = document.querySelector('#mobile-menu > div > div > button');
    const menSubMenu = document.getElementById('mobile-men-menu');

    if (menMenuBtn && menSubMenu) {
        menMenuBtn.addEventListener('click', () => {
            menSubMenu.classList.toggle('hidden');
            menSubMenu.classList.toggle('max-h-64');
            menSubMenu.classList.toggle('transition-all');
            menSubMenu.classList.toggle('duration-300');
        });
    }
