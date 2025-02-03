<template>
    <div>
        <el-divider content-position="left">基本概念</el-divider>
        <AsgTipComponent type="danger">
            <p>因为我们封装了axios，在目录<span>src\utils\request.js</span>里，集成了需要传入token给后端。所以请不要自己在组件里使用axios，这样会导致请求发送失败，下面是使用封装请求写请求方法的步骤。</p>
        </AsgTipComponent>
        <el-divider content-position="left">一、在api文件夹下新建一个xxx.js文件</el-divider>
        <pre v-highlight>
            <code>
                //在文件里引入request
                import request from "@/utils/request";
            </code>
        </pre>
        <el-divider content-position="left">二、根据接口文档写方法</el-divider>
        <pre v-highlight>
            <code>
                //比如我要写一个新增数据的方法
                export function addItem(params,body){
                    return request({
                        url:'这里写后端的地址',
                        method:'POST', //这里写请求方法
                        data:body, //这里写请求体的参数
                        params, //这里写接受路径传参的参数，params:params触发es6简写，所以是params
                    })
                }
                //注意，如果是放到body（请求体里），则用data为key接受；如果是放到路径传参，则用params接受
            </code>
        </pre>
        <el-divider content-position="left">三、在组件里使用该方法</el-divider>
        <pre v-highlight>
            <code>
                &lt;script>
                   import { addItem } from '@/api/xxx/xxx.js';
                   export default{
                     name:'您的组件',
                     data(){
                        return {
                            body:{
                                name:'浊泉',
                                sex:'男',
                                age:999
                            },
                            params:{
                                like:'第五人格'
                            }
                        }
                     },
                     methods:{
                        //建议使用try catch 和 async await来处理异步，不要使用.then
                        async addData(){
                            try{
                               //调用方法，并传参
                               const { data, message } = await addItem(this.params,this.body);
                               //把服务器的错误抛给用户
                               if(data && data.code &&  data.code !== 200) throw new Error(data.message); 
                               //做一些后续处理，比如刷新列表，赋值等等...
                            }catch(error){
                               this.$message.error(error.message); //将捕捉的错误信息抛给用户。
                            }finally{
                                //做一些后续操作，比如关闭弹窗
                            }
                        }
                     }
                   }
                &lt;/script>
            </code>
        </pre>
    </div>
</template>

<script>
import AsgTipComponent from '@/components/AsgTipComponent.vue';
export default {
    name: 'axiosUseDoc',
    text: '网络请求交互',
    components: {
        AsgTipComponent
    },
    data() {
        return {

        };
    },
    methods: {

    },
    created() {

    },
}
</script>
<style lang='less' scoped></style>