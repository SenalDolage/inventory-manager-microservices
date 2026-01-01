import Header from "./Header";
import Sidebar from "./Sidebar";

const AddProduct = () => {
  return (
    <>
      <Header />
      <main className="main d-flex">
        <Sidebar />

        <div className="flex-grow-1 p-3 text-start">
          <h4 className="mb-4">Add Product</h4>
          <form>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input type="text" className="form-control" id="title" required />
            </div>
            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">
                Image URL
              </label>
              <input type="text" className="form-control" id="imageUrl" required/>
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
