import { useState } from "react";

import { ClickAwayListener } from "@mui/material";
import AutoComplete from "./AutoComplete";


export default function Search({handleChange,handleSearchRequest,searchQuery,searchSuggestions}){
     const [showSuggestions, setShowSuggestions] = useState(false);
      const handleClickAway = () => {
        setShowSuggestions(false);
      };

    return (
      <div className="flex flex-grow justify-center">
        <form onSubmit={handleSearchRequest} className="flex">
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="bg-black items-center border-2 border-solid border-[#222222] border-r-0 rounded-tl-[40px] rounded-bl-[40px] caret-[white] ">
              <input
                type="text"
                className="border-none relative w-[30rem] py-[7px] outline-none leading-6 bg-transparent text-white"
                value={searchQuery}
                onChange={handleChange}
                onFocus={setShowSuggestions}
                onBlur={setShowSuggestions}
              />
            </div>
          </ClickAwayListener>
          <button className="border border-[#222222] rounded-r-full cursor-pointer py-[6.5px] w-[5.5rem]  m-0 text-white  bg-[#222222] max-sm:w-[3rem]">
            Search
          </button>
        </form>
        {showSuggestions && (
          <div className="flex justify-center items-center">
            <div className=" absolute  right-[34.5em]   w-[30rem] top-[3.5rem] ">
              {searchSuggestions.map((suggestion) => (
                <AutoComplete key={suggestion} suggestion={suggestion} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
}