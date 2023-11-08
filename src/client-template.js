import { h, ref, onMounted, onBeforeUnmount } from "vue";
import { createRoot } from "react-dom/client";
import { renderToString } from 'react-dom/server';

<%- imports.join('\n') %>

const ReactComponents = {
  <%- components %>
};

const <%- name %> = {
  props: {
    as: {
      type: String,
      required: true,
    },
    clientOnly: {
      type: Boolean,
      default: false,
    },
  },
  inheritAttrs: false,
  setup(props, { attrs }) {
    const rootRef = ref(null);
    const renderRoot = ref();

    const ReactComponent = ReactComponents[props.as];
    const passAttrs = { ...attrs, class: undefined };

    let ssrString = '';
    if (!props.clientOnly) {
      try {
        ssrString = renderToString(<ReactComponent {...passAttrs} />);
      } catch(err) {
        console.error(err);
      }
    }

    onMounted(() => {
      if (!!ReactComponent) {
        try {
          renderRoot.value = createRoot(rootRef.value);
          renderRoot.value?.render(<ReactComponent {...passAttrs} />);
        } catch(err) {
          console.error(err);
        }
      }
    });

    onBeforeUnmount(() => {
      renderRoot.value?.unmount(); // react 18
    });

    return () => h("div", {
      ref: rootRef,
      class: attrs.class,
      innerHTML: ssrString,
    });
  }
};

export default {
  enhance: ({ app }) => {
    app.component(<%- JSON.stringify(name) %>, <%- name %>);
  },
}