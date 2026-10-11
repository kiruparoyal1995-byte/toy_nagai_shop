// ======================================
// NAGAI DRY FISH SHOP - PRODUCT DATA
// ======================================

const products = [
    {
        id: 1,
        tamil: "பால் சுறா",
        english: "MILK SHARK",
        price: 800,
        image: "fish images/Premium Nagai Dry Fish Pouch.png"
    },
    {
        id: 2,
        tamil: "நெத்திலி",
        english: "NETHILI",
        price: 400,
        image: "fish images/Premium Nethili Dry Fish Pouch.png"
    },
    {
        id: 3,
        tamil: "திருக்கை",
        english: "THIRUKKAI",
        price: 500,
        image: "fish images/Premium Thirukkai Dry Fish Pouch.png"
    },
    {
        id: 4,
        tamil: "கூனி இறால்",
        english: "KOONI IRAAL",
        price: 500,
        image: "fish images/kooniraal Packaging Mockup.png"
    },
    {
        id: 5,
        tamil: "முள்ளு வாளை",
        english: "MULLU VAALAI",
        price: 500,
        image: "fish images/Premium Mullu Vaalai Dry Fish Pouch.png"
    },
    {
        id: 6,
        tamil: "வாளை",
        english: "VAALAI",
        price: 500,
        image: "fish images/Glossy Vaalai Dry Fish Pouch.png"
    },
    {
        id: 7,
        tamil: "பெரிய நெத்திலி",
        english: "BIG NETHILI",
        price: 600,
        image: "fish images/Premium Big Nethili Dry Fish Pouch.png"
    },
    {
        id: 8,
        tamil: "பட்டறை வஞ்சிரம்",
        english: "PATTARAI VANCHIRAM",
        price: 900,
        image: "fish images/Pattarai Vanchiram Dry Fish Pouch.png"
    },
    {
        id: 9,
        tamil: "பட்டறை வஞ்சிரம்",
        english: "PATTARAI VANCHIRAM BIG",
        price: 1100,
        image: "fish images/Premium Tamil PATTARAI VANCHIRAM BIG.png"
    },
    {
        id: 10,
        tamil: "பட்டறை பாறை",
        english: "PATTARAI PAARAI",
        price: 700,
        image: "fish images/Premium Nagai பட்டறை பாறை.png"
    },
    {
        id: 11,
        tamil: "பண்ணா",
        english: "PANNA",
        price: 400,
        image: "fish images/Premium Panna Dry Fish Pouch.png"
    }
];

// ======================================
// CART DATA
// ======================================

const STORAGE_KEY = "nagaiDryFishCart";
let cart = loadCart();

function loadCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
}

function saveCart() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(cart)
    );
}

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

// ======================================
// DISPLAY PRODUCTS
// ======================================

function displayProducts(productList = products) {
    const grid = document.getElementById("productGrid");
    const noResults = document.getElementById("noResults");

    if (!grid) return;

    grid.replaceChildren();

    productList.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        // Product image container
        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.english + " dry fish";
        image.loading = "lazy";

        const fallback = document.createElement("div");
        fallback.className = "image-placeholder";
        fallback.textContent = "🐟";

        image.onerror = function () {
            image.classList.add("image-failed");
            fallback.classList.add("visible");
        };

        imageBox.append(image, fallback);

        // Product information
        const info = document.createElement("div");
        info.className = "product-info";

        const tamilName = document.createElement("h3");
        tamilName.textContent = product.tamil;

        const englishName = document.createElement("p");
        englishName.className = "english-name";
        englishName.textContent = product.english;

        // Price
        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = formatPrice(product.price);

        const weight = document.createElement("small");
        weight.textContent = "1 KG";
        price.appendChild(weight);

        // Add to Cart button
        const button = document.createElement("button");
        button.type = "button";
        button.className = "add-button";
        button.textContent = "🛒 + Cart";

        button.addEventListener("click", function () {
            addToCart(product.id);
        });

        bottom.append(price, button);
        info.append(tamilName, englishName, bottom);
        card.append(imageBox, info);

        grid.appendChild(card);
    });

    if (noResults) {
        noResults.hidden = productList.length > 0;
    }
}

// ======================================
// SEARCH PRODUCTS
// ======================================

function searchProducts() {
    const input = document.getElementById("searchInput");
    const keyword = input.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        return (
            product.tamil.toLowerCase().includes(keyword) ||
            product.english.toLowerCase().includes(keyword)
        );
    });

    displayProducts(filteredProducts);
}

// ======================================
// ADD TO CART
// ======================================

function addToCart(productId) {
    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    openCart();
}

// ======================================
// RENDER CART
// ======================================

