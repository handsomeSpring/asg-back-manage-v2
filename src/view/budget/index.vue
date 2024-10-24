<template>
    <div>
        <List v-if="isIndexPage === '1'" :eventOptions="eventOptions"  @toDetail="handleGoDetail" @toSupplier="handleToSupplier"/>
        <Detail v-else-if="isIndexPage === '2'" :eventOptions="eventOptions" :seasonId="seasonId" @toList="toList" />
        <DetailSupplier v-else :eventId="eventId" :eventOptions="eventOptions" @toList="toList"></DetailSupplier>
    </div>
</template>

<script>
import { getAllEvents } from "@/api/gameSeason/index.js";
import List from "./list.vue";
import Detail from "./detail.vue";
import DetailSupplier from "./DetailSupplier.vue";
export default {
    name: 'budget-index',
    components:{
        List,
        Detail,
        DetailSupplier
    },
    data() {
        return {
            eventOptions: [],
            isIndexPage:'1',
            seasonId:'',
            eventId:'',
        };
    },
    created() {
        this.initData();
    },
    methods: {
        async initData() {
            try {
                const { data } = await getAllEvents();
                this.eventOptions = data.map(item => {
                    return {
                        label: item.name,
                        value: item.id,
                    }
                })
            } catch (error) {

            }
        },
        handleGoDetail(seasonId = ''){
          this.seasonId = seasonId
          this.isIndexPage = '2';
        },
        toList(){
            this.isIndexPage = '1';
        },
        handleToSupplier(event){
            this.isIndexPage = '3';
            this.eventId = event;
        }
    }
}
</script>
<style lang='less' scoped>

</style>