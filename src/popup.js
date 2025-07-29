// Генератор имени с последовательной нумерацией
const genMapName = async () => {
  const resp = await chrome.runtime.sendMessage({ command: 'getMapCounter' });
  const counter = resp.ok ? resp.counter : 1;
  return `map_${counter.toString().padStart(5, '0')}`;
};

const $ = id => document.getElementById(id);

// Инициализация имени
(async () => {
  $('mapName').value = await genMapName();
})();

async function loadMaps(){
  try {
    const resp = await chrome.runtime.sendMessage({ command:'getMappings' });
    const sel = $('mapSelect');
    sel.innerHTML = '';
    
    if (resp.ok && Array.isArray(resp.names) && resp.names.length > 0) {
      // Добавляем опции в порядке получения
      resp.names.forEach(n => {
        const opt = document.createElement('option');
        opt.value = opt.textContent = n;
        sel.appendChild(opt);
      });
      
      // Выбираем последний элемент как значение по умолчанию
      sel.value = resp.names[resp.names.length - 1];
    } else {
      const opt = document.createElement('option');
      opt.textContent = 'Нет сохраненных словарей';
      opt.disabled = true;
      sel.appendChild(opt);
    }
  } catch(e) {
    console.error('Ошибка загрузки словарей:', e);
  }
}
loadMaps();

// Анонимизация
$('anonBtn').addEventListener('click', async () => {
  try {
    const name = ($('mapName').value || await genMapName()).trim();
    if (!name) {
      $('status').textContent = 'Введите имя словаря';
      return;
    }
    
    const text = await navigator.clipboard.readText();
    if (!text) {
      $('status').textContent = 'Буфер обмена пуст';
      return;
    }

    const res = await chrome.runtime.sendMessage({
      command: 'anonymize',
      mapName: name,
      text: text
    });

    if (res.ok) {
      await navigator.clipboard.writeText(res.result);
      $('status').textContent = `Заменено ${res.replaced} фрагментов, результат скопирован в буфер`;
      
      // Обновляем имя для следующего использования
      $('mapName').value = await genMapName();
      loadMaps();
    } else {
      $('status').textContent = `Ошибка: ${res.error}`;
    }
  } catch (e) {
    $('status').textContent = 'Ошибка: ' + e.message;
  }
});

// Деанонимизация
$('deanonBtn').addEventListener('click', async () => {
  try {
    const name = $('mapSelect').value;
    if (!name) {
      $('status').textContent = 'Нет выбранного словаря';
      return;
    }
    
    const text = await navigator.clipboard.readText();
    if (!text) {
      $('status').textContent = 'Буфер обмена пуст';
      return;
    }

    const res = await chrome.runtime.sendMessage({
      command: 'deanonymize',
      mapName: name,
      text: text
    });

    if (res.ok) {
      await navigator.clipboard.writeText(res.result);
      $('status').textContent = 'Текст восстановлен и скопирован в буфер';
    } else {
      $('status').textContent = `Ошибка: ${res.error}`;
    }
  } catch (e) {
    $('status').textContent = 'Ошибка: ' + e.message;
  }
});
