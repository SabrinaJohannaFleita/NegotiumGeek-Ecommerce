// Contenedor categorias
const categories = document.querySelector('.container-cards-category');
// Categoria
const categoriesList = document.querySelectorAll('.category');
// Titulo de las cards
const title = document.getElementById('title');
// Contenedor donde se renderiza las cards
const renderArticulos = document.querySelector('.container-cards-elementos');
// Contenedor de las cards (Hoy te recomendamos)
const renderRecom = document.querySelector('.cards-recom');
// Carrito
const cartMenu = document.querySelector(".cart");
// Botón para abrir y cerrar carrito
const cartBtn = document.querySelector(".cart-menu");
// Contenedor del carrito donde se renderizan las cards
const productsCart = document.querySelector('.cart-container');
// Se renderiza precio total (carrito)
const total = document.querySelector('.total');
// Se renderiza precio sub total (carrito)
const subTotal = document.querySelector('.sub-total');
// Botón comprar (carrito)
const buyBtn = document.querySelector('.btn-buy');
// Vaciar carrito
const deleteBtn = document.querySelector('.btn-delete');
// Botón para abrir y cerrar menú hamburguesa
const barsMenu = document.querySelector(".nav-toggle");
// Menu hamburguesa//
const navMenu = document.querySelector(".nav-menu")
// Botón de cerrar carrito
const closeBtn = document.getElementById('close');
// Card del modal (confirma el añadido al carrito)
const showSuccesModal = document.querySelector('.add-modal')
const overlay = document.querySelector('.overlay');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const saveLocalStorage = (cartList) => {
    localStorage.setItem('cart', JSON.stringify(cartList));
}

const renderCard = (articulos) => {
    const {id, name, description, prize, img} = articulos;
    return `
    <div class="cards-articulos">
    <img src="${img}" alt="${name}">
    <h3>${name}</h3>
    <p>${description}</p>
    <div class="precio">
        <span class="color">$${prize}</span>
        <button class="btn-add"
        data-id="${id}"
        data-name="${name}"
        data-description="${description}"
        data-prize="${prize}"
        data-img="${img}">Agregar</button>
    </div>
    </div>
    `
}

const renderCards = () => {
    renderArticulos.innerHTML += stock.map(renderCard).join("");
};

const renderFilteredArticulos = (category) => {
    const articulosList = stock.filter(
      (articulos) => articulos.category === category
    );
    renderArticulos.innerHTML = articulosList.map(renderCard).join("");
};

const renderProducts = (category = undefined) => {
  if (!category) {
    renderCards();
    return;
  }
  renderFilteredArticulos(category);
}

const changeFilterState = (e) => {
    const selectedCategory = e.target.dataset.category;
    changeBtnActiveState(selectedCategory);
};

const changeBtnActiveState = (selectedCategory) => {
    const categories = [...categoriesList];
    categories.forEach((category) => {
      if (category.dataset.category !== selectedCategory) {
        category.classList.remove("active");
        return;
      }
      category.classList.add("active");
    });
};

const applyFilter = (e) => {
    if (!e.target.classList.contains("category")) return;
    changeFilterState(e);
    if (!e.target.dataset.category) {
      renderArticulos.innerHTML = "";
      title.innerHTML = 'Los más populares'
      renderProducts();
    } else {
      renderProducts(e.target.dataset.category);
      if (e.target.classList.contains("category")) {
        title.innerHTML = '';
        title.innerHTML = `${e.target.dataset.category}`
        return
      }
    };
};

const renderCardRecom = (articulos) => {
 const {id, img, name, description, prize} = articulos;
  return ` 
  <div class="card">
  <img src="${img}" alt="${name}">
  <div class="card-text">
      <h3>${name}</h3>
      <p>${description}</p>
      <span class="color">$${prize}</span>
  </div>
      <button class="btn-add"
      data-id="${id}"
      data-name="${name}"
      data-description="${description}"
      data-prize="${prize}"
      data-img="${img}">Agregar</button>
</div>
  `
};

const renderCardsRecom = () => {
   renderRecom.innerHTML += stock.slice(0, 3).map(renderCardRecom)
    .join("");
};

const toggleMenu = () => {
  navMenu.classList.toggle("nav__menu-visible");
  if (cartMenu.classList.contains("open-cart")) {
    cartMenu.classList.remove("open-cart");
    return;
  }
  overlay.classList.toggle("show-overlay");
};

const toggleCart = () => {
  cartMenu.classList.toggle("open-cart");
  if (navMenu.classList.contains("nav__menu-visible")) {
    navMenu.classList.remove("nav__menu-visible");
    return;
  }
  barsMenu.classList.add("hidden");
  overlay.classList.toggle("show-overlay");
};

const closeOnClick = (e) => {
  if (!e.target.classList.contains("nav-menu-item")) return;
  navMenu.classList.remove("nav__menu-visible");
  overlay.classList.remove("show-overlay");
  barsMenu.classList.remove("hidden");
};

const closeOnClickButton = (e) => {
  if (!e.target.classList.contains('close')) return;
  cartMenu.classList.remove('open-cart');
  overlay.classList.remove('show-overlay');
  barsMenu.classList.remove("hidden");
}

const closeOnOverlayClick = () => {
  navMenu.classList.remove("nav__menu-visible");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
  barsMenu.classList.remove("hidden");

};

const closeOnScroll = () => {
  if (
    !navMenu.classList.contains("nav__menu-visible") &&
    !cartMenu.classList.contains("open-cart")
  )
    return;
  navMenu.classList.remove("nav__menu-visible");
  cartMenu.classList.remove("open-cart");
  overlay.classList.remove("show-overlay");
  barsMenu.classList.remove("hidden");
};

