# Запуск приложения
1. Зайдите через терминал в директорию test_scala
2. выполните в терминале npm i install
3. Перейдите в директорию src и выполните в терминале node app.js (Предполагается что Node.js установлена на машине и переменные окружения содержат путь к бинарному файлу)
4. Откройте в браузере ссылку http://localhost:8887/

# Краткое описание работы
Приложение написано полностью на JavaScript. В качестве БД используется SQLite. 
Структура проекта:
1. /src/data - данные для импорта в БД
2. /src/static - исходный код клиента
3. /src/*.js - исходный код сервера
4. package.json - зависимости

# Основные задачи
1. Импорт объектов из приложенных файлов
При старте приложения происходит парсинг данных из директории /src/data/ в базу данных SQLite. Процесс откроется на 8887 пОрте только после инициализации и заполнении БД.
2. Предоставить API для CRUD операций по объектам
API описано в файле app.js
3. При ручном сохранении ценной бумаги проводить валидацию передаваемых данных в поле name - только кириллица, цифры и пробел;
Логика валидации описана функцией isSecurityNameValid
4. Отдельным методом реализовать вывод таблицы с данными из тегов
Тут к сожалению я сделал немножко по своему и заметил это только сейчас. Сама задача подразумевает выгрузку из БД данных, редьюс над ними и отправку клиенту.
Предполагалось что редьюс будет на стороне сервера. Я сделал редьюс на стороне клиента (строки 38 - 97 файл src/static/js/views/security-table.js) (кстати, мне эта часть кода нравится и можно отнести к разделу "пример кода за который не стыдно")

# Дополнительные задачи
1. Реализовать хранение и работу с данными в БД
База описана в файле src/database.js. Волевым решением было принято использовать SQLite в оперативной памяти.
2. Реализовать MVC приложение, позволяющее через интерфейс импортировать файлы и работать с таблицей п.3 и CRUD операциями.
Самое неоднозначное задание из всех. MVC был придуман в контексте языка Smalltalk в прошлом веке и уже морально устарел почти для всех gui решений на различных платформах:) Весь фронтенд я решил сделать в таком же олдскульном стиле через модули IIFE и подключение всех исходников js явно через html (никаких бандлеров). Сразу хочется отметить, что "по хорошему" надо было для каждой Вью делать свой Контроллер и Модель, но это сильно бы усложнило логику фронтенда и в совокупности с тем, что задание всё таки на позицию бэк разработчика, я не стал углубляться в доведение архитектуры фронтенда до лучшего состояния
3. Доработать импорт данных: при импорте истории по отсутствующей ценной бумаге выполнять rest запрос к API биржи
Можно импортировать как историю так и список ценных бумаг. Таблица после импорта обновится автоматически. Запрос к API биржы выполняется в соответствии с требованиями в задаче. (Подсказка к проверке: в файле src/config.js находятся пути к импортируемым данным. Можно убрать несколько путей из конфига и импортировать данные через ui. Таким образом не придется искать файлы для проверки)
