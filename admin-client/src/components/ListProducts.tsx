import { Table } from "react-bootstrap";
import Header from "./Header";
import Sidebar from "./Sidebar";

const ListProducts = () => {
  return (
    <>
      <Header />
      <main className=" main d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-3">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John</td>
                <td>Doe</td>
                <td>@johndoe</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane</td>
                <td>Smith</td>
                <td>@janesmith</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </main>
    </>
  );
};

export default ListProducts;
