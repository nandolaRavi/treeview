import { useCallback, useState } from "react";
import Tree from "./Tree";
import { useDispatch, useSelector } from "react-redux";
import { setPath, setType, deleteDir, setView, setEditSourePath } from "../redux/reducers/treeViewSlice"
import { FaFolderOpen, FaFile } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import ContextMenu from "./menu"
import { Button } from "react-bootstrap";
import { FiChevronDown } from "react-icons/fi";
import EditView from "./EditView";
import "../css/TreeNode.css"

const TreeNode = ({ node, currEditObject }) => {
    const serachKeyWord = useSelector((state) => state.treeView.serachKeyWord);
    const { children, label, path, type, isDelete } = node;
    const [showChildren, setShowChildren] = useState(true);
    const icons = [<FaFolderOpen />, <FaFile />];

    const dispatch = useDispatch();

    const handleClick = useCallback(() => {
        setShowChildren(!showChildren);
        dispatch(setType({ type: type }));
        dispatch(setPath({ path: path }));
    }, [setShowChildren, dispatch]);

    const viewSelecteFile = useDispatch((path) => {
        dispatch(setEditSourePath({ path: path }))
    }, [dispatch])

    const deleteItem = useCallback((curPath) => {
        dispatch(setView(false))
        dispatch(deleteDir({ path: curPath }));
        dispatch(setPath({ path: node.parentpath }));
    }, [dispatch])

    const handlePath = useCallback((path) => {
        dispatch(setPath({ path: path }));
    }, [dispatch]);
    
    return (
        <>
            <div style={{ marginBottom: "5px" }} onClick={() => { handlePath(path) }}>
                {
                    isDelete == false &&
                    <div className="d-flex d-flex align-items-center m-2">
                        <div className="d-flex mx-3">
                            <div className="fs-2 text-warning">
                                {type == '0' && <FiChevronDown onClick={() => handleClick()} className="text-black fs-4" />} {icons[type]}
                            </div>
                            <div className="p-2 mt-2 d-flex align-items-center">
                                <div>
                                    <h5 className={label.toLowerCase().includes(serachKeyWord) > 0 && serachKeyWord !== '' ? 'highlights' : ''}>{label}</h5>
                                </div>
                                <div className="main-container d-flex">
                                    <div className="mx-2">
                                        {path !== 'Home' && <Button variant="danger">
                                            <FaTrashAlt onClick={() => deleteItem(path)} className="delete-item-button text-white" /></Button>
                                        }
                                    </div>
                                    <div onClick={() => viewSelecteFile(path)}>
                                        {path !== 'Home' && <Button variant="info">
                                            <EditView className="view-item-button bg-info" currEditObject={currEditObject} /></Button>
                                        }
                                    </  div>
                                    <div className="mx-2">
                                        <Button><ContextMenu currObj={node} path={path} /></Button>
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
                            {showChildren && <Tree data={children} />}
                        </div>}
                </ul>
            }
        </>
    )
}
export default TreeNode