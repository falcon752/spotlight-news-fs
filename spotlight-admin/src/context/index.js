/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Spotlight Admin main context
const MaterialUI = createContext();

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Spotlight Admin reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      localStorage.setItem("miniSidenav", JSON.stringify(action.value));
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      localStorage.setItem("transparentSidenav", JSON.stringify(action.value));
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      localStorage.setItem("whiteSidenav", JSON.stringify(action.value));
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      localStorage.setItem("sidenavColor", action.value);
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      localStorage.setItem("transparentNavbar", JSON.stringify(action.value));
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      localStorage.setItem("fixedNavbar", JSON.stringify(action.value));
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      localStorage.setItem("openConfigurator", JSON.stringify(action.value));
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      localStorage.setItem("direction", action.value);
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      localStorage.setItem("layout", action.value);
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      localStorage.setItem("darkMode", JSON.stringify(action.value));
      return { ...state, darkMode: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Spotlight Admin context provider
function MaterialUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: JSON.parse(localStorage.getItem("miniSidenav")) ?? false,
    transparentSidenav: JSON.parse(localStorage.getItem("transparentSidenav")) ?? false,
    whiteSidenav: JSON.parse(localStorage.getItem("whiteSidenav")) ?? false,
    sidenavColor: localStorage.getItem("sidenavColor") ?? "info",
    transparentNavbar: JSON.parse(localStorage.getItem("transparentNavbar")) ?? true,
    fixedNavbar: JSON.parse(localStorage.getItem("fixedNavbar")) ?? true,
    openConfigurator: JSON.parse(localStorage.getItem("openConfigurator")) ?? false,
    direction: localStorage.getItem("direction") ?? "ltr",
    layout: localStorage.getItem("layout") ?? "dashboard",
    darkMode: JSON.parse(localStorage.getItem("darkMode")) ?? false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Spotlight Admin custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: "MINI_SIDENAV", value });
const setTransparentSidenav = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_SIDENAV", value });
const setWhiteSidenav = (dispatch, value) => dispatch({ type: "WHITE_SIDENAV", value });
const setSidenavColor = (dispatch, value) => dispatch({ type: "SIDENAV_COLOR", value });
const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: "FIXED_NAVBAR", value });
const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
const setDirection = (dispatch, value) => dispatch({ type: "DIRECTION", value });
const setLayout = (dispatch, value) => dispatch({ type: "LAYOUT", value });
const setDarkMode = (dispatch, value) => dispatch({ type: "DARKMODE", value });

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
};
