import React from "react";
import Layout from "./Containers/Layout";
import RootRoutes from "./Routes/RootRoutes";

/**
 * Defines the root application component.
 * @returns {JSX.Element}
 */
function App() {
  return (
    <div>
      <Layout>
        <RootRoutes />
      </Layout>
    </div>
  );
}

export default App;
