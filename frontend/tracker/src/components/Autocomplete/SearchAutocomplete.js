import React, { useCallback, useEffect, useState } from "react";
import "./Autocomplete.css";
import Autocomplete from "@mui/material/Autocomplete";
import { useStateValue } from "../../store/StateProvider";
import { Search } from "../../http/document";
import { Button, TextField } from "@mui/material";

function SearchAutocomplete() {
  const [store, dispatch] = useStateValue();
  const [search, setSearch] = useState([{ id: 12, subject: "test" }]);
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(term);

  const _Search = useCallback(async (term) => {
    const res = await Search(store.token, term);
    const data = res.data;
    setSearch(data.data);
    console.log(data);
  });

  const clearResults = useCallback(() => setSearch([]));

  useEffect(() => {
    const timer = setTimeout(() => setTerm(debouncedTerm), 1000);
    return () => clearTimeout(timer);
  }, [debouncedTerm]);

  useEffect(() => {
    if (term !== "") {
      _Search(term);
    } else {
      clearResults();
    }
  }, [term]);

  return (
    <>
      <div className="search">
        <input
          type="text"
          placeholder="Search documents"
          onChange={(e) => setDebouncedTerm(e.target.value)}
          value={debouncedTerm}
        />
        <div className="search__results">
          {search.map((item) => {
            return (
              <div className="search__item">
                <p className="item__title">Name</p>
                <div className="item__action">
                  <Button
                    size="small"
                    sx={{ color: "#9d4d01", fontWeight: 600 }}
                  >
                    Request
                  </Button>
                  <Button
                    size="small"
                    sx={{ color: "#9d4d01", fontWeight: 600 }}
                  >
                    View
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SearchAutocomplete;
