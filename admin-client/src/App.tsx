import "./App.css";
import ListProducts from "./components/ListProducts";
import { Route, Routes } from "react-router-dom";
import AddProduct from "./components/AddProduct";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/products" element={<ListProducts />} />
          <Route path="/add-product" element={<AddProduct />} />

          <Route path="*" element={<ListProducts />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
