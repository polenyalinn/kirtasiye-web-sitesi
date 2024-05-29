let cart = [];

class Products {
    async getProducts() {
        try {
            let result = await fetch("https://6656038f3c1d3b60293bf243.mockapi.io/products");
            let data = await result.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}

class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(item => {
            result += `
            <div class="box">
                <div class="box-head">
                    <img src="${item.image}" alt="menu">
                    <span class="menu-category"></span>
                    <span class="product-title">${item.title}</span>
                    <div class="product-price">${item.price}₺</div>
                </div>
                <div class="box-bottom">
                    <input type="number" id="quantity-${item.id}" value="1" min="1">
                    <button class="btn-add-to-cart" data-id="${item.id}" data-price="${item.price}">Sepete Ekle</button>
                </div>
            </div>
            `;
        });
        document.querySelector(".box-container").innerHTML = result;
    }

    getBagButtons() {
        const buttons = [...document.querySelectorAll(".btn-add-to-cart")];
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                let id = event.target.dataset.id;
                let price = parseFloat(event.target.dataset.price);
                addToCart(id, price);
            });
        });
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
}

function addToCart(id, price) {
    const quantityInput = document.getElementById(`quantity-${id}`);
    const quantity = parseInt(quantityInput.value);
    
    const existingBook = cart.find(item => item.id === id);
    if (existingBook) {
        existingBook.quantity += quantity;
    } else {
        const book = {
            id: id,
            price: price,
            quantity: quantity
        };
        cart.push(book);
    }

    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Kitap ID: ${item.id} - Adet: ${item.quantity} - Fiyat: ${(item.price * item.quantity).toFixed(2)} TL`;
        cartItems.appendChild(li);

        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').textContent = totalPrice.toFixed(2);
}

function checkout() {
    alert(`Toplam Fiyat: ${document.getElementById('total-price').textContent} TL`);
    cart = [];
    updateCart();
    document.getElementById('cart').style.display = 'none';
}

function showCart() {
    document.getElementById('cart').style.display = 'block';
}

document.addEventListener("DOMContentLoaded", () => {
    // Varsayılan olarak anasayfayı göster
    const anasayfa = document.getElementById('anasayfa');
    if (anasayfa) {
        anasayfa.style.display = 'block';
    }

    const ui = new UI();
    const products = new Products();

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Basit doğrulama (gerçek bir uygulamada bu bilgileri sunucuda doğrulamalısınız)
    if (username === 'admin' && password === '12345') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    } else {
        alert('Kullanıcı adı veya şifre hatalı.');
    }
});

// Sepet görüntüleme fonksiyonu
function showCart() {
    document.getElementById('cart').style.display = 'block';
}

// Ödeme işlemi (şu an sadece bir uyarı mesajı)
function checkout() {
    alert('Ödeme işlemi gerçekleştirildi.');
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // JSON dosyasından kullanıcıları al
    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            // Kullanıcı adı ve şifre kontrolü
            const foundUser = users.find(user => user.username === username && user.password === password);
            if (foundUser) {
                // Giriş başarılı, ana içeriği göster
                document.getElementById('login-screen').style.display = 'none';
                document.getElementById('main-content').style.display = 'block';
            } else {
                alert('Kullanıcı adı veya şifre hatalı.');
            }
        })
        .catch(error => console.error('Hata:', error));
});
