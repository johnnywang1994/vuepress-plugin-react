import { h, ref, onMounted, onBeforeUnmount, Suspense } from "vue";
import { createRoot } from "react-dom/client";
import { renderToString } from 'react-dom/server';

const importMap = {
  <%- importMap %>
}

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
  async setup(props, { attrs }) {
    const rootRef = ref(null);
    const renderRoot = ref();

    const passAttrs = { ...attrs, as: undefined, class: undefined };

    try {
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

      // Lifecycle hooks should before first "import" in async setup
      const importer = importMap[props.as];
      const { default: ReactComponent } = await importer();

      let ssrString = '';
      if (!props.clientOnly) {
        try {
          ssrString = renderToString(<ReactComponent {...passAttrs} />);
        } catch(err) {
          console.error(err);
        }
      }

      return () => h("div", {
        ref: rootRef,
        class: attrs.class,
        innerHTML: ssrString,
      })
    } catch(err) {
      console.error(err);
      return {};
    }
  }
};

const VueReactAsyncWrapper = {
  inheritAttrs: false,
  components: {
    <%- name %>
  },
  setup(_, { attrs }) {
    return () => h(Suspense, [h(<%- name %>, { ...attrs, attrs })]);
  },
};

export default {
  enhance: ({ app }) => {
    app.component(<%- JSON.stringify(name) %>, VueReactAsyncWrapper);
  },
}