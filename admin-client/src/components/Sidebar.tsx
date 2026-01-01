const Sidebar = () => {
  return (
    <div
      className="bg-light border-right"
      style={{ width: "250px", height: "100vh" }}
    >
      <h5 className="p-3">Menu</h5>

      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link active" href="/products">
            All Products
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/add-product">
            Add New Product
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
