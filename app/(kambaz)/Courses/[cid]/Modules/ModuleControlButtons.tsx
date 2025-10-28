import { IoEllipsisVertical } from "react-icons/io5";
import { FaPencil } from "react-icons/fa6";
import { BsPlus } from "react-icons/bs";
import GreenCheckmark from "./GreenCheckmark";
import { FaTrash } from "react-icons/fa";

export default function ModuleControlButtons(
  { moduleId, deleteModule, editModule }: { moduleId: string; deleteModule: (moduleId: string) => void; editModule: (moduleId: string) => void; } ) {
    return (
    <div className="float-end">
      <FaPencil className="text-warning me-2 mb-1" onClick={() => editModule(moduleId)}/>
       <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)}/>
      <GreenCheckmark />
      <BsPlus className="fs-3 me-2" />
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
