import AsgHighSearchDoc from './AsgHighSearchDoc.vue';
import AsgTableCardDoc from './AsgTableCardDoc.vue';
import AsgHighTableDoc from './AsgHighTableDoc.vue';
import AsgTipComponentDoc from './AsgTipComponentDoc.vue';
import AsgPersonChooseDoc from './AsgPersonChooseDoc.vue';
import AsgCheckBoxDoc from './AsgCheckBoxDoc.vue';
import AsgPriorityCompDoc from './AsgPriorityCompDoc.vue';
import AsgMobileTableDoc from './AsgMobileTableDoc.vue';
import AsgMobilePageDoc from './AsgMobilePageDoc.vue';
import AsgTableDoc from './AsgTableDoc.vue';
import AsgMoneyInputDoc from './AsgMoneyInputDoc.vue';

const components = {
    AsgHighSearchDoc,
    AsgTableCardDoc,
    AsgHighTableDoc,
    AsgTableDoc,
    AsgTipComponentDoc,
    AsgPersonChooseDoc,
    AsgCheckBoxDoc,
    AsgPriorityCompDoc,
    AsgMobileTableDoc,
    AsgMobilePageDoc,
    AsgMoneyInputDoc
};

const widgets = [];
for (const key in components) {
    if (components.hasOwnProperty(key)) {
        const element = components[key];
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