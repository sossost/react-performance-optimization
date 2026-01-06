import { Header } from "./Header";
import { SearchInput } from "./SearchInput";

interface LayoutProps {
  mode: "before" | "after";
  theme?: string;
  setTheme?: (theme: string) => void;
  query?: string;
  setQuery?: (query: string) => void;
}

// Before: Props Drilling - theme와 query를 사용하지 않지만 전달해야 함
export function Layout({ mode, theme, setTheme, query, setQuery }: LayoutProps) {
  return (
    <div>
      <Header mode={mode} theme={theme} setTheme={setTheme} />
      <SearchInput mode={mode} query={query} setQuery={setQuery} />
    </div>
  );
}

