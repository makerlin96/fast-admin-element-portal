export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回第一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}
export function formatDateTime(timestamp) {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  let month = time.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = time.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let hour = time.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }
  let minute = time.getMinutes()
  if (minute < 10) {
    minute = '0' + minute
  }
  let second = time.getSeconds()
  if (second < 10) {
    second = '0' + second
  }
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}
