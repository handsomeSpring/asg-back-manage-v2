import asgMyCollaction from '../components/asg-my-collaction.vue';
import asgUserInfo from '../components/asg-user-Info.vue';
import asgQuickJump from '../components/asg-quick-jump.vue';
import asgMyShopping from '../components/asg-my-shopping.vue';
import asgMyGuess from '../components/asg-my-guess.vue';
import asgOtherSystem from '../components/asg-other-system.vue';
import asgFlowIntro from "../components/asg-flow-intro.vue";
import asgMyTeam from '../components/asg-my-team.vue';
const components = {
    asgMyCollaction,
    asgUserInfo,
    asgQuickJump,
    asgMyShopping,
    asgMyGuess,
    asgOtherSystem,
    asgFlowIntro,
    asgMyTeam
};

const widgets = [];
for (const key in components) {
    if (components.hasOwnProperty(key)) {
        const element = components[key];
        console.log(element,'element');
        widgets.push({
            label: element.text,
            type: element.name
        });
    }
}
export default {
    components,
    widgets
};