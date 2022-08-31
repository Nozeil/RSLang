const sectionStatistics = `
            <section class="statistics content__item">
                <div class="statistics__today">
                    <h2 class="section-title statistics__title">Статистика за сегодня</h2>
                    <div class="statistics__today-item">
                        <p class="statistics__value" id="statistics-learnt">0</p>
                        <p class="statistics__hint">слов изучено</p>
                    </div>
                    <div class="statistics__today-item">
                        <p class="statistics__value"><span id="statistics-percent">0</span>%</p>
                        <p class="statistics__hint">правильных ответов</p>
                    </div>
                </div>
                <div class="statistics__games">
                    <div class="game-stat-el statistics__games-item">
                        <h3 class="game-stat-el__title">Спринт</h3>
                        <div class="game-stat-el__item">
                            <img class="game-stat-el__item-img" src="./public/assets/icons/play.svg" width="30" height="30" alt="learnt">
                            <p class="game-stat-el__item-text">Изучено <span id="sprint-learnt">0</span> слов.</p>
                        </div>
                        <div class="game-stat-el__item">
                            <img class="game-stat-el__item-img" src="./public/assets/icons/play.svg" width="30" height="30" alt="learnt">
                            <p class="game-stat-el__item-text">Правильных ответов: <span id="sprint-right-answers">0</span>%.</p>
                        </div>
                        <div class="game-stat-el__item">
                            <img class="game-stat-el__item-img" src="./public/assets/icons/play.svg" width="30" height="30" alt="learnt">
                            <p class="game-stat-el__item-text">Самая длинная цепочка <span id="sprint-longest-serie">0 </span>слов.</p>
                        </div>
                        <div class="game-stat-el__decor"></div>
                    </div>
                    <div class="game-stat-el statistics__games-item">
                        <h3 class="game-stat-el__title">Аудио вызов</h3>
                        <div class="game-stat-el__item">
                            <img class="game-stat-el__item-img" src="./public/assets/icons/play.svg" width="30" height="30" alt="learnt">
                            <p class="game-stat-el__item-text">Изучено <span id="audiocall-learnt">0</span> слов.</p>
                        </div>
                        <div class="game-stat-el__item">
                            <img class="game-stat-el__item-img" src="./public/assets/icons/play.svg" width="30" height="30" alt="learnt">
                            <p class="game-stat-el__item-text">Правильных ответов: <span id="audiocall-right-answers">0</span>%.</p>
                        </div>
                        <div class="game-stat-el__item">
                            <img class="game-stat-el__item-img" src="./public/assets/icons/play.svg" width="30" height="30" alt="learnt">
                            <p class="game-stat-el__item-text">Самая длинная цепочка <span id="audiocall-longest-serie">0</span> слов.</p>
                        </div>
                        <div class="game-stat-el__decor"></div>
                    </div>
                </div>
                <div class="statistics__total">
                    <h2 class="section-title statistics__total-title">Статистика за всё время</h2>
                    <p class="statistics__total-desc">Статистика доступна только для авторизованных пользователей.</p>
                    <div class="statistics__total-graph-wrap"></div>
                </div>
            </section>`;

export default sectionStatistics;
