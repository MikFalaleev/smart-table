/*
import { createComparison, defaultRules } from "../lib/compare.js";

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      })
    );
  });

  return (data, state, action) => {
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      const parent = action.parentElement;
      const input = parent.querySelector("input, select, textarea");

      if (input) {
        input.value = "";
      }

      if (field in state) {
        state[field] = "";
      }
    }

    const filterState = {
      date: state.date,
      customer: state.customer,
      seller: state.searchBySeller ?? state.seller,
      total: [state.totalFrom, state.totalTo],
    };

    return data.filter((row) => compare(row, filterState));
  };
}
*/

export function initFiltering(elements) {
  // Заполняем селекты после получения индексов с сервера
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const el = document.createElement("option");
          el.textContent = name;
          el.value = name;
          return el;
        })
      );
    });
  };

  // Теперь фильтрация формирует query-параметры для сервера
  const applyFiltering = (query, state, action) => {
    // обработка очистки поля (как раньше)
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      const parent = action.parentElement;
      const input = parent.querySelector("input, select, textarea");

      if (input) {
        input.value = "";
      }

      if (field in state) {
        state[field] = "";
      }
    }

    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (elements[key]) {
        if (
          ["INPUT", "SELECT"].includes(elements[key].tagName) &&
          elements[key].value
        ) {
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
