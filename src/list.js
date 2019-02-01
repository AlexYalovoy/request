function render(data) {
  return `
    <div class="dir-list">
      <ul>
        ${data.map(el => `<li>${el}</li>`)}
      </ul>
    </div>
  `;
}

class List {
  constructor() {
    this.data = null;
  }

  getData() {
    return HttpRequest.GET('http://localhost:8000/list') // eslint-disable-line
      .then(resp => (this.data = resp));
  }

  update() {
    this.getData().then(v => render(this.data));
  }
}

const list = new List();

list.update();
