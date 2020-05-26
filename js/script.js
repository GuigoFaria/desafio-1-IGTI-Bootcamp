let pesquisaInput = null;
let botaoPesquisa = null;
let form = null;
let allPessoas = [];
let tabPessoas = null;
let tabEstatisticas = null;

let countPessoas = 0;
let countSexoMasculino = 0;
let countSexoFeminino = 0;
let somaIdade = 0;
let mediaIdade = 0;

window.addEventListener("load", () => {
  pesquisaInput = document.querySelector("#pesquisaInput");
  botaoPesquisa = document.querySelector("#botaoPesquisa");
  tabPessoas = document.querySelector("#tabPessoas");
  tabEstatisticas = document.querySelector("#tabEstatisticas");

  form = document.querySelector("form");

  function preventFormSubmit() {
    form.addEventListener("submit", handleFormSubmit);

    function handleFormSubmit(event) {
      event.preventDefault();
      render();
    }
  }

  function habilitaBotao() {
    pesquisaInput.value === ""
      ? (botaoPesquisa.disabled = true)
      : (botaoPesquisa.disabled = false);
  }
  preventFormSubmit();
  pesquisaInput.addEventListener("keyup", habilitaBotao);

  fetchPessoas();
});

function filtrarPessoas(listaPessoas, valorDigitado) {
  const novaLista = listaPessoas.filter((pessoa) => {
    const nomePessoa = pessoa.namePeople.toLowerCase();
    nomePessoa.normalize("NFD");

    return nomePessoa.includes(valorDigitado);
  });

  return novaLista;
}

async function fetchPessoas() {
  const pessoas = await fetch(
    "https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo"
  );
  const pessoasJson = await pessoas.json();

  allPessoas = pessoasJson.results.map((pessoa) => {
    const { name, picture, dob, gender } = pessoa;

    return {
      namePeople: name.first + " " + name.last,
      picturePeople: picture.thumbnail,
      age: dob.age,
      gender,
    };
  });
}

function render() {
  let valorDigitado = pesquisaInput.value;
  renderListaPessoas(valorDigitado);
  renderEstatisticas(valorDigitado);
}

function renderListaPessoas(textoInput) {
  let pessoasHtml = "<div>";
  textoInput.toLowerCase();

  const novasPessoas = filtrarPessoas(allPessoas, textoInput);

  const quantidadePessoas = novasPessoas.length;
  if (quantidadePessoas !== 0) {
    countPessoas = document.querySelector("#pessoasEncontradas");
    countPessoas.textContent = `${quantidadePessoas} usuário(s) encontrado(s)`;

    novasPessoas.forEach((pessoa) => {
      const { namePeople, picturePeople, age } = pessoa;

      const pessoaHtml = `
      <div class="pessoa">
          <div>
              <div>
              <img src="${picturePeople}" alt="${namePeople}"/>
              </div>
          </div>

          <div>
          <ul>
              <li>${namePeople}</li>
              <li>${age} anos</li>
          </ul>
          </div>
          </div>
          `;
      pessoasHtml += pessoaHtml;
      pessoasHtml += "</div>";

      tabPessoas.innerHTML = pessoasHtml;
    });
  } else {
    tabPessoas.innerHTML = `<div id="tabPessoas"></div>`;
    countPessoas.innerHTML = ` <h5 id="pessoasEncontradas">Nenhum usuário encontrado</h5>`;
  }
}
function renderEstatisticas(textoInput) {
  function countSexos(listaPessoas) {
    listaPessoas.forEach((pessoa) => {
      pessoa.gender === "female" ? countSexoFeminino++ : countSexoMasculino++;
    });
  }

  function somarIdades(listaPessoas) {
    const novaSoma = listaPessoas.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);
    return novaSoma;
  }

  function mediaIdades(listaPessoas, somaIdade) {
    return somaIdade / listaPessoas.length;
  }
  function zerarEstatisticas() {
    countSexoMasculino = 0;
    countSexoFeminino = 0;
    somaIdade = 0;
    mediaIdade = 0;
  }

  const novasPessoas = filtrarPessoas(allPessoas, textoInput);
  if (novasPessoas.length !== 0) {
    countSexos(novasPessoas);
    somaIdade = somarIdades(novasPessoas);
    mediaIdade = mediaIdades(novasPessoas, somaIdade);

    let estatisticaHtml = `
    <div >
      <p>Sexo masculino: ${countSexoMasculino} </p>
      <p>Sexo Feminino: ${countSexoFeminino} </span></p>
      <p>Soma das idades: ${somaIdade} </span></p>
      <p>Media das idades: ${mediaIdade}</span></p>
    </div>`;

    tabEstatisticas.innerHTML = estatisticaHtml;
  } else {
    tabEstatisticas.innerHTML = `<div id="tabEstatisticas"></div>`;
  }

  zerarEstatisticas()
}
