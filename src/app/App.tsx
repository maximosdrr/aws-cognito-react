import { ChakraBaseProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import "./index.css";
import { appTheme } from "./theme";

function App() {
  return (
    <ChakraBaseProvider theme={appTheme}>
      <div className="App">
        <Outlet />
      </div>
    </ChakraBaseProvider>
  );
}

export default App;
