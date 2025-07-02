import { DropdownMenu, DropdownMenuContent } from "../ui/dropdown-menu";

export default function SidebarContext() {
  // const [dropDownOpen, setDropDownOpen] = useState(false);
  // const [hasOpenDialog, setHasDialogOpen] = useState(false);
  // const dropDownTriggerRef = useRef(null);
  // const focusRef = useRef(null);
  // function handleDialogItemSelect() {
  //   focusRef.current = dropDownTriggerRef.current;
  // }
  // function handleDialogItemOpenChange(open) {
  //   setHasDialogOpen(open);
  //   if(open === false) {
  //     setDropDownOpen(false);
  //   }
  // }

  return (
    <DropdownMenu>
      <DropdownMenuContent></DropdownMenuContent>
    </DropdownMenu>
  );
}
