import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setPath, setType, getDataByCurrPath, setView, restoreDir, findDirByPath } from "../redux/reducers/treeViewSlice"
import { FaFolderOpen, FaFile } from "react-icons/fa";
import { FaTrashRestore } from "react-icons/fa";
import TrashData from "./trashTree";
const TrashTreeNode = ({ node, data }) => {
    const items = useSelector(state => state.treeView.files) || [];
    const { children, label, path, type, isDelete, parentpath } = node;
    const curPath = useSelector((state) => state.treeView.curPath);
    let istrash = label == "Home" ? false : true
    const icons = [<FaFolderOpen />, <FaFile />];

    const dispatch = useDispatch();
    const handleClick = () => {
        dispatch(setType({ type: type }));
        dispatch(setPath({ path: path }));
    };


    const viewSelecteFile = (path) => {
        dispatch(setView(true))
        dispatch(getDataByCurrPath({ path: path, }))
    }

    // const restoreItem = (curPath) => {
    //     dispatch(setView(false))
    //     dispatch(restoreDir({ path: curPath }));
    // }
    const reStoreItem = (path) => {
        dispatch(restoreDir({ path: path }));
    };

    return (
        <>
            <div onClick={handleClick} style={{ marginBottom: "10px" }}>
                <div className="d-flex d-flex align-items-center m-2">
                    {
                        isDelete == istrash && <div className="fs-2 text-warning">
                            {icons[type]}
                        </div>
                    }
                    <div className="p-2 mt-2">
                        {
                            isDelete == istrash &&
                            <h5 style={{ color: curPath === path ? 'red' : '' }}>{label}{path !== 'Home' && <FaTrashRestore onClick={() => reStoreItem(path, parentpath, node)} className="text-secondary mx-2" />
                            }
                            </h5>
                        }
                    </div>
                </div>
            </div>
            {

                isDelete == istrash &&
                <div style={{ paddingLeft: "10px" }}>
                    <TrashData treeData={children} />   
                </div>
            }
        </>
    )
}
export default TrashTreeNode