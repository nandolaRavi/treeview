import TrashTreeNode from "./trashTreeNode";
const TrashData = ({ treeData, serachKeyWord }) => {
  console.log("treeData", treeData)
  return (
    <div>
      {treeData.map((node, index) => (
        <TrashTreeNode node={node} key={index}/>
      ))}
    </div>
  )
}

export default TrashData 