import 'babel-polyfill';

import cssVarsPonyfill from 'css-vars-ponyfill';

if (!('remove' in Element.prototype)) {
  Element.prototype.remove = function() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  };
}

cssVarsPonyfill({
  onlyLegacy: true,
  exclude: '[data-styled]',
});