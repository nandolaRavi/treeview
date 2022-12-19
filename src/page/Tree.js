import TreeNode from "./TreeNode"
const Tree = ({ data, serachKeyWord,currPath }) => {
  return (
    <ul>
      {data.map((node, index) => (
        <TreeNode node={node} key={index} serachKeyWord={serachKeyWord} currPath={currPath} />
      ))}
    </ul>
  )
}

export default Tree 