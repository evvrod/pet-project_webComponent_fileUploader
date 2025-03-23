import './components/FileUploader/index';

import './style.css';

document.addEventListener('dragover', (e) => {
  e.preventDefault(); // Предотвращаем стандартное поведение для всего документа
});

document.addEventListener('dragenter', (e) => {
  e.preventDefault(); // Также предотвращаем стандартное поведение при входе файла
});
