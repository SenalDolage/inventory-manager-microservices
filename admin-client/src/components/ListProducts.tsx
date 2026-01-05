import { Table } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { Product } from "../interfaces/Product";

const ListProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products from API
    const getProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");
        const data = await response.json();
        setProducts(data);
        console.log("Fetched products:", data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    getProducts();
  }, []);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Remove the deleted product from the state
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (id: number): void => {
    throw new Error("Function not implemented.");
  };
  

  return (
    <>
      <Header />
      <main className=" main d-flex">
        <Sidebar />

        {products.length > 0 ? (
          <div className="flex-grow-1 p-3">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Likes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>
                      <img
                        src={product.image}
                        alt={product.title}
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </td>
                    <td>{product.likes}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </button>
                      &nbsp;
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEdit(product.id)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div className="flex-grow-1 p-3">
            <p>No products found.</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ListProducts;