//logica del carrito y rendercart

const renderCartProduct = (cartProduct) => {
  const { id, name, description, prize, img, quantity } = cartProduct;
  return ` 
  <div class="cart-card">
            <img src="${img}" alt="${name}">
            <div class="cart-info">
                <h3>${name}</h3>
                <p>${description}</p>
                <span class="color">$${prize}</span>
            </div>
            <div class="buttons">
                <span class="quantity-handler down" data-id=${id}><div class="menos"></div></span>
                <span class="item-quantity">${quantity}</span>
                <span class="quantity-handler up" data-id=${id}>+</span>
            </div>
        </div>`
};

const renderCart = () => {
  if (!cart.length) {
    productsCart.innerHTML = `<p class="empty-msg"> No hay productos en el carrito. </p>`;
    return;
  }
  productsCart.innerHTML = cart.map(renderCartProduct).join("");
};

const getCartTotal = () => {
  return cart.reduce(
    (acc, cur) => acc + Number(cur.prize) * Number(cur.quantity), 0
  );
};
 
const showTotal = () => {
  total.innerHTML = `$${getCartTotal().toFixed(2)}`;
  subTotal.innerHTML = `$${getCartTotal().toFixed(2)}`;
};

const disableBtn = (btn) => {
  if (!cart.length) {
    btn.classList.add("disabled");
    return;
  }
  btn.classList.remove("disabled");
};

//añadir productos
const addUnitToProduct = (product) => {
  cart = cart.map((cartProduct)=> {
    return cartProduct.id === product.id 
    ? {...cartProduct, quantity: cartProduct.quantity + 1}
    : cartProduct;
  });
 
};

const createCartProduct = (product) => {
  cart = [...cart, { ...product, quantity: 1 }];
};

const isExistingCartProduct = (product) => {
  return cart.find((item) => item.id === product.id);
};

const createProductData = (id, name, description, prize, img) => {
  return { id, name, description, prize, img };
};

const checkCartState = () => {
  saveLocalStorage(cart);
  renderCart(cart);
  showTotal(cart);
  disableBtn(buyBtn);
  disableBtn(deleteBtn);
};

const showSuccessModal = (msg) => {
  showSuccesModal.classList.add("active-modal");
  showSuccesModal.textContent = msg;
  setTimeout(() => {
    showSuccesModal.classList.remove("active-modal");
  }, 1500);
};

const addProduct = (e) => {
  if (!e.target.classList.contains("btn-add")) return;

  const { id, name, description, prize, img } = e.target.dataset;
  const product = createProductData(id, name, description, prize, img);
  
if (isExistingCartProduct(product)) {
  addUnitToProduct(product);
  showSuccessModal("Se agregó una unidad del producto al carrito");
} else {
  createCartProduct(product);
  showSuccessModal("El producto se ha agregado al carrito");
}
checkCartState();
};

const substractProductUnit = (existingProduct) => {
  cart = cart.map((cartProduct) => {
    return cartProduct.id === existingProduct.id
      ? { ...cartProduct, quantity: cartProduct.quantity - 1 }
      : cartProduct;
  });
};

const removeProductFromCart = (existingProduct) => {
  cart = cart.filter((product) => product.id !== existingProduct.id);
  checkCartState();
};

const handleMinusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);

  if (existingCartProduct.quantity === 1) {
    if (window.confirm('¿Desea Eliminar el producto del carrito?')) {
      removeProductFromCart(existingCartProduct);
    }
    return;
  }
  substractProductUnit(existingCartProduct);
};

const handlePlusBtnEvent = (id) => {
  const existingCartProduct = cart.find((item) => item.id === id);
  addUnitToProduct(existingCartProduct);
};

const handleQuantity = (e) => {
  if (e.target.classList.contains('down')) {
    handleMinusBtnEvent(e.target.dataset.id);
  } else if (e.target.classList.contains('up')) {
    handlePlusBtnEvent(e.target.dataset.id);
  }
  checkCartState();
};

const resetCartItems = () => {
  cart = [];
  checkCartState();
};

const completeCartAction = (confirmMsg, successMsg) => {
  if (!cart.length) return;
  if (window.confirm(confirmMsg)) {
    resetCartItems();
    alert(successMsg);
  }
};
//
//
const completeBuy = () => {
  completeCartAction(
    '¿Desea completar su compra?',
    'La compra se ha realizado correctamente'
  );
};

const deleteCart = () => {
  completeCartAction(
    '¿Está seguro de que desea vaciar el carrito?',
    'No hay productos en el carrito'
  );
};

const init = () => {
    renderCardsRecom();
    renderCards();
    categories.addEventListener('click', applyFilter);
    barsMenu.addEventListener('click', toggleMenu);
    cartBtn.addEventListener('click', toggleCart);
    navMenu.addEventListener('click', closeOnClick);
    overlay.addEventListener('click', closeOnOverlayClick);
    window.addEventListener('scroll', closeOnScroll);
    closeBtn.addEventListener('click', closeOnClickButton);
    document.addEventListener('DOMContentLoaded', renderCart);
    document.addEventListener('DOMContentLoaded', showTotal);
    renderArticulos.addEventListener('click', addProduct);
    renderRecom.addEventListener('click', addProduct);
    productsCart.addEventListener('click', handleQuantity);
    buyBtn.addEventListener('click', completeBuy);
    deleteBtn.addEventListener('click', deleteCart);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
};

init();