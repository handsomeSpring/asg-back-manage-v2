import baseIntroDoc from "./baseIntroDoc.vue";
import baseDevDoc from "./baseDevDoc.vue";
import mobileDevDoc from "./mobileDevDoc.vue";
import axiosUseDoc from "./axiosUseDoc.vue";
import secondDevDoc from "./secondDevDoc.vue";

const components = {
    baseIntroDoc,
    baseDevDoc,
    axiosUseDoc,
    secondDevDoc,
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