import React, { useEffect, useRef, useState } from "react";
import { ValidatedInput } from "../ValidatedInput/ValidatedInput";

export interface Suggestion {
  id: string;
  name: string;
}

interface SearchProps {
  fetchSuggestions: (query: string) => Promise<Suggestion[]>;
  callback?: (itemId: string) => void;
  searchName?: string;
  reset: boolean;
}

export const SearchWithSuggestions = ({
  fetchSuggestions,
  callback,
  searchName,
  reset,
}: SearchProps) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [suggestionsToShow, setSuggestionsToShow] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionListRef = useRef<HTMLUListElement>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const resetSearch = () => {
    setQuery("");
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
  };
  useEffect(() => {
    resetSearch();
  }, [reset]);
  useEffect(() => {
    const visibleCount = 3;
    const start = Math.max(0, selectedIndex - Math.floor(visibleCount / 2));
    const end = Math.min(suggestions.length, start + visibleCount);

    setSuggestionsToShow(suggestions.slice(start, end));
  }, [selectedIndex, suggestions]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : prevIndex,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[selectedIndex]);
      }
    }
  };

  const handleInputChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setQuery(value);

    if (value.trim()) {
      const fetchedSuggestions = await fetchSuggestions(value.trim());
      setSuggestions(fetchedSuggestions);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    if (callback) {
      callback(suggestion.id);
    }
  };

  return (
    <div className="relative">
      <ValidatedInput
        inputProps={{
          type: "text",
          id: "search",
          name: "search",
          value: query,
          onChange: handleInputChange,
          onKeyDown: handleKeyDown,
          onFocus: () => setShowSuggestions(query.trim() !== ""),
          onBlur: () => setTimeout(() => setShowSuggestions(false), 200),
          placeholder: "Start typing to search",
        }}
        label={searchName ?? "Search"}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={suggestionListRef}
          className="absolute left-0 right-0 bg-white border rounded shadow"
        >
          {suggestionsToShow.map((suggestion) => {
            const globalIndex = suggestions.indexOf(suggestion);
            const isActive = globalIndex === selectedIndex;

            return (
              <li
                key={suggestion.id}
                className={`p-2 cursor-pointer hover:bg-gray-200 ${
                  isActive ? "bg-gray-300" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
