import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import i18n from "../i18n";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nextProvider>
    </Provider>
  );
}
