import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import { Product } from "./interfaces/Product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:8002/api/products");
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  async function handleLike(productId: string): Promise<void> {
    try {
      await fetch(`http://localhost:8002/api/products/${productId}/like`, {
        method: "POST",
      });
      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? { ...product, likes: product.likes + 1 }
            : product
        )
      );
      window.alert("Product liked!");
    } catch (error) {
      console.error(error);
      window.alert("Failed to like product.");
    }
  }

  return (
    <div className="App">
      <Header />

      <main className="main container">
        <div className="flex-grow-1 p-3">
          <div className="row">
            {products.map((product) => (
              <div className="col-md-4" key={product.admin_id}>
                <div className="card mb-4">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt="Product"
                  />
                  <div className="card-body">
                    <h5 className="card-title mb-3">{product.title}</h5>
                    <div className="d-flex align-items-center justify-content-between">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleLike(product._id)}
                      >
                        Like
                      </button>
                      <span className="badge bg-secondary">
                        {product.likes} Likes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
