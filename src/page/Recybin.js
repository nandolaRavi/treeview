import { useCallback } from "react";
import { FaFile, FaFolderOpen, FaTrashRestore } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { restoreDir, setPath, setType } from "../redux/reducers/TreeViewSlice";

const Recybin = ({ trashData }) => {
  const icons = [<FaFolderOpen />, <FaFile />];
  const dispatch = useDispatch();

  const handleClick = useCallback((path, type) => {
    dispatch(setType({ type: type }));
    dispatch(setPath({ path: path }));
  }, [dispatch]);

  const hadleRestoreItem = useCallback((path) => {
    dispatch(restoreDir({ path: path }));
  }, [dispatch]);

  return (
    <div>
      {trashData.map((node, index) => (
        <div key={index}>
          <div onClick={() => handleClick(node.path, node.type)} style={{ marginBottom: "10px" }}>
            <div className="d-flex d-flex align-items-center m-2">
              <div className="fs-2 text-warning">
                {icons[node.type]}
              </div>
              <div className="p-2 mt-2">
                <h5>{node.label}{node.path !== 'Home' && <FaTrashRestore onClick={() => hadleRestoreItem(node.path)} className="text-secondary mx-2" />} </h5>
              </div>
            </div>
          </div>

          <div style={{ paddingLeft: "10px" }}>
            <Recybin trashData={node.children} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Recybin 