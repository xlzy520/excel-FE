const grade = [
  { label: '全部', value: '' },
  { label: '幼儿园', value: 0 },
  { label: '小学', value: 1 },
  { label: '初中', value: 2 },
  { label: '中职', value: 3 },
  { label: '高中', value: 4 }
]
export default {
  grade: grade,
  gradeNotAll: grade.slice(1, grade.length)
}
