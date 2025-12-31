const Sidebar = () => {
  return (
    <div
      className="bg-light border-right"
      style={{ width: "250px", height: "100vh" }}
    >
      <h5 className="p-3">Sidebar</h5>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className="nav-link active" href="#423">
            Active
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#423">
            Link
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#2342">
            Another link
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
