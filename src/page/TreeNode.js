import { useCallback, useState } from "react";
import Tree from "./Tree";
import { useDispatch, useSelector } from "react-redux";
import { setPath, setType, deleteDir, setEditSourePath, findDirObj } from "../redux/reducers/TreeViewSlice"
import { FaFolderOpen, FaFile } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import ContextMenu from "./Menu"
import { Button } from "react-bootstrap";
import { FiChevronDown } from "react-icons/fi";
import EditView from "./EditView";
import "../css/TreeNode.css"

const TreeNode = ({ node }) => {
    const searchkeyword = useSelector((state) => state.treeView.serachKeyWord);
    const { children, label, path, type, isDelete, isCut, parentpath } = node;
    const [showChildren, setShowChildren] = useState(true);
    const icons = [<FaFolderOpen />, <FaFile />];
    const dispatch = useDispatch();

    const handleShowChild = useCallback(() => {
        setShowChildren(!showChildren);
    }, [showChildren])
    const handleChild = useCallback((type, path) => {
        dispatch(setType({ type: type }));
        dispatch(setPath({ path: path }));
    }, [setShowChildren, dispatch, path, type]);

    const hanldeDeleteItem = useCallback((path, parentpath) => {
        dispatch(deleteDir({ path: path }));
        dispatch(setPath({ path: parentpath }));
    }, [dispatch, path, parentpath]);

    return (
        <>
            <div style={{ marginBottom: "5px" }}>
                {
                    isDelete == false && isCut == false &&
                    < div className="d-flex d-flex align-items-center m-2">
                        <div className="d-flex mx-3">
                            <div className="fs-2 text-warning">
                                {type == '0' && <FiChevronDown onClick={handleShowChild} className="text-black fs-4" />} {icons[type]}
                            </div>
                            <div className="p-2 mt-2 d-flex align-items-center">
                                <div onClick={() => handleChild(type, path)}>
                                    <h5 className={label.toLowerCase().includes(searchkeyword) > 0 && searchkeyword !== '' ? 'highlights' : ''}>{label}</h5>
                                </div>
                                <div className="main-container d-flex">
                                    <div className="mx-2" onClick={() => hanldeDeleteItem(path, parentpath)}>
                                        {path !== 'Home' && <Button variant="danger">
                                            <FaTrashAlt className="delete-item-button text-white" /></Button>
                                        }
                                    </div>
                                    {path !== 'Home' && <Button variant="info">
                                        <EditView className="view-item-button bg-info" currObj={node} /></Button>
                                    }
                                    <div className="mx-2">
                                        <Button><ContextMenu type={node.type} path={path} /></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                        </div>
                    </div>
                }
            </div>
            {
                <ul style={{ paddingLeft: "10px", borderLeft: "3px solid #6B728E" }} className='children-item'>
                    {
                        children &&
                        <div>
                            {showChildren && <Tree treeData={children} />}
                        </div>}
                </ul>
            }
        </>
    )
}
export default TreeNode