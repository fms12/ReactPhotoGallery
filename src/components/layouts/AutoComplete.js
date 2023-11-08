import React from "react";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
function AutoComplete({ suggestion }) {
  return (
    <div className="bg-[#373737] leading-8 w-[100%] ">
      <ul className="hover:bg-[#222222] p-2 flex cursor-default ">
        <li className=" text-white text-lg font-semi flex justify-center items-center px-3">
          <HistoryRoundedIcon className=" text-white mr-4" />
          <span>{suggestion}</span>
        </li>
      </ul>
    </div>
  );
}

export default AutoComplete;
