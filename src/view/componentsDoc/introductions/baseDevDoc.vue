<template>
    <div>
        <TextTitle class="custom-my-1" title-name="常用CSS(scss/less技巧)样式属性"></TextTitle>
        <el-table :data="tableData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="样式名" prop="name" align="center"></el-table-column>
            <el-table-column label="代码" prop="prop" align="center"></el-table-column>
            <el-table-column label="示例" prop="exam" align="center"></el-table-column>
        </el-table>
        <TextTitle class="custom-my-1" title-name="常用javascript技巧"></TextTitle>
        <el-table :data="javaData" border stripe :header-cell-style="{ background: '#f2f6fd', color: '#000' }">
            <el-table-column label="方法名" prop="name" align="center"></el-table-column>
            <el-table-column label="描述" prop="doc" align="center"></el-table-column>
            <el-table-column label="示例" prop="exam" align="center"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import TextTitle from '@/components/TextTitle.vue';
export default {
  name:'baseDevDoc',
  text:'基础开发必备知识',
  components:{
    TextTitle
  },
    data() {
      return {
        javaData:[
            {
                name:'filter',
                doc:'数组过滤法',
                exam:'const a = [1,2,3].filter(item => item > 2),a为[3]'
            },
            {
                name:'map',
                doc:'数组映射',
                exam:'const a = [1,2,3].map(item =>  item * 2 ),a为[2,4,6]'
            },
            {
                name:'find',
                doc:'查找数组元素',
                exam:'const a = [1,2,3].find(item =>  item === 2 ),a为2'
            },
            {
                name:'findIndex',
                doc:'查找数组元素所在下标',
                exam:'const a = [1,2,3].find(item =>  item === 2 ),a为1'
            },
            {
                name:'reduce',
                doc:'遍历求和数组',
                exam:'const a = [1,2,3].reduce((pre, next) => pre + Number(next), 0),a为6'
            },
            {
                name:'forEach',
                doc:'数组循环',
                exam:'[1,2,3].forEach(item => console.log(item)),打印1,2,3'
            },
            {
                name:'三目运算符',
                doc:'a = 表达式 ? 1 : 3',
                exam:'const a = isMobile ? 80% : 100%'
            },
            {
                name:'展开运算符',
                doc:'...,将数组每一项或者对象每一项展开',
                exam:'const a = [1,2,3];const b = [4,5,6];const c = [...a,...b] <===> c = [1,2,3,4,5,6]'
            },
            {
                name:'可选链运算符',
                doc:'? <===> 让程序健壮性更好',
                exam:'object?.a?.isMobile() === 通过可选链运算符，如果a不存在object里面则不会报错。'
            },
            {
                name:'或并运算符',
                doc:'a || b 前为true则为前，为false则为后 === a && b,前为true且后为true才成立，否则都为false === a ?? b 前为undefined或者null，才为后。',
                exam:'const a = isNull ?? 4,isNull变量不存在为undefined，则a为4。'
            },
            {
                name:'序列化',
                doc:'JSON.parse 和 JSON.stringify 互相把对象\数组转为 字符串',
                exam:"const a = JSON.stringify([1,2,3]);const b = JSON.parse('[1,2,3]')"
            },
            {
                name:'感叹号',
                doc:'!取反，!!可以把某个变量转化成布尔值',
                exam:'cosnt a = undefined; !!a则为false'
            },
            {
                name:'js数据类型',
                doc:'基础数据类型：Number（数值，包含NaN）String（字符串）Boolean（布尔值）Undefined（未定义/未初始化）Null（空对象）Symbol（独一无二的值，ES6 新增）BigInt （大整数，能够表示超过 Number 类型大小限制的整数，ES 2020新增）；引用数据类型：Object（对象。Array/数组 和 function/函数 也属于对象的一种',
                exam:'/'
            }
        ],
        tableData:[
            {
                name:'弹性布局',
                prop:'display:flex',
                exam:'让main容器盒下面元素水平且垂直居中对齐 main{ display:flex;justify-content:center;align-items:center }'
            },
            {
                name:'网格布局',
                prop:'display:grid',
                exam:'让main容器盒下面元素水平分成三份 main{ display:grid;grid-template-columns: repeat(3, 1fr) ;align-items:center }'
            },
            {
                name:'less/scss语法',
                prop:'主要表现请详见官网',
                exam:'例如：.class1{ &.class2{ color:red } } 等价于 .class1 .class2 { color:red }'
            },
            {
                name:'外边距居中法',
                prop:'margin:0 auto;',
                exam:'例如：若想让box类名的盒子在父容器中居中，则.box{ margin:0 auto; }'
            },
            {
                name:'让文字超出宽度出现省略号',
                prop:'text-overflow: ellipsis',
                exam:'例如：p { text-overflow: ellipsis;white-space: nowrap;overflow: hidden;width:100px}'
            }
        ]
      };
    },
}
</script>