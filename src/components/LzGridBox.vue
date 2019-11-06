<script>
// import { checkType } from '@/utils/methods'
// const DEFAULT_ROW_RULE = function (item, index) {
//   return index;
// };
const DEFAULT_COL_RULE = function(item, index, defaultReturn, rowDtb) {
  return defaultReturn
}
function widthDistribution(row) {
  const arr = []
  if (Array.isArray(row)) {
    const avg = Math.floor(24 / row.length)
    let rest = 24 - avg * row.length
    row.forEach(() => {
      if (rest) {
        arr.push(avg + 1)
        rest--
      } else {
        arr.push(avg)
      }
    })
  }
  return arr
}
function sortRow(num, index) {
  return Math.ceil((index + 1) / num) - 1
}
export default {
  name: 'DjGridBox',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columnNum: {
      type: Number,
      default: 1
    },
    rowRule: {
      type: Function
      // default: DEFAULT_ROW_RULE
    },
    colRule: {
      type: Function,
      default: DEFAULT_COL_RULE
    }
  },
  data: function() {
    return {}
  },
  computed: {
    rows() {
      const _rows = this.data.reduce((arr, item, index) => {
        const _index = this.rowRule ? this.rowRule(item, index) : sortRow(this.columnNum, index)
        if (!this.$methods.checkType(arr[_index], 'Array')) {
          arr[_index] = []
        }
        arr[_index].push(item)
        return arr
      }, [])
      // 解决使用快速分列时，最后一列数量不满时，会出现宽度与其他模块不同的问题
      if (!this.rowRule) {
        _rows.map(row => {
          if (row && row.length) {
            const remainder = row.length % this.columnNum
            if (remainder > 0) {
              for (let i = 0; i < this.columnNum - remainder; i++) {
                row.push(undefined)
              }
            }
          }
        })
      }
      return _rows
    }
  },
  created() {
  },
  methods: {},
  render() {
    return (
      <div class='dj-grid-box'>
        {
          this._l(this.rows, (row) => {
            const arr_width = widthDistribution(row)
            return (
              <el-row>
                {
                  this._l(row, (item, index) => item ? (
                    <el-col span={this.colRule(item, index, arr_width[index] || 24, arr_width)}>
                      {this.$scopedSlots.default({ item })}
                    </el-col>
                  ) : undefined)
                }
              </el-row>
            )
          })
        }
      </div>
    )
  }
}
</script>
