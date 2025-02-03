import baseIntroDoc from "./baseIntroDoc.vue";
import mobileDevDoc from "./mobileDevDoc.vue"

const components = {
    baseIntroDoc,
    mobileDevDoc
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