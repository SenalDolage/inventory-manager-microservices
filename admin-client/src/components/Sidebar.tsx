import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div
      className="bg-light border-right"
      style={{ width: "250px", height: "100vh" }}
    >
      <h5 className="p-3">Menu</h5>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/products">
            All Products
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/add-product">
            Add New Product
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
