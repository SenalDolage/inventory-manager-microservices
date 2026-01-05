import { FormEvent } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AddProduct = () => {
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, image }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const newProduct = await response.json();
      console.log("Product added successfully:", newProduct);
      window.alert("Product added successfully!");
      form.reset();
      window.location.href = "/products";
    } catch (error) {
      console.error("Error adding product:", error);
      window.alert("Failed to add product. Please try again.");
    }
  }

  return (
    <>
      <Header />
      <main className="main d-flex">
        <Sidebar />

        <div className="flex-grow-1 p-3 text-start">
          <h4 className="mb-4">Add Product</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image URL
              </label>
              <input
                type="text"
                className="form-control"
                id="image"
                name="image"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default AddProduct;
