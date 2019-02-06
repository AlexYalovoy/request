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

  class List {
    constructor(parentNode) {
      this.data = null;
      this.parentNode = parentNode;
      this.node = null;
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
        .then(() => this.render())
        .then(() => {
          this.node = this.parentNode.firstElementChild;
          document.querySelector('.exit-btn').onclick = this.remove.bind(this);
        });
    }

    remove() {
      this.parentNode.removeChild(this.node);
    }
  }

  window.List = List;
})();
