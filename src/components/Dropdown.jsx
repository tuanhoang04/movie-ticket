import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export default function MenuDefault({ label, options }) {
  return (
    <Menu className="text-white text-xl w-60 border-none after:border-none before:border-none">
      <MenuHandler>
        <Button>{label}</Button>
      </MenuHandler>
      <MenuList className="bg-[#313035] text-white border-0">
        {options.map((option, index) => (
          <MenuItem key={index} onClick={option.onClick} className="text-white">
            {option}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
