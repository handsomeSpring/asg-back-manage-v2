import AsgHighSearchDoc from './AsgHighSearchDoc.vue';
import AsgTableCardDoc from './AsgTableCardDoc.vue';
import AsgTipComponentDoc from './AsgTipComponentDoc.vue';
import AsgPersonChooseDoc from './AsgPersonChooseDoc.vue';
import AsgCheckBoxDoc from './AsgCheckBoxDoc.vue';
import AsgPriorityCompDoc from './AsgPriorityCompDoc.vue';
import AsgMobileTableDoc from './AsgMobileTableDoc.vue';
import AsgMobilePageDoc from './AsgMobilePageDoc.vue';

const components = {
    AsgHighSearchDoc,
    AsgTableCardDoc,
    AsgTipComponentDoc,
    AsgPersonChooseDoc,
    AsgCheckBoxDoc,
    AsgPriorityCompDoc,
    AsgMobileTableDoc,
    AsgMobilePageDoc
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