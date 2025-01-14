import React, { Component } from "react";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            author: {
                fullName: "Мамута А. М.",
                group: "ПИ22-1",
                university: "Финансовый университет при Правительстве Российской Федерации",
                startDate: "25 Декабря 2024",
                endDate: "15 Января 2025",
                experience: [
                    {
                        title: "Back-end (Spring)",
                        details: `
                            Разработка серверной части с использованием Spring Framework. 
                            Реализованы REST API для обработки запросов и взаимодействия с клиентом. 
                            Применение Spring Boot для ускорения разработки, настройки безопасности (Spring Security), 
                            а также управления базой данных через JPA/Hibernate. Настроены интеграционные и модульные тесты для обеспечения надежности.
                        `,
                    },
                    {
                        title: "Front-end (React + Bootstrap)",
                        details: `
                            Создание динамичного и отзывчивого интерфейса с помощью React. 
                            Использованы компоненты Bootstrap для адаптивного дизайна, обеспечивая удобство пользователя на различных устройствах. 
                            Внедрена работа с API, поддержка маршрутизации (React Router), управление состоянием (Redux или Context API).
                        `,
                    },
                    {
                        title: "Интеграция",
                        details: `
                            Полная интеграция фронтенда и бэкенда через REST API. 
                            Реализована аутентификация и авторизация (JWT, OAuth2). 
                            Для сборки проекта и управления зависимостями использован Gradle, что обеспечивает удобство в конфигурации и развертывании.
                        `,
                    },
                ],
            },
        };
    }

    render() {
        const { fullName, group, university, startDate, endDate, experience } = this.state.author;

        return (
            <div className="col-md-12">
                <div className="card">
                    <div className="card-header text-center">
                        <h1>Информация об авторе</h1>
                    </div>
                    <div className="card-body">
                        <div className="card-text mb-3">
                            <h3>Общая информация</h3>
                            <p className="h6 mt-3">
                                <strong>ФИО:</strong> {fullName}
                            </p>
                            <p className="h6 mt-3">
                                <strong>Группа/учебное заведение:</strong> {group}, {university}
                            </p>
                            <p className="h6 mt-3">
                                <strong>Дата начала работы:</strong> {startDate}
                            </p>
                            <p className="h6 mt-3">
                                <strong>Дата окончания работы:</strong> {endDate}
                            </p>
                        </div>
                        <hr/>
                        <div className="card-text">
                            <h3>Опыт работы с технологиями</h3>
                            <ul>
                                {experience.map((item, index) => (
                                    <li key={index} className="mb-2">
                                        <h4>{item.title}</h4>
                                        <p className="fs-6">{item.details}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;
