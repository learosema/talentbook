import { HTMLAttributes, ReactNode, useEffect } from "react";
import { useIdentity, useTheme } from "../../store/app.context";
import { Header } from "../header/header";
import { Toaster } from "../toaster/toaster";
import { SearchBox } from "../search-box/search-box";
import { useNavigate } from "react-router";

export type LayoutProps = HTMLAttributes<HTMLDivElement> & { children ?: ReactNode };

export function Layout({children, ...attribs}: LayoutProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const identity = useIdentity();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [theme]);

  const onSearch = ({query}: {query: string}) => {
    navigate('/search?s=' + encodeURIComponent(query));
  }

  return (
    <>
      <Header />
      {identity ? (<SearchBox onSubmit={onSearch} />) : <></>}
      <main className="wrapper flow" {...attribs}>
        {children}
      </main>
      <footer>
        <p>made with <span aria-hidden="true">💖</span><span className="visually-hidden">love</span> by Lea Rosema</p>
      </footer>
      <Toaster />
    </>
  );
}
