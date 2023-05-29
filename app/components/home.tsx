"use client";

require("../polyfill");

// import { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";

import styles from "./home.module.scss";

import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";
import { Analytics } from "@vercel/analytics/react";
import mixpanel from "mixpanel-browser";

mixpanel.init("6c4c1c926708fd247571a67ed0a25d6f", { debug: true });
export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo />,
});

// const Login = dynamic(async () => (await import("./login")).Login, {
//   loading: () => <Loading noLogo />,
// });
const Login = dynamic(
  async () => (await import("./loginandregisiter")).default,
  {
    loading: () => <Loading noLogo />,
  },
);
const Pricing = dynamic(
  async () => (await import("./menbershipsplan")).default,
  {
    loading: () => <Loading noLogo />,
  },
);

const UserCenter = dynamic(async () => (await import("./usercenter")).default, {
  loading: () => <Loading noLogo />,
});
const SignUp = dynamic(async () => (await import("./signup")).default, {
  loading: () => <Loading noLogo />,
});
// const HomePage = dynamic(async () => (await import("./promptcard")).default, {
//   loading: () => <Loading noLogo />,
// });

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"]:not([media])',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--themeColor");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function Screen() {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isMobileScreen = useMobileScreen();

  const [key, setKey] = useState(0);

  useEffect(() => {
    const referrer = document.referrer;
    console.log("referrer", referrer);
    mixpanel.track("Page view", {
      referrer: referrer,
    });
  }, []);

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [location.pathname]);

  return (
    <div
      className={
        styles.container +
        ` ${
          config.tightBorder && !isMobileScreen
            ? styles["tight-container"]
            : styles.container
        }`
      }
    >
      <SideBar key={key} className={isHome ? styles["sidebar-show"] : ""} />

      <div className={styles["window-content"]} id={SlotID.AppBody}>
        <Routes>
          <Route path={Path.Home} element={<Chat />} />
          <Route path={Path.NewChat} element={<NewChat />} />
          <Route path={Path.Masks} element={<MaskPage />} />
          <Route path={Path.Chat} element={<Chat />} />
          <Route path={Path.Settings} element={<Settings />} />
          <Route path={Path.Login} element={<Login />} />
          <Route path={Path.UserCenter} element={<UserCenter />} />
          <Route path={Path.SiunUp} element={<SignUp />} />
          <Route path={Path.Pricing} element={<Pricing />} />
          {/* <Route path={Path.HomePage} element={<HomePage />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export function Home() {
  useSwitchTheme();

  if (!useHasHydrated()) {
    return <Loading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen />
        <Analytics />
      </Router>
    </ErrorBoundary>
  );
}
