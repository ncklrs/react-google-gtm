// examples/ecommerce/ProductPage.tsx
import React, { useState } from 'react';
import { useGTM, useGTMPageView, createGTMClient } from 'react-google-gtm';
import type { EcommerceEvents } from 'react-google-gtm';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Define your app's event schema
interface AppEvents extends EcommerceEvents {
  product_view: {
    product_id: string;
    product_name: string;
    category: string;
  };
}

export function ProductPage({ product }: { product: Product }) {
  const context = useGTM();
  const gtm = createGTMClient<AppEvents>(context);
  const [quantity, setQuantity] = useState(1);

  // Track product view
  useGTMPageView(`/product/${product.id}`, {
    product_id: product.id,
    product_name: product.name,
    category: product.category,
  });

  // Track view_item event (GA4)
  React.useEffect(() => {
    gtm.sendEvent('view_item', {
      currency: 'USD',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1,
      }],
    });
  }, [product.id]);

  const handleAddToCart = () => {
    // Type-safe event sending
    gtm.sendEvent('add_to_cart', {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity,
      }],
    });

    alert('Added to cart!');
  };

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <p>Category: {product.category}</p>
      <p className="price">${product.price}</p>

      <div className="quantity-selector">
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
        />
      </div>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

// Example checkout flow
export function CheckoutPage({ cart }: { cart: Product[] }) {
  const context = useGTM();
  const gtm = createGTMClient<AppEvents>(context);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleBeginCheckout = () => {
    gtm.sendEvent('begin_checkout', {
      currency: 'USD',
      value: total,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: 1,
      })),
    });
  };

  const handlePurchase = (transactionId: string) => {
    gtm.sendEvent('purchase', {
      transaction_id: transactionId,
      value: total,
      currency: 'USD',
      tax: total * 0.1,
      shipping: 5.99,
      items: cart.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: 1,
      })),
    });
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      <button onClick={handleBeginCheckout}>Proceed to Checkout</button>
    </div>
  );
}
