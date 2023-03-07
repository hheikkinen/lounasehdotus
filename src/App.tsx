import "./App.css";
import MainView from "./views/MainView";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline>
          <MainView />
        </CssBaseline>
      </ThemeProvider>
    </div>
  );
}

export default App;