function renderCart() {
    const container = document.getElementById("cartItems");
    const countElement = document.getElementById("cartCount");
    const totalElement = document.getElementById("cartTotal");

    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    countElement.textContent = count;
    totalElement.textContent = formatPrice(total);

    container.replaceChildren();

    if (cart.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-cart";

        empty.innerHTML = `
            <span>🛒</span>
            <strong>கார்ட் காலியாக உள்ளது</strong>
            <div>பொருட்களை கார்ட்டில் சேர்க்கவும்.</div>
        `;

        container.appendChild(empty);
        return;
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const imageBox = document.createElement("div");
        imageBox.className = "cart-item-image";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.english;

        image.onerror = function () {
            imageBox.textContent = "🐟";
        };

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h3");
        name.textContent = item.tamil;

        const english = document.createElement("p");
        english.textContent = item.english + " · 1 KG";

        const price = document.createElement("strong");
        price.textContent = formatPrice(
            item.price * item.quantity
        );

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.textContent = "−";
        minus.setAttribute("aria-label", "Decrease quantity");
        minus.addEventListener("click", function () {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.textContent = "+";
        plus.setAttribute("aria-label", "Increase quantity");
        plus.addEventListener("click", function () {
            changeQuantity(item.id, 1);
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-button";
        remove.textContent = "நீக்கு";

        remove.addEventListener("click", function () {
            removeFromCart(item.id);
        });

        controls.append(minus, quantity, plus, remove);
        info.append(name, english, price, controls);
        row.append(imageBox, info);

        container.appendChild(row);
    });
}

// ======================================
// CHANGE QUANTITY
// ======================================

function changeQuantity(productId, amount) {
    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(
            product => product.id !== productId
        );
    }

    saveCart();
    renderCart();
}

// ======================================
// REMOVE CART ITEM
// ======================================

function removeFromCart(productId) {
    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    renderCart();
}

// ======================================
// OPEN AND CLOSE CART
// ======================================

function openCart() {
    document.getElementById("cartDrawer")
        .classList.add("active");

    document.getElementById("cartOverlay")
        .classList.add("active");

    document.getElementById("cartDrawer")
        .setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
}

function closeCart() {
    document.getElementById("cartDrawer")
        .classList.remove("active");

    document.getElementById("cartOverlay")
        .classList.remove("active");

    document.getElementById("cartDrawer")
        .setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

// ======================================
// ORDER SUMMARY
// ======================================

function checkout() {
    if (cart.length === 0) {
        alert("முதலில் பொருட்களை கார்ட்டில் சேர்க்கவும்.");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const lines = cart.map(item => {
        return (
            `${item.tamil} (${item.english}) × ${item.quantity} = ` +
            formatPrice(item.price * item.quantity)
        );
    });

    lines.push("");
    lines.push("மொத்தம்: " + formatPrice(total));

    document.getElementById("orderSummary").textContent =
        lines.join("\n");

    document.getElementById("copyMessage").textContent = "";
    document.getElementById("orderModal").hidden = false;
}

function closeOrderModal() {
    document.getElementById("orderModal").hidden = true;
}

async function copyOrderSummary() {
    const summary = document.getElementById("orderSummary").textContent;

    try {
        await navigator.clipboard.writeText(
            "நாகை கருவாடு கடை\n" + summary
        );

        document.getElementById("copyMessage").textContent =
            "ஆர்டர் விவரங்கள் நகலெடுக்கப்பட்டன.";
    } catch (error) {
        document.getElementById("copyMessage").textContent =
            "Copy செய்ய முடியவில்லை. விவரங்களைத் தேர்வு செய்து copy செய்யவும்.";
    }
}

// ======================================
// MOBILE MENU
// ======================================

function toggleMenu() {
    document.getElementById("navLinks")
        .classList.toggle("open");
}

// ======================================
// EVENT LISTENERS
// ======================================

document.getElementById("searchInput")
    .addEventListener("input", searchProducts);

document.getElementById("openCartButton")
    .addEventListener("click", openCart);

document.getElementById("closeCartButton")
    .addEventListener("click", closeCart);

document.getElementById("cartOverlay")
    .addEventListener("click", closeCart);

document.getElementById("checkoutButton")
    .addEventListener("click", checkout);

document.getElementById("closeModalButton")
    .addEventListener("click", closeOrderModal);

document.getElementById("copyOrderButton")
    .addEventListener("click", copyOrderSummary);

document.getElementById("menuToggle")
    .addEventListener("click", toggleMenu);

document.getElementById("currentYear").textContent =
    new Date().getFullYear();

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeCart();
        closeOrderModal();
    }
});

// ======================================
// INITIAL LOAD
// ======================================

displayProducts();
renderCart();