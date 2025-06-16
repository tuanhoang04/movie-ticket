import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { useState } from "react";

export default function Dropdown({ label, options, handleChangeOption }) {
  const [openMenu, setOpenMenu] = useState(false);
  const handleChooseItem = (option) => {
    handleChangeOption(option);
  };
  return (
    <Menu open={openMenu} handler={setOpenMenu} className="text-white">
      <MenuHandler>
        <Button
          variant="outlined"
          className="w-full text-white normal-case text-xl font-thin border-0 border-white flex flex-row items-center gap-1 focus:ring-0"
        >
          {label}
          <ChevronDownIcon
            strokeWidth={1.9}
            className={`h-5 w-5 ml-2 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="bg-[#313035] text-white w-56 text-lg border-0 overflow-auto overflow-x-hidden scrollbar max-h-[250px]">
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleChooseItem(option)}
            className="text-white text-lg"
          >
            {typeof option == "object" ? option.region_name : option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
