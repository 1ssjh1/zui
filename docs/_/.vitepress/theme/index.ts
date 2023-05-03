import DefaultTheme from 'vitepress/theme';
// import DynamicLayout from './components/DynamicLayout.vue';
import Example from './components/example.vue';
import CssPropValue from './components/css-prop-value.vue';
import CopyCode from './components/copy-code.vue';
import './tailwind.css';
import './vars.css';
import './whyframe.css';
import './style.css';

export default {
    extends: DefaultTheme,

    enhanceApp({app}) {
        app.component('Example', Example);
        app.component('CssPropValue', CssPropValue);
        app.component('CopyCode', CopyCode);
    },

    // use our custom layout component that we'll create next
    // Layout: DynamicLayout
};
