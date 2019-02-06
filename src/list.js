/* eslint-disable no-undef */
/* eslint-disable indent */
(() => {
  function render(data) {
    return `
      <ul>
        <i class = 'far fa-times-circle exit-btn'></i>
        ${data.length
          ? data.map(el => `<li>${el}</li>`).join('\n')
          : 'List is empty!'}
      </ul>
    `;
  }

  function exitClick(e) {
    if (e.target.classList.contains('exit-btn')) {
      this.remove();
    }
  }

  class List {
    constructor(parentNode) {
      this.data = null;
      this.parentNode = parentNode;
      this.node = null;
      this.__init().call(this);
    }

    __init() {
      document.querySelector('.dir-list').onclick = exitClick.bind(this);
    }

    setData() {
      return xhr.get('/list')
        .then(response => (this.data = response));
    }

    render() {
      this.parentNode.innerHTML = render(this.data);
    }

    update() {
      this.setData()
        .then(() => this.render());
    }

    remove() {
      this.parentNode.removeChild(this.parentNode.firstElementChild);
    }
  }

  window.List = List;
})();
