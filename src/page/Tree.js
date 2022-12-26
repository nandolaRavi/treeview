import { findDirObj } from "../redux/reducers/TreeViewSlice"
import TreeNode from "./TreeNode"
const Tree = ({ treeData }) => {
  return (
    <ul>
      {treeData.map((node, index) => (
        <TreeNode node={node} key={index} />
      ))}
    </ul>
  )
}

export default Tree 