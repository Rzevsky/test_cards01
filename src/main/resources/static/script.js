document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('cardContainer');
    const addCardButton = document.getElementById('addCardButton');
    const saveCardButton = document.getElementById('saveCardButton');
    const deleteCardButton = document.getElementById('deleteCardButton');

    // Ссылки на поля модального окна
    const termInput = document.getElementById('termInput');
    const definitionInput = document.getElementById('definitionInput');
    const urlInput = document.getElementById('urlInput');

    // Инициализация модального окна
    const addCardModal = new bootstrap.Modal(document.getElementById('addCardModal'));

    let currentCardId = null; // Переменная для хранения ID текущей редактируемой карточки

    // Функция для загрузки всех карточек
    function loadCards() {
        fetch('/api/cards')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки карточек');
                }
                return response.json();
            })
            .then(cards => {
                cardContainer.innerHTML = '';
                cards.forEach(card => {
                    const cardDiv = createCardElement(card);
                    cardContainer.appendChild(cardDiv);
                });
            })
            .catch(error => {
                console.error('Ошибка при загрузке карточек:', error);
            });
    }

    // Функция для создания элемента карточки
    function createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card', 'mb-4');
        cardDiv.innerHTML = `
            <img src="${card.url}" class="card-img-top" alt="${card.term}">
            <div class="card-body">
                <h5 class="card-title">${card.term}</h5>
                <p class="card-text">${card.definition}</p>
                <button class="btn btn-primary edit-card-button" data-card-id="${card.id}">Редактировать</button>
            </div>
        `;
        return cardDiv;
    }

    // Слушатель для кнопки добавления новой карточки (открытие модального окна)
    addCardButton.addEventListener('click', () => {
        // Очищаем поля ввода перед открытием модального окна
        termInput.value = '';
        definitionInput.value = '';
        urlInput.value = 'https://via.placeholder.com/600x600/000000/FFFFFF?text=New+Card';
        currentCardId = null; // При добавлении новой карточки ID не задан

        // Обновляем заголовок модального окна
        document.getElementById('addCardModalLabel').innerText = 'Добавить новую карточку';

        // Скрываем кнопку удаления при добавлении новой карточки
        deleteCardButton.style.display = 'none';

        // Открываем модальное окно
        addCardModal.show();
    });

    // Слушатель для кнопки "Редактировать" карточки
    cardContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('edit-card-button')) {
            const cardId = event.target.getAttribute('data-card-id');
            currentCardId = cardId;

            // Загружаем данные карточки и заполняем поля модального окна
            fetch(`/api/cards/${cardId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при загрузке данных карточки');
                    }
                    return response.json();
                })
                .then(card => {
                    // Проверка данных, чтобы убедиться, что они существуют
                    if (card && typeof card.term !== 'undefined' && typeof card.definition !== 'undefined' && typeof card.url !== 'undefined') {
                        termInput.value = card.term; // Заполняем поле термина
                        definitionInput.value = card.definition; // Заполняем поле определения
                        urlInput.value = card.url; // Заполняем поле URL
                    } else {
                        console.error('Получены некорректные данные карточки:', card);
                    }

                    // Обновляем заголовок модального окна
                    document.getElementById('addCardModalLabel').innerText = 'Редактировать карточку';

                    // Показываем кнопку удаления при редактировании карточки
                    deleteCardButton.style.display = 'inline-block';

                    // Открываем модальное окно с предзаполненными данными
                    addCardModal.show();
                })
                .catch(error => {
                    console.error('Ошибка при загрузке данных карточки:', error);
                });
        }
    });

    // Слушатель для кнопки "Save" в модальном окне
    saveCardButton.addEventListener('click', () => {
        const cardData = {
            term: termInput.value,
            definition: definitionInput.value,
            url: urlInput.value // Сохраняем новый URL карточки
        };

        // Если currentCardId равен null, это значит, что добавляется новая карточка
        if (currentCardId === null) {
            fetch('/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при добавлении новой карточки');
                }
                return response.json();
            })
            .then(() => {
                addCardModal.hide();
                loadCards();
            })
            .catch(error => {
                console.error('Ошибка при добавлении новой карточки:', error);
            });
        } else {
            // Иначе редактируется существующая карточка
            fetch(`/api/cards/${currentCardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cardData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при редактировании карточки');
                }
                return response.json();
            })
            .then(() => {
                addCardModal.hide();
                loadCards();
            })
            .catch(error => {
                console.error('Ошибка при редактировании карточки:', error);
            });
        }
    });

    // Слушатель для кнопки "Удалить" в модальном окне
    deleteCardButton.addEventListener('click', () => {
        if (currentCardId !== null) {
            fetch(`/api/cards/${currentCardId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при удалении карточки');
                }
                addCardModal.hide();
                loadCards();
            })
            .catch(error => {
                console.error('Ошибка при удалении карточки:', error);
            });
        }
    });

    // Загружаем карточки при загрузке страницы
    loadCards();
});
