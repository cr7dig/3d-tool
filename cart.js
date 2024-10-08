// cart.js
window.onload = function() {
    fetch('http://localhost:5000/api/tshirts')
        .then(response => {if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();})
        .then(data => {
            const cartItemsContainer = document.getElementById('cartItems');
            cartItemsContainer.innerHTML = ''; // Clear previous items

            // Loop through data and display each t-shirt in the cart
            data.forEach(tshirt => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <h2>T-shirt</h2>
                    <p><strong>Front Text:</strong> ${tshirt.front.text || 'None'}</p>
                    <p><strong>Front Color:</strong> ${tshirt.front.color || 'None'}</p>
                    <img src="${tshirt.front.imageSrc || '#'}" alt="Front Image" style="width: 100px;">
                    <p><strong>Back Text:</strong> ${tshirt.back.text || 'None'}</p>
                    <p><strong>Back Color:</strong> ${tshirt.back.color || 'None'}</p>
                    <img src="${tshirt.back.imageSrc || '#'}" alt="Back Image" style="width: 100px;">
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
        })
        .catch(error => console.error('Error fetching t-shirts:', error));
};
