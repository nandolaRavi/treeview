import { useState } from "react";
import Tree from "./Tree";
import { useDispatch, useSelector } from "react-redux";
import { setPath, setType } from "../redux/reducers/treeViewSlice"
import { FaFolderOpen, FaFile } from "react-icons/fa";

const TreeNode = ({ node }) => {
    const { children, label, path, type } = node;
    const curPath = useSelector((state) => state.treeView.curPath);

    const [showChildren, setShowChildren] = useState(false);
    const icons = [<FaFolderOpen />, <FaFile />];
    const dispatch = useDispatch();

    const handleClick = () => {
        setShowChildren(!showChildren);
        // dispatch(setLable({ setLbale: label }));
         dispatch(setType({ type: type }));
        dispatch(setPath({ path: path }));
    };


    return (
        <>
            <div onClick={handleClick} style={{ marginBottom: "10px" }}>
                <div className="d-flex d-flex align-items-center m-2">
                    <div className="fs-2 text-warning">
                        {icons[type]}
                    </div>
                    <div className="p-2 mt-2">
                        <h5 style={{ color: curPath === path ? 'red' : '' }}>{label}</h5>
                    </div>
                </div>
            </div>
            <ul style={{ paddingLeft: "10px", borderLeft: "1px solid black" }}>
                {showChildren && <Tree treeData={children} />}  
            </ul>
        </>
    )
}
export default TreeNode