import "./App.css";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <Header />

      <main className="main container">
        <div className="flex-grow-1 p-3">
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4">
                <img
                  src="https://picsum.photos/300/200"
                  className="card-img-top"
                  alt="Product"
                />
                <div className="card-body">
                  <h5 className="card-title">Product 1</h5>
                  <div className="d-flex align-items-center justify-content-between">
                    <button className="btn btn-primary">Like</button>
                    <span className="badge bg-secondary">0 Likes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
