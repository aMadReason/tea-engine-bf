import "vuetify/dist/vuetify.min.css";

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(Vuetify);

const opts = {
  icons: {
    //iconfont: "fa", // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
    values: {
      quickMenuOpen: "fas fa-angle-down",
      quickMenuClose: "fas fa-angle-up",
      lore: "fas fa-book-open",
      locations: "fas fa-compass",
      inventory: "fas fa-suitcase",
      menu: "fas fa-bars",
      exit: "fas fa-times"
    }
  }
};

export default new Vuetify(opts);
