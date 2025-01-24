import AsgHighSearchDoc from './AsgHighSearchDoc.vue';
import AsgTableCardDoc from './AsgTableCardDoc.vue';
import AsgTipComponentDoc from './AsgTipComponentDoc.vue';
import AsgPersonChooseDoc from './AsgPersonChooseDoc.vue';

const components = {
    AsgHighSearchDoc,
    AsgTableCardDoc,
    AsgTipComponentDoc,
    AsgPersonChooseDoc
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