console.log('Service worker starting...');

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

const PATTERNS = [
  // ===== АДРЕС =====
  {
    type: 'ADDRESS',
    regex: /(?:Россия|РФ)?[,.\s]*(?:Московская область[,.\s]*)?г\.?\s*[А-ЯЁ][а-яё\-]+[,.\s]+ул\.?\s+[А-ЯЁа-яё\s]+[,.\s]+д\.?\s*\d+[А-ЯЁа-яё]?[,.\s]+кв\.?\s*\d+/gu
  },

  // ===== ФИО =====
  {
    type: 'FIO',
    regex: /(^|[\s\n\r\t.,;!?])[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?\s+[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?\s+[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?(?=[\s\n\r\t.,;!?]|$)/g
  },

  // ===== БАНК. СЧЁТ (20 цифр) =====
  {
    type: 'BANK_ACCOUNT',
    regex: /(?:счет|счёт|банковский\s+счет)\s*:?\s*\d{20}|\b\d{20}\b/g
  },

  // ===== КОРРЕСПОНДЕНТСКИЙ СЧЁТ (20 цифр после "корр. счет" или "к/с") =====
  {
    type: 'CORR_ACCOUNT',
    regex: /(?:корр\.?\s*счет|к\/с)\s*:?\s*\d{20}/gi
  },

  // ===== БИК (9 цифр) =====
  {
    type: 'BIK',
    regex: /\b\d{9}\b/g
  },

  // ===== ТЕЛЕФОНЫ =====
  {
    type: 'PHONE',
    regex: /(?:\+7|8)[\s\-()]?\d{3}[\s\-()]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/g
  },

  // ===== КОМПАНИЯ =====
  {
    type: 'COMPANY',
    regex: /(?:^|\s)(?:ООО|ЗАО|ОАО|ИП|ПАО|НПФ|АО|ТОО|ЧП|ГП|ФГУП|МУП|ГУП)\s+(?:«[^»]+»|"[^"]+"|'[^']+'|[А-ЯЁа-яё\-\s]+)|(?:«|"|')(?:ООО|ЗАО|ОАО|ИП|ПАО|НПФ|АО|ТОО|ЧП|ГП|ФГУП|МУП|ГУП)\s+[^»"']+(?:»|"|')|(?:ООО|ЗАО|ОАО|ИП|ПАО|НПФ|АО|ТОО|ЧП|ГП|ФГУП|МУП|ГУП)"[^"]+"/gi
  },

  // ===== EMAIL =====
  {
    type: 'EMAIL',
    regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g
  },

  // ===== СНИЛС =====
  {
    type: 'SNILS',
    regex: /\b\d{3}[\s\-]?\d{3}[\s\-]?\d{3}[\s\-]?\d{2}\b/g
  },

  // ===== ИНН =====
  {
    type: 'INN',
    regex: /\b\d{10}(?:\d{2})?\b/g
  },

  // ===== ПАСПОРТ СЕРИЯ =====
  {
    type: 'PASSPORT_SERIES',
    regex: /\b(?:серия\s+)?\d{2}\s+\d{2}\b/gi
  },


  // ===== ПАСПОРТ НОМЕР =====
  {
    type: 'PASSPORT_NUMBER',
    regex: /номер\s+\d{6}/gi
  },

  // ===== ДАТА (выдачи паспорта, рождения и т.п.) =====
  {
    type: 'BIRTHDATE',
    regex: /\b\d{2}\.\d{2}\.\d{4}\b/g
  },

  // ===== EMAIL (повторно, чтобы словить "удаленный") =====
  {
    type: 'EMAIL',
    regex: /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g
  },

  // ===== ОГРН =====
  {
    type: 'OGRN',
    regex: /\b\d{13}\b/g
  },

  // ===== ОКТМО =====
  {
    type: 'OKTMO',
    regex: /\b\d{8}\b/g
  }
];




function genMarker(type, idx) {
  return `[PII_${type}_${idx}]`;
}

function anonymize(text) {
  let meta = [];
  let result = text;
  let replacements = [];

  PATTERNS.forEach(({ type, regex }) => {
    let idx = 1;
    let match;
    regex.lastIndex = 0;
    
    while ((match = regex.exec(text)) !== null) {
      // Для паттернов с группами захвата, используем правильную часть match
      let matchText = match[0];
      let startIndex = match.index;
      
      // Для паттернов с группами захвата (начинающихся с (^|...))
      if (match[1] !== undefined && (match[1] === '' || /^[\s\n\r\t.,;!?]/.test(match[1]))) {
        matchText = match[0].substring(match[1].length);
        startIndex = match.index + match[1].length;
      }
      
      const overlaps = replacements.some(r => 
        (startIndex < r.end && startIndex + matchText.length > r.start)
      );
      
      if (!overlaps) {
        const marker = genMarker(type, idx++);
        replacements.push({ 
          start: startIndex, 
          end: startIndex + matchText.length, 
          original: matchText, 
          marker: marker, 
          entityType: type
        });
      }
    }
  });

  // Сортируем по позиции в обратном порядке для корректной замены
  replacements.sort((a, b) => b.start - a.start);

  // Выполняем замены
  replacements.forEach(({ start, end, marker, original, entityType }) => {
    result = result.slice(0, start) + marker + result.slice(end);
    meta.push({ marker, original, entityType });
  });

  meta.reverse();
  return { result, meta };
}



function deanonymize(text, meta) {
  let restored = text;
  meta.forEach(({ marker, original }) => {
    const esc = marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    restored = restored.replace(new RegExp(esc, 'g'), original);
  });
  return restored;
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
  (async () => {
    try {
      if (req.command === 'getMapCounter') {
        const counterData = await chrome.storage.local.get('mapCounter');
        const currentCounter = counterData.mapCounter || 1;
        await chrome.storage.local.set({ mapCounter: currentCounter + 1 });
        sendResponse({ ok: true, counter: currentCounter });
        return;
      }

      if (req.command === 'anonymize') {
        if (!req.text) {
          sendResponse({ ok: false, error: 'Нет текста для анонимизации' });
          return;
        }
        const { result, meta } = anonymize(req.text);
        await chrome.storage.local.set({ [req.mapName]: meta });
        sendResponse({ ok: true, result, replaced: meta.length });
        return;
      }

      if (req.command === 'deanonymize') {
        if (!req.text) {
          sendResponse({ ok: false, error: 'Нет текста для деанонимизации' });
          return;
        }
        const stored = await chrome.storage.local.get(req.mapName);
        const meta = stored[req.mapName];
        if (!meta) {
          sendResponse({ ok: false, error: 'Словарь не найден' });
          return;
        }
        const restored = deanonymize(req.text, meta);
        sendResponse({ ok: true, result: restored });
        return;
      }

      if (req.command === 'getMappings') {
        const all = await chrome.storage.local.get(null);
        const names = Object.keys(all)
          .filter(key => key !== 'mapCounter')
          .sort();
        sendResponse({ ok: true, names });
        return;
      }

      sendResponse({ ok: false, error: 'Неизвестная команда' });
    } catch (error) {
      sendResponse({ ok: false, error: error.message });
    }
  })();

  return true;
});
