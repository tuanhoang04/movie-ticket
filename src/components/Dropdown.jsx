import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";

export default function MenuDefault({ label, options, onClick }) {
  return (
    <Menu className="text-white text-lg w-60 border-none after:border-none before:border-none">
      <MenuHandler>
        <Button className="text-md bg-transparent">{label}</Button>
      </MenuHandler>
      <MenuList className="bg-[#313035] text-white border-0 overflow-y-scroll max-h-60 scrollbar">
        {options.map((option, index) => (
          <MenuItem
            key={index}
            name={option.region_name}
            value={option.region_id}
            onClick={onClick}
            className="text-white text-lg"
          >
            {option.region_name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
