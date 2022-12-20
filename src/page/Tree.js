import TreeNode from "./TreeNode"
const Tree = ({ data, currPath }) => {
  return (
    <ul>
      {data.map((node, index) => (
        <TreeNode node={node} key={index} currPath={currPath} />
      ))}
    </ul>
  )
}

export default Tree 