import { Component } from "react";
import { Route, HashRouter } from "react-router-dom";  //BrowserRouter
import Herder from "./views/common/header";
import Home from "./views/home";
import Sell from "./views/sell";
import Profile from "./views/profile";
import Detail from "./views/detail";
import Renderer from "./views/renderer";
import Login from "./views/admin/login";
import Dashbard from "./views/admin/dashbard";
import AdminResource from "./views/admin/resource";
import AdminPrespectives from "./views/admin/prespectives";
import Resource from "./views/resource";
import Prespectives from "./views/prespectives";
import Abount from "./views/abount";
import Service from "./views/service";
import { Stack } from "@mui/material";
import store from "./store";
import { Provider } from'react-redux';
import Footer from "./views/common/footer";
import { ThemeProvider } from "@mui/system";
import theme from "./assets/styles/theme";
import { UIProvider } from "./context/ui";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
           {/* <HashRouter basename="/docStore"> */}
           <HashRouter>
           <ThemeProvider theme={theme}>
              <Stack>
              <UIProvider>
                <Herder />
                <Route path='/' exact component={Home}></Route>
                <Route path='/sell' exact component={Sell}></Route>
                <Route path='/profile' exact component={Profile}></Route>
                <Route path='/renderer/:tokenId' exact component={Renderer}></Route>
                <Route path='/buy/:tokenId' exact component={Detail}></Route>
                <Route path='/admin' exact component={Dashbard}></Route>
                <Route path='/admin/login' exact component={Login}></Route>
                <Route path='/admin/resource' exact component={AdminResource}></Route>
                <Route path='/admin/prespectives' exact component={AdminPrespectives}></Route>
                <Route path='/admin/login' exact component={Login}></Route>
                <Route path='/abount' exact component={Abount}></Route>
                <Route path='/prespectives' exact component={Prespectives}></Route>
                <Route path='/resource' exact component={Resource}></Route>
                <Route path='/service' exact component={Service}></Route>
                <Footer />
                </UIProvider>
              </Stack>
            </ThemeProvider>
           </HashRouter>
      </Provider>
    )
  }
}
export default App;
