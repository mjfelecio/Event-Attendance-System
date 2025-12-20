import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../shad-cn/input-group";
import { Search } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
};

const SearchBar = ({ query, onQueryChange, placeholder }: Props) => {
  return (
    <InputGroup>
      <InputGroupInput
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder || "Search..."}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchBar;
