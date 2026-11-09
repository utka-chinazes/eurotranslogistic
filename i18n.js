/**
 * EuroTrans: Логістика Європи - Система локалізації (i18n)
 * Підтримувані мови:
 * - 'sk': Slovenčina (Словацька)
 * - 'uk': Українська (Українська)
 * - 'en': English (Англійська)
 * - 'de': Deutsch (Німецька)
 */

const I18N = {
  // =========================================================================
  // УКРАЇНСЬКА (UK)
  // =========================================================================
  uk: {
    // Бренд та рівень
    brand_subtitle: "Logistics",
    company_tier_starter: "Стартап-перевізник",
    company_tier_regional: "Регіональний оператор",
    company_tier_national: "Національний перевізник",
    company_tier_international: "Міжнародна мережа",
    company_tier_leader: "Транспортний магнат Європи",

    // Статистика у верхній панелі
    stat_capital: "Капітал",
    stat_reputation: "Репутація",
    stat_garages_fleet: "Гаражі / Флот",
    stat_drivers: "Штат водіїв",
    stat_deliveries: "Доставки",
    stat_game_time: "Ігровий час",
    day_prefix: "День",
    vehicles_unit: "авт",
    drivers_unit: "вод",
    in_transit_short: "В рейсі",

    // Кнопки управління
    btn_pause_title: "Пауза / Заморозка мапи",
    btn_sound_title: "Звук / Без звуку",
    btn_help_title: "Довідка та правила",
    btn_reset_title: "Почати заново",
    btn_lang_title: "Змінити мову",

    // Вкладки сайдбару
    tab_contracts: "📋 Замовлення",
    tab_fleet: "🚚 Автопарк",
    tab_shop: "🛒 Автосалон",
    tab_garages: "🏠 Гаражі",
    tab_drivers: "👔 Водії",
    tab_upgrades: "⚡ Апгрейди",

    // Вкладка: Замовлення
    contracts_title: "Доступні рейси",
    contracts_hint: "Оберіть рейс, призначте транспорт та отримуйте прибуток",
    filter_all: "Всі типи",
    filter_express: "⚡ Експрес",
    filter_heavy: "📦 Надважкі",
    empty_contracts_hint: "Немає замовлень за обраним фільтром.<br>Зачекайте надходження нових рейсів або оберіть інше місто на мапі.",
    contract_btn_accept: "Прийняти",
    contract_dist_label: "км",
    contract_deadline_label: "Час:",

    // Вкладка: Автопарк
    fleet_title: "Ваш активний автопарк",
    fleet_hint: "Моніторинг рейсів, локація та статус техніки",
    status_idle: "Вільний",
    status_moving_to_pickup: "Подача на базу",
    status_loading: "Завантаження...",
    status_in_transit: "У дорозі ➔",
    status_unloading: "Розвантаження...",
    driver_assigned: "Водій:",
    driver_not_assigned: "Водія не закріплено",
    location_label: "Локація:",
    course_to_label: "Курс до:",
    route_label: "Рейс:",
    in_hub_label: "У хабі:",
    in_dest_label: "У пункті:",
    speed_label: "Швидкість:",
    capacity_to: "до",
    tons_short: "т",

    // Вкладка: Автосалон
    shop_title: "Європейський автосалон",
    shop_hint: "Фургони, далекобійні тягачі TIR, товарні потяги та літаки",
    spec_capacity: "Вантажопідйомність:",
    spec_speed: "Швидкість:",
    spec_fuel: "Витрати палива:",
    spec_network: "Тип шляху:",
    net_road: "🛣️ Шосе",
    net_rail: "🚂 Залізниця",
    net_air: "✈️ Авіа",
    btn_buy_vehicle: "🛒 Придбати",
    btn_no_garage_slots: "Немає місць у гаражах",
    btn_not_enough_funds: "Недостатньо коштів",

    // Вкладка: Гаражі
    garages_title: "Гаражна мережа Європи",
    garages_hint: "Бази для стоянки флоту та бонуси до прибутків",
    garages_summary_title: "🏠 Мережа баз та ангарів",
    garages_slots_label: "Слоти:",
    garages_owned_count: "Власних хабів:",
    garages_capacity_used: "Завантаження:",
    garages_owned_section: "Власні гаражні комплекси",
    garages_available_section: "Відкрити новий гараж у Європі (€10,000)",
    garage_level_label: "Рівень",
    garage_slots_info: "Машиномісць:",
    garage_parked_here: "Припарковано тут:",
    garage_perk_label: "Бонус:",
    garage_btn_upgrade: "🏗️ Модернізувати до Рівня",
    garage_max_badge: "⭐ МАКСИМАЛЬНИЙ АНГАР",
    garage_btn_buy: "+ Купити базу",

    // Вкладка: Водії
    drivers_title: "Персонал та біржа праці",
    drivers_hint: "Найм спеціалістів, кваліфікація та прокачування досвіду",
    subtab_my_drivers: "Мої водії",
    subtab_recruit_drivers: "Біржа праці",
    driver_empty_my: "У вас немає найманих водіїв. Перейдіть у вкладку «Біржа праці» для найму!",
    driver_empty_market: "На біржі праці наразі немає кандидатів.",
    driver_stat_speed: "Швидкість:",
    driver_stat_fuel: "Економія пального:",
    driver_stat_salary: "Зарплата за рейс:",
    driver_stat_cost: "Вартість найму:",
    driver_stat_xp: "Досвід:",
    driver_btn_hire: "🤝 Найняти",
    driver_btn_fire: "Звільнити",
    driver_assigned_veh_label: "Закріплений транспорт:",
    driver_unassigned_opt: "-- Без призначення (В резерві) --",
    driver_xp_progress: "XP Прогрес:",

    // Вкладка: Апгрейди
    upgrades_title: "Технологічний розвиток",
    upgrades_hint: "Стратегічні компроміси та корпоративні покращення",
    tradeoffs_header: "⚡ Стратегічні компроміси (Плюс / Мінус)",
    tradeoffs_hint: "Дають потужний стрибок в одній сфері, але мають технологічні або фінансові мінуси.",
    regular_upgrades_header: "🏢 Корпоративні технології",
    btn_unlock_tradeoff: "Розблокувати:",
    btn_active_tradeoff: "🟢 АКТИВНО (Вимкнути)",
    btn_inactive_tradeoff: "⚪ ВИМКНЕНО (Увімкнути)",
    upgrade_max_label: "МАКСИМУМ",
    upgrade_level_prefix: "Рівень:",

    // Мапа та статус-бар
    map_legend_road: "Автобан",
    map_legend_rail: "Залізниця",
    map_legend_air: "Авіакоридор",
    map_hint_default: "Натисніть на місто або маршрут для деталей",
    map_hub_selected: "📍 Обрано хаб:",
    btn_reset_city_filter: "(Скинути ✕)",
    map_frozen_banner: "Мапу заморожено (симуляція триває)",
    btn_unfreeze_map: "Розморозити ❄️",
    active_routes_label: "Активні рейси",
    empty_routes_hint: "Немає транспорту в дорозі. Прийміть замовлення у вкладці контрактів!",
    ticker_label: "Новини Європи:",
    ticker_default: "Логістичні артерії Європи працюють у штатному режимі. Ласкаво просимо в EuroTrans!",

    // Модальне вікно призначення
    assign_modal_title: "Призначити транспорт на контракт",
    assign_route_label: "Маршрут:",
    assign_cargo_label: "Вантаж:",
    assign_weight_label: "Вага:",
    assign_reward_label: "Винагорода:",
    assign_deadline_label: "Дедлайн:",
    assign_choose_vehicle: "Оберіть доступний транспортний засіб:",
    assign_btn_select: "Обрати",

    // Модальне вікно допомоги
    help_modal_title: "Довідка та правила EuroTrans Logistics",
    help_section_about: "Мета гри",
    help_text_about: "Ви очолюєте логістичну компанію в Європі. Заробляйте кошти, купуйте гаражі, розвивайте флот та наймайте водіїв для створення найпотужнішої транспортної імперії!",
    help_sec_vans: "Фургони",
    help_sec_vans_desc: "Швидкі та дешеві буси. Ідеальні для легких і термінових замовлень до 3.5 тонн.",
    help_sec_trucks: "Тягачі (TIR)",
    help_sec_trucks_desc: "Основний транспорт магістралей. Висока місткість (до 32 тонн) та солідний прибуток.",
    help_sec_trains: "Вантажні потяги",
    help_sec_trains_desc: "Курсують залізничною мережею. Перевозять величезні партії (до 75 тонн) за мінімальну собівартість.",
    help_sec_planes: "Вантажні літаки",
    help_sec_planes_desc: "Миттєвий переліт між авіахабами континенту. Дорогі, але ідеальні для VIP-рейсів!",
    help_tips_title: "Поради диспетчера",
    help_tip_1: "Слідкуйте за дедлайнами: запізнення призводить до штрафів та падіння репутації!",
    help_tip_2: "Купуйте гаражі в різних містах: це відкриває нові слоти для техніки та дає до +25% бонусу доходу.",
    help_tip_3: "Наймайте водіїв на біржі праці: з кожним рейсом вони отримують XP та підвищують швидкість флоту.",
    help_tip_4: "Використовуйте компромісні апгрейди з розумом — налаштовуйте їх під поточну ситуацію.",
    btn_got_it: "Зрозуміло, до гри!",
    btn_restart_tut_help: "Пройти навчання знову",
    btn_open_help: "Правила та довідка",
    pause_theme_section: "Вигляд інтерфейсу",
    setting_theme_label: "Світла тема",
    setting_theme_sub: "Перемкнути між темним і світлим відображенням",

    // Модальне вікно паузи
    pause_modal_title: "Меню паузи",
    pause_modal_hint: "Гра призупинена",
    btn_resume_game: "Продовжити гру",
    pause_audio_section: "Налаштування аудіо",
    pause_lang_section: "Мова гри (Language / Jazyk / Sprache)",
    setting_volume: "Гучність звуку",
    setting_sound_effects: "Звукові ефекти",
    setting_sound_sub: "Двигуни, клаксон, попередження",
    btn_test_sound: "Тест",
    pause_danger_section: "Скинути прогрес",
    pause_danger_desc: "Почати заново з початковим капіталом €25,000.",
    btn_restart_game_pause: "Почати нову гру",
    esc_hint: "Підказка: натисніть Esc для швидкого перемикання меню паузи",

    // Туторіал
    tut_step_prefix: "Крок",
    tut_from: "з",
    btn_skip_tutorial: "Пропустити ✕",
    btn_tut_prev: "Назад",
    btn_tut_next: "Далі ➔",
    btn_tut_finish: "Вперед до гри! 🚀",

    // Повідомлення (Toasts)
    toast_sound_on: "Звук увімкнено",
    toast_sound_off: "Звук вимкнено",
    toast_new_game: "Розпочато нову гру!",
    toast_lang_changed: "Мову інтерфейсу змінено на Українську",
    toast_confirm_reset: "Справді почати нову логістичну компанію з нуля? Весь флот, баланс і статистика будуть скинуті.",
    toast_garage_bought: "Придбано новий гараж у місті",
    toast_garage_upgraded: "Гараж модернізовано до рівня",
    toast_driver_hired: "Найнято нового співробітника:",
    toast_driver_fired: "Водія звільнено:",
    toast_driver_assigned: "Водія закріплено за машиною",
    toast_contract_expired: "⌛ Замовлення {cargo} знято через вичерпаний дедлайн",
    toast_trip_late_insured: "🛡️ Поліс Allianz покрив запізнення рейсу! Повна виплата: +€{payout}",
    toast_trip_late: "⚠️ Запізнення рейсу! Виплата урізана: +€{payout}",
    toast_trip_success: "🎉 Доставка успішна: {cargo} у м. {city}! +€{payout}",
    toast_vehicle_loaded: "🚚 {vehicle} завантажено в м. {city} і виїхав!",
    toast_vehicle_arrived_pickup: "🚚 {vehicle} прибув на завантаження в м. {city}",
    toast_driver_levelup: "⭐ Водій {driver} підвищив рівень до {level}! Навички покращено.",
    toast_ai_fee: "🤖 Списано щоденне обслуговування AI-диспетчера: -€400",
    toast_vehicle_in_transit: "Транспорт зараз перебуває в рейсі!",
    toast_qual_mismatch: "Кваліфікація водія не відповідає типу цього транспорту!",
    toast_vehicle_bought: "🛒 Придбано новий транспорт: {name}!"
  },

  // =========================================================================
  // СЛОВАЦЬКА (SK)
  // =========================================================================
  sk: {
    // Brand & Tier
    brand_subtitle: "Logistics",
    company_tier_starter: "Začínajúci dopravca",
    company_tier_regional: "Regionálny operátor",
    company_tier_national: "Národný dopravca",
    company_tier_international: "Medzinárodná sieť",
    company_tier_leader: "Európsky dopravný magnát",

    // Top Stats
    stat_capital: "Kapitál",
    stat_reputation: "Reputácia",
    stat_garages_fleet: "Garáže / Flotila",
    stat_drivers: "Vodiči",
    stat_deliveries: "Dodávky",
    stat_game_time: "Herný čas",
    day_prefix: "Deň",
    vehicles_unit: "voz",
    drivers_unit: "vod",
    in_transit_short: "Na ceste",

    // Controls
    btn_pause_title: "Pauza / Zmrazenie mapy",
    btn_sound_title: "Zvuk / Bez zvuku",
    btn_help_title: "Pomocník a pravidlá",
    btn_reset_title: "Začať odznova",
    btn_lang_title: "Zmeniť jazyk",

    // Tabs
    tab_contracts: "📋 Zákazky",
    tab_fleet: "🚚 Flotila",
    tab_shop: "🛒 Predajňa",
    tab_garages: "🏠 Garáže",
    tab_drivers: "👔 Vodiči",
    tab_upgrades: "⚡ Vylepšenia",

    // Contracts Tab
    contracts_title: "Dostupné zákazky",
    contracts_hint: "Vyberte trasu, priraďte vozidlo a získajte odmenu",
    filter_all: "Všetky typy",
    filter_express: "⚡ Expres",
    filter_heavy: "📦 Ťažký náklad",
    empty_contracts_hint: "Pre zvolený filter nie sú žiadne zákazky.<br>Počkajte na nové trasy alebo vyberte iné mesto na mape.",
    contract_btn_accept: "Prijať",
    contract_dist_label: "km",
    contract_deadline_label: "Termín:",

    // Fleet Tab
    fleet_title: "Vozový park v prevádzke",
    fleet_hint: "Sledovanie trás, poloha a stav vozidiel",
    status_idle: "Voľný",
    status_moving_to_pickup: "Presun na nakládku",
    status_loading: "Nakladanie...",
    status_in_transit: "Na ceste ➔",
    status_unloading: "Vykladanie...",
    driver_assigned: "Vodič:",
    driver_not_assigned: "Vodič nie je priradený",
    location_label: "Poloha:",
    course_to_label: "Smer:",
    route_label: "Trasa:",
    in_hub_label: "V uzle:",
    in_dest_label: "V cieli:",
    speed_label: "Rýchlosť:",
    capacity_to: "do",
    tons_short: "t",

    // Shop Tab
    shop_title: "Európsky autosalón",
    shop_hint: "Dodávky, diaľkové TIR ťahače, nákladné vlaky a lietadlá",
    spec_capacity: "Nosnosť:",
    spec_speed: "Rýchlosť:",
    spec_fuel: "Spotreba paliva:",
    spec_network: "Druh dopravy:",
    net_road: "🛣️ Cesta",
    net_rail: "🚂 Železnica",
    net_air: "✈️ Letecky",
    btn_buy_vehicle: "🛒 Kúpiť",
    btn_no_garage_slots: "Nedostatok miesta v garážach",
    btn_not_enough_funds: "Nedostatok financií",

    // Garages Tab
    garages_title: "Sieť garáží v Európe",
    garages_hint: "Základne na parkovanie flotily a bonusy k ziskom",
    garages_summary_title: "🏠 Sieť základní a hangárov",
    garages_slots_label: "Sloty:",
    garages_owned_count: "Vlastné uzly:",
    garages_capacity_used: "Vyťaženosť:",
    garages_owned_section: "Vlastné garážové komplexy",
    garages_available_section: "Otvoriť novú garáž v Európe (€10,000)",
    garage_level_label: "Úroveň",
    garage_slots_info: "Kapacita miest:",
    garage_parked_here: "Zaparkované tu:",
    garage_perk_label: "Bonus:",
    garage_btn_upgrade: "🏗️ Modernizovať na Úroveň",
    garage_max_badge: "⭐ MAXIMÁLNY HANGÁR",
    garage_btn_buy: "+ Kúpiť základňu",

    // Drivers Tab
    drivers_title: "Personál a trh práce",
    drivers_hint: "Nábor vodičov, kvalifikácie a zbieranie skúseností",
    subtab_my_drivers: "Moji vodiči",
    subtab_recruit_drivers: "Trh práce",
    driver_empty_my: "Nemáte žiadnych najatých vodičov. Prejdite na záložku «Trh práce»!",
    driver_empty_market: "Na trhu práce momentálne nie sú žiadni uchádzači.",
    driver_stat_speed: "Rýchlosť:",
    driver_stat_fuel: "Úspora paliva:",
    driver_stat_salary: "Plat za jazdu:",
    driver_stat_cost: "Náborový poplatok:",
    driver_stat_xp: "Skúsenosti:",
    driver_btn_hire: "🤝 Najať",
    driver_btn_fire: "Prepustiť",
    driver_assigned_veh_label: "Priradené vozidlo:",
    driver_unassigned_opt: "-- Bez priradenia (V rezerve) --",
    driver_xp_progress: "XP Pokrok:",

    // Upgrades Tab
    upgrades_title: "Technologický rozvoj",
    upgrades_hint: "Strategické kompromisy a korporátne vylepšenia",
    tradeoffs_header: "⚡ Strategické kompromisy (Výhody / Nevýhody)",
    tradeoffs_hint: "Poskytujú obrovskú výhodu v jednej oblasti za cenu obmedzení v inej.",
    regular_upgrades_header: "🏢 Korporátne technológie",
    btn_unlock_tradeoff: "Odomknúť:",
    btn_active_tradeoff: "🟢 AKTÍVNE (Vypnúť)",
    btn_inactive_tradeoff: "⚪ VYPNUTÉ (Zapnúť)",
    upgrade_max_label: "MAXIMUM",
    upgrade_level_prefix: "Úroveň:",

    // Map & Status Bar
    map_legend_road: "Diaľnica",
    map_legend_rail: "Železnica",
    map_legend_air: "Letecký koridor",
    map_hint_default: "Kliknite na mesto alebo trasu pre podrobnosti",
    map_hub_selected: "📍 Vybraný uzol:",
    btn_reset_city_filter: "(Zrušiť ✕)",
    map_frozen_banner: "Mapa pozastavená (simulácia beží)",
    btn_unfreeze_map: "Odmraziť ❄️",
    active_routes_label: "Aktívne trasy",
    empty_routes_hint: "Žiadne vozidlá na cestách. Prijmite zákazku v zozname!",
    ticker_label: "Správy z Európy:",
    ticker_default: "Logistické tepny Európy fungujú v bežnom režime. Vitajte v EuroTrans!",

    // Assign Modal
    assign_modal_title: "Priradiť vozidlo k zákazke",
    assign_route_label: "Trasa:",
    assign_cargo_label: "Náklad:",
    assign_weight_label: "Hmotnosť:",
    assign_reward_label: "Odmena:",
    assign_deadline_label: "Termín:",
    assign_choose_vehicle: "Vyberte dostupné vozidlo:",
    assign_btn_select: "Zvoliť",

    // Help Modal
    help_modal_title: "Návod a pravidlá EuroTrans Logistics",
    help_section_about: "Cieľ hry",
    help_text_about: "Riadite dopravnú spoločnosť v Európe. Zarábajte peniaze, kupujte garáže, rozširujte flotilu a najímajte vodičov pre vybudovanie najlepšej logistickej siete!",
    help_sec_vans: "Dodávky",
    help_sec_vans_desc: "Rýchle a lacné dodávky. Vynikajúce na ľahké a expresné zásielky do 3.5 tony.",
    help_sec_trucks: "Ťahače (TIR)",
    help_sec_trucks_desc: "Chrbtová kosť diaľnic. Vysoká nosnosť (až 32 ton) a stabilný vysoký zisk.",
    help_sec_trains: "Nákladné vlaky",
    help_sec_trains_desc: "Jazdia po železničnej sieti. Prepravujú obrovské objemy (až 75 ton) s nízkymi nákladmi.",
    help_sec_planes: "Nákladné lietadlá",
    help_sec_planes_desc: "Okamžitý prelet medzi letiskami kontinentu. Drahé, ale ideálne pre VIP zákazky!",
    help_tips_title: "Rady dispečera",
    help_tip_1: "Sledujte termíny: meškanie znamená pokutu a stratu reputácie!",
    help_tip_2: "Kupujte garáže v rôznych mestách: získate nové sloty a až +25% bonus k odmenám.",
    help_tip_3: "Najímajte vodičov: každou jazdou získavajú XP a zrýchľujú prepravu.",
    help_tip_4: "Používajte kompromisné vylepšenia strategicky podľa vašich cieľov.",
    btn_got_it: "Rozumiem, poďme hrať!",
    btn_restart_tut_help: "Spustiť tutoriál znova",
    btn_open_help: "Pravidlá a pomocník",
    pause_theme_section: "Vzhľad rozhrania",
    setting_theme_label: "Svetlá téma",
    setting_theme_sub: "Prepnúť medzi tmavým a svetlým zobrazením",

    // Pause Modal
    pause_modal_title: "Menu pauzy",
    pause_modal_hint: "Hra je pozastavená",
    btn_resume_game: "Pokračovať v hre",
    pause_audio_section: "Nastavenia audia",
    pause_lang_section: "Jazyk hry (Jazyk / Language / Sprache)",
    setting_volume: "Hlasitosť zvuku",
    setting_sound_effects: "Zvukové efekty",
    setting_sound_sub: "Motory, klaksón, varovania",
    btn_test_sound: "Test",
    pause_danger_section: "Reštartovať hru",
    pause_danger_desc: "Začať odznova s počiatočným kapitálom €25,000.",
    btn_restart_game_pause: "Spustiť novú hru",
    esc_hint: "Tip: stlačte kláves Esc pre rýchle otvorenie menu pauzy",

    // Tutorial
    tut_step_prefix: "Krok",
    tut_from: "z",
    btn_skip_tutorial: "Preskočiť ✕",
    btn_tut_prev: "Späť",
    btn_tut_next: "Ďalej ➔",
    btn_tut_finish: "Vpred do hry! 🚀",

    // Toasts
    toast_sound_on: "Zvuk zapnutý",
    toast_sound_off: "Zvuk vypnutý",
    toast_new_game: "Nová hra spustená!",
    toast_lang_changed: "Jazyk rozhrania zmenený na Slovenčinu",
    toast_confirm_reset: "Naozaj chcete začať novú hru od nuly? Celá flotila a štatistiky budú resetované.",
    toast_garage_bought: "Kúpená nová garáž v meste",
    toast_garage_upgraded: "Garáž modernizovaná na úroveň",
    toast_driver_hired: "Prijatý nový zamestnanec:",
    toast_driver_fired: "Vodič prepustený:",
    toast_driver_assigned: "Vodič priradený k vozidlu",
    toast_contract_expired: "⌛ Zákazka {cargo} bola zrušená z dôvodu vypršania termínu",
    toast_trip_late_insured: "🛡️ Poistka Allianz pokryla meškanie! Plná platba: +€{payout}",
    toast_trip_late: "⚠️ Meškanie zásielky! Odmena krátená: +€{payout}",
    toast_trip_success: "🎉 Úspešné doručenie: {cargo} do mesta {city}! +€{payout}",
    toast_vehicle_loaded: "🚚 {vehicle} naložené v meste {city} a vyrazilo na cestu!",
    toast_vehicle_arrived_pickup: "🚚 {vehicle} dorazilo na nakládku v meste {city}",
    toast_driver_levelup: "⭐ Vodič {driver} postúpil na úroveň {level}! Zručnosti vylepšené.",
    toast_ai_fee: "🤖 Zaúčtovaný denný poplatok za AI dispečera: -€400",
    toast_vehicle_in_transit: "Vozidlo je momentálne na trase!",
    toast_qual_mismatch: "Kvalifikácia vodiča nezodpovedá typu tohto vozidla!",
    toast_vehicle_bought: "🛒 Zakúpené nové vozidlo: {name}!"
  },

  // =========================================================================
  // АНГЛІЙСЬКА (EN)
  // =========================================================================
  en: {
    // Brand & Tier
    brand_subtitle: "Logistics",
    company_tier_starter: "Startup Haulier",
    company_tier_regional: "Regional Operator",
    company_tier_national: "National Carrier",
    company_tier_international: "International Network",
    company_tier_leader: "European Transport Tycoon",

    // Top Stats
    stat_capital: "Capital",
    stat_reputation: "Reputation",
    stat_garages_fleet: "Garages / Fleet",
    stat_drivers: "Drivers",
    stat_deliveries: "Deliveries",
    stat_game_time: "Game Time",
    day_prefix: "Day",
    vehicles_unit: "veh",
    drivers_unit: "drv",
    in_transit_short: "In Transit",

    // Controls
    btn_pause_title: "Pause / Freeze Map",
    btn_sound_title: "Sound / Mute",
    btn_help_title: "Help & Rules",
    btn_reset_title: "Restart Game",
    btn_lang_title: "Change Language",

    // Tabs
    tab_contracts: "📋 Contracts",
    tab_fleet: "🚚 Fleet",
    tab_shop: "🛒 Dealership",
    tab_garages: "🏠 Garages",
    tab_drivers: "👔 Drivers",
    tab_upgrades: "⚡ Upgrades",

    // Contracts Tab
    contracts_title: "Available Contracts",
    contracts_hint: "Choose a consignment, assign transport and generate revenue",
    filter_all: "All Types",
    filter_express: "⚡ Express",
    filter_heavy: "📦 Heavy Haul",
    empty_contracts_hint: "No contracts available for the selected filter.<br>Wait for new dispatches or choose another city on the map.",
    contract_btn_accept: "Accept",
    contract_dist_label: "km",
    contract_deadline_label: "Deadline:",

    // Fleet Tab
    fleet_title: "Active Fleet Vehicles",
    fleet_hint: "Route tracking, vehicle locations and live status",
    status_idle: "Idle",
    status_moving_to_pickup: "Repositioning",
    status_loading: "Loading...",
    status_in_transit: "In Transit ➔",
    status_unloading: "Unloading...",
    driver_assigned: "Driver:",
    driver_not_assigned: "No driver assigned",
    location_label: "Location:",
    course_to_label: "En route to:",
    route_label: "Route:",
    in_hub_label: "At hub:",
    in_dest_label: "At destination:",
    speed_label: "Speed:",
    capacity_to: "up to",
    tons_short: "t",

    // Shop Tab
    shop_title: "European Vehicle Dealership",
    shop_hint: "Vans, long-haul TIR trucks, freight trains and cargo planes",
    spec_capacity: "Payload Capacity:",
    spec_speed: "Top Speed:",
    spec_fuel: "Fuel Consumption:",
    spec_network: "Transport Network:",
    net_road: "🛣️ Motorway",
    net_rail: "🚂 Railway",
    net_air: "✈️ Air Cargo",
    btn_buy_vehicle: "🛒 Purchase",
    btn_no_garage_slots: "Garage capacity full",
    btn_not_enough_funds: "Insufficient funds",

    // Garages Tab
    garages_title: "European Garage Network",
    garages_hint: "Depots to house your fleet and earn localized bonuses",
    garages_summary_title: "🏠 Base & Hangar Network",
    garages_slots_label: "Slots:",
    garages_owned_count: "Owned Hubs:",
    garages_capacity_used: "Capacity Used:",
    garages_owned_section: "Owned Garage Facilities",
    garages_available_section: "Open New Garage in Europe (€10,000)",
    garage_level_label: "Level",
    garage_slots_info: "Vehicle Slots:",
    garage_parked_here: "Parked here:",
    garage_perk_label: "Perk:",
    garage_btn_upgrade: "🏗️ Upgrade to Level",
    garage_max_badge: "⭐ MAXIMUM HANGAR",
    garage_btn_buy: "+ Purchase Base",

    // Drivers Tab
    drivers_title: "Staff & Labor Market",
    drivers_hint: "Recruitment, driver licensing and XP progression",
    subtab_my_drivers: "My Drivers",
    subtab_recruit_drivers: "Labor Market",
    driver_empty_my: "You have no employed drivers. Visit the «Labor Market» tab to recruit!",
    driver_empty_market: "No driver candidates currently seeking employment.",
    driver_stat_speed: "Speed Bonus:",
    driver_stat_fuel: "Fuel Efficiency:",
    driver_stat_salary: "Per-Trip Wage:",
    driver_stat_cost: "Signing Bonus:",
    driver_stat_xp: "Experience:",
    driver_btn_hire: "🤝 Hire",
    driver_btn_fire: "Dismiss",
    driver_assigned_veh_label: "Assigned Vehicle:",
    driver_unassigned_opt: "-- Unassigned (In Reserve) --",
    driver_xp_progress: "XP Progress:",

    // Upgrades Tab
    upgrades_title: "Technology & Development",
    upgrades_hint: "Strategic trade-offs and enterprise tech upgrades",
    tradeoffs_header: "⚡ Strategic Trade-Offs (Pros & Cons)",
    tradeoffs_hint: "Offer massive operational boosts balanced by specific operational or financial handicaps.",
    regular_upgrades_header: "🏢 Corporate Technologies",
    btn_unlock_tradeoff: "Unlock:",
    btn_active_tradeoff: "🟢 ACTIVE (Disable)",
    btn_inactive_tradeoff: "⚪ INACTIVE (Enable)",
    upgrade_max_label: "MAXIMUM",
    upgrade_level_prefix: "Level:",

    // Map & Status Bar
    map_legend_road: "Motorway",
    map_legend_rail: "Railway",
    map_legend_air: "Air Corridor",
    map_hint_default: "Click any city or route for details",
    map_hub_selected: "📍 Selected Hub:",
    btn_reset_city_filter: "(Clear ✕)",
    map_frozen_banner: "Map Frozen (simulation running)",
    btn_unfreeze_map: "Unfreeze ❄️",
    active_routes_label: "Active Routes",
    empty_routes_hint: "No transport currently en route. Accept orders from the contracts tab!",
    ticker_label: "Europe News:",
    ticker_default: "Logistics corridors across Europe operate smoothly. Welcome to EuroTrans!",

    // Assign Modal
    assign_modal_title: "Assign Vehicle to Contract",
    assign_route_label: "Route:",
    assign_cargo_label: "Cargo:",
    assign_weight_label: "Weight:",
    assign_reward_label: "Reward:",
    assign_deadline_label: "Deadline:",
    assign_choose_vehicle: "Select an available vehicle:",
    assign_btn_select: "Select",

    // Help Modal
    help_modal_title: "EuroTrans Logistics Guide & Rules",
    help_section_about: "Game Objective",
    help_text_about: "You run a pan-European freight company. Earn capital, acquire garages, scale up your fleet and hire elite drivers to become the continent's dominant carrier!",
    help_sec_vans: "Cargo Vans",
    help_sec_vans_desc: "Agile, cost-efficient vans. Perfect for lightweight, urgent orders up to 3.5 tons.",
    help_sec_trucks: "TIR Semitrucks",
    help_sec_trucks_desc: "Backbone of motorways. High capacity (up to 32 tons) and dependable, high-yield revenue.",
    help_sec_trains: "Freight Locomotives",
    help_sec_trains_desc: "Travel dedicated rail corridors. Haul massive consignments (up to 75 tons) at rock-bottom unit costs.",
    help_sec_planes: "Cargo Jetliners",
    help_sec_planes_desc: "Rapid transit between continental hubs in seconds. High cost, but ideal for lucrative VIP cargo!",
    help_tips_title: "Dispatcher Best Practices",
    help_tip_1: "Watch deadlines carefully: delays trigger financial penalties and reputation loss!",
    help_tip_2: "Establish garages across multiple hubs: expands fleet capacity and boosts payouts by up to +25%.",
    help_tip_3: "Hire and nurture drivers: every completed trip awards XP that unlocks faster speeds and fuel savings.",
    help_tip_4: "Toggle strategic trade-offs flexibly to counter changing logistics conditions.",
    btn_got_it: "Understood, let's play!",
    btn_restart_tut_help: "Replay Tutorial",
    btn_open_help: "Rules & Guide",
    pause_theme_section: "Interface Appearance",
    setting_theme_label: "Light Theme",
    setting_theme_sub: "Switch between dark and light display mode",

    // Pause Modal
    pause_modal_title: "Pause Menu",
    pause_modal_hint: "Game is paused",
    btn_resume_game: "Resume Game",
    pause_audio_section: "Audio Settings",
    pause_lang_section: "Game Language (Мова / Jazyk / Sprache)",
    setting_volume: "Master Volume",
    setting_sound_effects: "Sound Effects",
    setting_sound_sub: "Engines, horn, dispatch alerts",
    btn_test_sound: "Test",
    pause_danger_section: "Reset Progress",
    pause_danger_desc: "Restart company fresh with initial seed capital of €25,000.",
    btn_restart_game_pause: "Start New Game",
    esc_hint: "Tip: press Esc to quickly open or close the pause menu",

    // Tutorial
    tut_step_prefix: "Step",
    tut_from: "of",
    btn_skip_tutorial: "Skip ✕",
    btn_tut_prev: "Back",
    btn_tut_next: "Next ➔",
    btn_tut_finish: "Start Playing! 🚀",

    // Toasts
    toast_sound_on: "Audio enabled",
    toast_sound_off: "Audio muted",
    toast_new_game: "New company founded!",
    toast_lang_changed: "Interface language switched to English",
    toast_confirm_reset: "Are you sure you want to reset your logistics company? All fleet and progress will be lost.",
    toast_garage_bought: "Acquired new garage base in",
    toast_garage_upgraded: "Garage facility upgraded to Level",
    toast_driver_hired: "Hired new driver:",
    toast_driver_fired: "Driver dismissed:",
    toast_driver_assigned: "Driver assigned to vehicle",
    toast_contract_expired: "⌛ Contract {cargo} cancelled due to deadline expiration",
    toast_trip_late_insured: "🛡️ Allianz policy covered the delay! Full payout: +€{payout}",
    toast_trip_late: "⚠️ Delivery delayed! Payout penalized: +€{payout}",
    toast_trip_success: "🎉 Delivery successful: {cargo} to {city}! +€{payout}",
    toast_vehicle_loaded: "🚚 {vehicle} loaded in {city} and departed!",
    toast_vehicle_arrived_pickup: "🚚 {vehicle} arrived for pickup in {city}",
    toast_driver_levelup: "⭐ Driver {driver} leveled up to {level}! Skills upgraded.",
    toast_ai_fee: "🤖 Deducted daily AI dispatcher fee: -€400",
    toast_vehicle_in_transit: "Vehicle is currently in transit!",
    toast_qual_mismatch: "Driver qualification does not match this vehicle type!",
    toast_vehicle_bought: "🛒 Purchased new vehicle: {name}!"
  },

  // =========================================================================
  // НІМЕЦЬКА (DE)
  // =========================================================================
  de: {
    // Brand & Tier
    brand_subtitle: "Logistics",
    company_tier_starter: "Startup-Spedition",
    company_tier_regional: "Regionaler Spediteur",
    company_tier_national: "Nationales Transportunternehmen",
    company_tier_international: "Internationales Netzwerk",
    company_tier_leader: "Europäischer Logistik-Tycoon",

    // Top Stats
    stat_capital: "Kapital",
    stat_reputation: "Reputation",
    stat_garages_fleet: "Garagen / Flotte",
    stat_drivers: "Fahrer",
    stat_deliveries: "Lieferungen",
    stat_game_time: "Spielzeit",
    day_prefix: "Tag",
    vehicles_unit: "Fzg",
    drivers_unit: "Fhr",
    in_transit_short: "Unterwegs",

    // Controls
    btn_pause_title: "Pause / Karte einfrieren",
    btn_sound_title: "Ton / Stumm",
    btn_help_title: "Hilfe & Regeln",
    btn_reset_title: "Neustart",
    btn_lang_title: "Sprache ändern",

    // Tabs
    tab_contracts: "📋 Aufträge",
    tab_fleet: "🚚 Fuhrpark",
    tab_shop: "🛒 Fahrzeughandel",
    tab_garages: "🏠 Garagen",
    tab_drivers: "👔 Fahrer",
    tab_upgrades: "⚡ Upgrades",

    // Contracts Tab
    contracts_title: "Verfügbare Frachtaufträge",
    contracts_hint: "Wählen Sie eine Route, weisen Sie ein Fahrzeug zu und erzielen Sie Gewinn",
    filter_all: "Alle Typen",
    filter_express: "⚡ Express",
    filter_heavy: "📦 Schwerlast",
    empty_contracts_hint: "Keine Aufträge für den ausgewählten Filter vorhanden.<br>Warten Sie auf neue Routen oder wählen Sie eine andere Stadt auf der Karte.",
    contract_btn_accept: "Annehmen",
    contract_dist_label: "km",
    contract_deadline_label: "Frist:",

    // Fleet Tab
    fleet_title: "Aktiver Fuhrpark",
    fleet_hint: "Routenüberwachung, Fahrzeugstandorte und Live-Status",
    status_idle: "Frei",
    status_moving_to_pickup: "Anfahrt zur Beladung",
    status_loading: "Beladung...",
    status_in_transit: "Unterwegs ➔",
    status_unloading: "Entladung...",
    driver_assigned: "Fahrer:",
    driver_not_assigned: "Kein Fahrer zugewiesen",
    location_label: "Standort:",
    course_to_label: "Kurs auf:",
    route_label: "Route:",
    in_hub_label: "Im Hub:",
    in_dest_label: "Am Zielort:",
    speed_label: "Geschwindigkeit:",
    capacity_to: "bis",
    tons_short: "t",

    // Shop Tab
    shop_title: "Europäischer Fahrzeughandel",
    shop_hint: "Transporter, Fernverkehrs-Sattelzüge, Güterzüge und Frachtflugzeuge",
    spec_capacity: "Nutzlast:",
    spec_speed: "Geschwindigkeit:",
    spec_fuel: "Verbrauch:",
    spec_network: "Verkehrsnetz:",
    net_road: "🛣️ Autobahn",
    net_rail: "🚂 Schiene",
    net_air: "✈️ Luftfracht",
    btn_buy_vehicle: "🛒 Kaufen",
    btn_no_garage_slots: "Keine freien Garagenplätze",
    btn_not_enough_funds: "Unzureichende Mittel",

    // Garages Tab
    garages_title: "Europäisches Garagennetzwerk",
    garages_hint: "Stützpunkte für Ihre Flotte und regionale Ertragsboni",
    garages_summary_title: "🏠 Netzwerk aus Basen & Hangars",
    garages_slots_label: "Plätze:",
    garages_owned_count: "Eigene Drehkreuze:",
    garages_capacity_used: "Auslastung:",
    garages_owned_section: "Eigene Garagenkomplexe",
    garages_available_section: "Neuen Stützpunkt in Europa eröffnen (€10.000)",
    garage_level_label: "Stufe",
    garage_slots_info: "Stellplätze:",
    garage_parked_here: "Hier geparkt:",
    garage_perk_label: "Bonus:",
    garage_btn_upgrade: "🏗️ Ausbauen auf Stufe",
    garage_max_badge: "⭐ MAXIMALER HANGAR",
    garage_btn_buy: "+ Stützpunkt kaufen",

    // Drivers Tab
    drivers_title: "Personal & Arbeitsmarkt",
    drivers_hint: "Einstellung, Fahrerlizenzen und Erfahrungsgewinn",
    subtab_my_drivers: "Meine Fahrer",
    subtab_recruit_drivers: "Arbeitsmarkt",
    driver_empty_my: "Sie haben keine angestellten Fahrer. Wechseln Sie zum «Arbeitsmarkt», um Personal einzustellen!",
    driver_empty_market: "Zurzeit suchen keine Fahrer nach Anstellung.",
    driver_stat_speed: "Geschwindigkeitsbonus:",
    driver_stat_fuel: "Kraftstoffersparnis:",
    driver_stat_salary: "Lohn pro Fahrt:",
    driver_stat_cost: "Einstellungsprämie:",
    driver_stat_xp: "Erfahrung:",
    driver_btn_hire: "🤝 Einstellen",
    driver_btn_fire: "Entlassen",
    driver_assigned_veh_label: "Zugewiesenes Fahrzeug:",
    driver_unassigned_opt: "-- Ohne Zuweisung (In Reserve) --",
    driver_xp_progress: "XP-Fortschritt:",

    // Upgrades Tab
    upgrades_title: "Technologische Entwicklung",
    upgrades_hint: "Strategische Kompromisse und Unternehmensupgrades",
    tradeoffs_header: "⚡ Strategische Kompromisse (Vorteile / Nachteile)",
    tradeoffs_hint: "Bieten massive Leistungssteigerungen, verbunden mit gezielten technischen oder finanziellen Nachteilen.",
    regular_upgrades_header: "🏢 Unternehmenstechnologien",
    btn_unlock_tradeoff: "Freischalten:",
    btn_active_tradeoff: "🟢 AKTIV (Abschalten)",
    btn_inactive_tradeoff: "⚪ INAKTIV (Einschalten)",
    upgrade_max_label: "MAXIMUM",
    upgrade_level_prefix: "Stufe:",

    // Map & Status Bar
    map_legend_road: "Autobahn",
    map_legend_rail: "Eisenbahn",
    map_legend_air: "Luftkorridor",
    map_hint_default: "Klicken Sie auf eine Stadt oder Route für Details",
    map_hub_selected: "📍 Ausgewählter Hub:",
    btn_reset_city_filter: "(Zurücksetzen ✕)",
    map_frozen_banner: "Karte eingefroren (Simulation läuft weiter)",
    btn_unfreeze_map: "Freigeben ❄️",
    active_routes_label: "Aktive Routen",
    empty_routes_hint: "Keine Fahrzeuge unterwegs. Nehmen Sie Aufträge im Auftragsmenü an!",
    ticker_label: "Europa-Ticker:",
    ticker_default: "Europas Logistikkorridore laufen im Normalbetrieb. Willkommen bei EuroTrans!",

    // Assign Modal
    assign_modal_title: "Fahrzeug dem Frachtauftrag zuweisen",
    assign_route_label: "Route:",
    assign_cargo_label: "Fracht:",
    assign_weight_label: "Gewicht:",
    assign_reward_label: "Vergütung:",
    assign_deadline_label: "Lieferfrist:",
    assign_choose_vehicle: "Wählen Sie ein verfügbares Transportmittel:",
    assign_btn_select: "Auswählen",

    // Help Modal
    help_modal_title: "EuroTrans Leitfaden & Spielregeln",
    help_section_about: "Spielziel",
    help_text_about: "Sie leiten ein paneuropäisches Speditionsunternehmen. Verdienen Sie Geld, kaufen Sie Garagen, bauen Sie Ihre Flotte aus und stellen Sie erfahrene Fahrer ein!",
    help_sec_vans: "Transporter",
    help_sec_vans_desc: "Wendige und günstige Kastenwagen. Perfekt für leichte und dringende Expressaufträge bis 3,5 Tonnen.",
    help_sec_trucks: "Sattelzüge (TIR)",
    help_sec_trucks_desc: "Das Rückgrat der Autobahnen. Hohe Nutzlast (bis 32 Tonnen) und verlässliche, hohe Einnahmen.",
    help_sec_trains: "Güterzüge",
    help_sec_trains_desc: "Verkehren auf dem Schienennetz. Transportieren enorme Frachtmengen (bis 75 Tonnen) zu minimalen Kosten.",
    help_sec_planes: "Frachtflugzeuge",
    help_sec_planes_desc: "Blitzschneller Transport zwischen Kontinentaldrehkreuzen. Teuer, aber unverzichtbar für VIP-Aufträge!",
    help_tips_title: "Disponenten-Tipps",
    help_tip_1: "Achten Sie auf Lieferfristen: Verspätungen führen zu Vertragsstrafen und Rufverlust!",
    help_tip_2: "Kaufen Sie Stützpunkte in verschiedenen Städten: Schafft Stellplätze und steigert den Ertrag um bis zu +25 %.",
    help_tip_3: "Stellen Sie Fahrer ein: Mit jeder Lieferung sammeln sie XP und steigern Effizienz und Tempo.",
    help_tip_4: "Nutzen Sie Kompromiss-Upgrades gezielt und passen Sie diese an Ihre Strategie an.",
    btn_got_it: "Verstanden, los geht's!",
    btn_restart_tut_help: "Tutorial wiederholen",
    btn_open_help: "Regeln & Leitfaden",
    pause_theme_section: "Interface-Darstellung",
    setting_theme_label: "Helles Thema",
    setting_theme_sub: "Zwischen dunklem und hellem Modus wechseln",

    // Pause Modal
    pause_modal_title: "Pausenmenü",
    pause_modal_hint: "Spiel ist pausiert",
    btn_resume_game: "Spiel fortsetzen",
    pause_audio_section: "Audioeinstellungen",
    pause_lang_section: "Spielsprache (Language / Jazyk / Мова)",
    setting_volume: "Gesamtlautstärke",
    setting_sound_effects: "Soundeffekte",
    setting_sound_sub: "Motorengeräusche, Hupe, Alarme",
    btn_test_sound: "Test",
    pause_danger_section: "Spielstand zurücksetzen",
    pause_danger_desc: "Firma komplett neu gründen mit 25.000 € Startguthaben.",
    btn_restart_game_pause: "Neues Spiel beginnen",
    esc_hint: "Tipp: Drücken Sie die Esc-Taste zum schnellen Umschalten des Pausenmenüs",

    // Tutorial
    tut_step_prefix: "Schritt",
    tut_from: "von",
    btn_skip_tutorial: "Überspringen ✕",
    btn_tut_prev: "Zurück",
    btn_tut_next: "Weiter ➔",
    btn_tut_finish: "Ins Spiel starten! 🚀",

    // Toasts
    toast_sound_on: "Audio aktiviert",
    toast_sound_off: "Audio stummgeschaltet",
    toast_new_game: "Neues Unternehmen gegründet!",
    toast_lang_changed: "Spielsprache auf Deutsch umgestellt",
    toast_confirm_reset: "Möchten Sie Ihre Spedition wirklich zurücksetzen? Sämtlicher Fortschritt geht verloren.",
    toast_garage_bought: "Neuer Stützpunkt erworben in",
    toast_garage_upgraded: "Garagenkomplex ausgebaut auf Stufe",
    toast_driver_hired: "Neuen Mitarbeiter eingestellt:",
    toast_driver_fired: "Fahrer entlassen:",
    toast_driver_assigned: "Fahrer dem Fahrzeug zugewiesen",
    toast_contract_expired: "⌛ Auftrag {cargo} wegen Fristablaufs storniert",
    toast_trip_late_insured: "🛡️ Allianz-Police deckte die Verspätung ab! Volle Auszahlung: +€{payout}",
    toast_trip_late: "⚠️ Lieferverspätung! Gekürzte Auszahlung: +€{payout}",
    toast_trip_success: "🎉 Lieferung erfolgreich: {cargo} nach {city}! +€{payout}",
    toast_vehicle_loaded: "🚚 {vehicle} in {city} beladen und abgefahren!",
    toast_vehicle_arrived_pickup: "🚚 {vehicle} zur Beladung in {city} eingetroffen",
    toast_driver_levelup: "⭐ Fahrer {driver} ist auf Stufe {level} aufgestiegen! Fähigkeiten verbessert.",
    toast_ai_fee: "🤖 Tägliche Wartungsgebühr für KI-Disponenten abgebucht: -€400",
    toast_vehicle_in_transit: "Fahrzeug befindet sich derzeit auf der Route!",
    toast_qual_mismatch: "Fahrerqualifikation passt nicht zu diesem Fahrzeugtyp!",
    toast_vehicle_bought: "🛒 Neues Fahrzeug gekauft: {name}!"
  }
};

// =============================================================================
// Локалізовані довідники сутностей
// =============================================================================

const CARGO_I18N = {
  medical: {
    uk: "Медикаменти та вакцини",
    sk: "Lieky a vakcíny",
    en: "Pharmaceuticals & Vaccines",
    de: "Medikamente & Impfstoffe",
    desc: {
      uk: "Термінові медичні препарати та вакцини з суворим температурним режимом.",
      sk: "Naliehavý zdravotnícky materiál a vakcíny s prísnou kontrolou teploty.",
      en: "Urgent pharmaceutical supplies and temperature-sensitive vaccines.",
      de: "Dringende Arzneimittel und temperatursensible Impfstoffe."
    }
  },
  electronics: {
    uk: "Електроніка та мікрочіпи",
    sk: "Elektronika a mikročipy",
    en: "Electronics & Microchips",
    de: "Elektronik & Halbleiter",
    desc: {
      uk: "Високоточні напівпровідникові плати, процесори та серверне обладнання.",
      sk: "Vysoko presné polovodičové čipy, procesory a serverové vybavenie.",
      en: "High-precision microchips, processors, and advanced server gear.",
      de: "Hochpräzise Halbleiter-Wafer, Prozessoren und Server-Hardware."
    }
  },
  fruits: {
    uk: "Свіжі фрукти та овочі",
    sk: "Čerstvé ovocie a zelenina",
    en: "Fresh Fruits & Produce",
    de: "Frisches Obst & Gemüse",
    desc: {
      uk: "Швидкопсувний вітамінний провіант, що потребує негайної експрес-доставки.",
      sk: "Rýchlo sa kaziaci čerstvý proviant vyžadujúci promptný expresný dovoz.",
      en: "Perishable fresh agricultural produce requiring rapid refrigerated transit.",
      de: "Leicht verderbliche Frischwaren, die sofortigen Kühltransport erfordern."
    }
  },
  auto_parts: {
    uk: "Автомобільні компоненти",
    sk: "Autodiely a komponenty",
    en: "Automotive Components",
    de: "Fahrzeugkomponenten",
    desc: {
      uk: "Вузли трансмісій, двигуни та електронні блоки для конвеєрів автогігантів.",
      sk: "Prevodové skrine, motory a riadiace jednotky pre automobilové závody.",
      en: "Transmissions, engines, and ECU assemblies for automotive assembly lines.",
      de: "Getriebe, Motorenblöcke und Steuerelektronik für Fahrzeugmontagelinien."
    }
  },
  machinery: {
    uk: "Промислові верстати",
    sk: "Priemyselné stroje",
    en: "Industrial Heavy Machinery",
    de: "Industrie- & Werkzeugmaschinen",
    desc: {
      uk: "Високопродуктивні ЧПК-агрегати, гідравлічні преси та силові турбіни.",
      sk: "Vysokovýkonné CNC obrábacie stroje, hydraulické lisy a turbíny.",
      en: "High-performance CNC tooling centers, hydraulic presses, and turbines.",
      de: "Hochleistungs-CNC-Fräszentren, Hydraulikpressen und Kraftwerksturbinen."
    }
  },
  chemicals: {
    uk: "Хімічні реагенти",
    sk: "Priemyselná chémia",
    en: "Chemical Reagents",
    de: "Chemische Erzeugnisse",
    desc: {
      uk: "Спеціальні сполуки, полімерні гранули та лабораторні хімічні розчини.",
      sk: "Špeciálne zlúčeniny, polymérne granuláty a priemyselné roztoky.",
      en: "Specialized compounds, polymer granules, and industrial solutions.",
      de: "Spezialsynthesen, Polymergranulate und chemische Industrielösungen."
    }
  },
  metallurgy: {
    uk: "Металопрокат та сталь",
    sk: "Oceľ a valcovaný kov",
    en: "Rolled Steel & Metals",
    de: "Walzstahl & Metallprofile",
    desc: {
      uk: "Багатотонні балки, гарячекатані сталеві рулони та конструкційні сплави.",
      sk: "Mnohotonové nosníky, za tepla valcované zvitky a konštrukčné zliatiny.",
      en: "Multi-ton I-beams, hot-rolled steel coils, and structural alloys.",
      de: "Schwere Stahlträger, warmgewalzte Coils und Strukturmetallprofile."
    }
  },
  consumer: {
    uk: "Споживчі товари та посилки",
    sk: "Spotrebný tovar a zásielky",
    en: "Consumer Goods & Retail",
    de: "Konsumgüter & Einzelhandel",
    desc: {
      uk: "Пакетовані експрес-вантажі, одяг та товари першої необхідності для супермаркетів.",
      sk: "Balíkový expresný tovar, oblečenie a spotrebný sortiment pre obchodné siete.",
      en: "Parceled express shipments, apparel, and fast-moving retail commodities.",
      de: "Express-Paketgut, Bekleidung und Konsumgüter für europäische Handelsketten."
    }
  },
  aerospace: {
    uk: "Аерокосмічні вузли",
    sk: "Letecké a vesmírne komponenty",
    en: "Aerospace Components",
    de: "Luft- und Raumfahrtmodule",
    desc: {
      uk: "Титанові лопатки турбін, супутникові платформи та надточні прилади авіації.",
      sk: "Titánové lopatky turbín, satelitné platformy a avionické prístroje.",
      en: "Titanium turbine blades, satellite platforms, and flight-critical avionics.",
      de: "Titan-Turbinenschaufeln, Satellitenplattformen und hochpräzise Avionik."
    }
  }
};

const QUALIFICATION_I18N = {
  van: {
    uk: "🚐 Фургони & Буси",
    sk: "🚐 Dodávky a minibusy",
    en: "🚐 Vans & Minibuses",
    de: "🚐 Transporter & Kastenwagen"
  },
  truck: {
    uk: "🚛 Важкі TIR тягачі",
    sk: "🚛 Ťažké TIR ťahače",
    en: "🚛 Heavy TIR Trucks",
    de: "🚛 Schwere TIR-Sattelzüge"
  },
  train: {
    uk: "🚂 Вантажні потяги",
    sk: "🚂 Nákladné vlaky",
    en: "🚂 Freight Locomotives",
    de: "🚂 Güterzug-Lokomotiven"
  },
  plane: {
    uk: "✈️ Авіалайнери Cargo",
    sk: "✈️ Nákladné lietadlá",
    en: "✈️ Cargo Airplanes",
    de: "✈️ Frachtflugzeuge"
  },
  all: {
    uk: "⭐ Універсал (Всі види)",
    sk: "⭐ Univerzál (Všetky druhy)",
    en: "⭐ Universal (All types)",
    de: "⭐ Allrounder (Alle Typen)"
  }
};

const GARAGE_TIERS_I18N = {
  1: {
    name: {
      uk: "Малий автогараж",
      sk: "Malá autogaráž",
      en: "Small Vehicle Garage",
      de: "Kleine Autogarage"
    },
    perkDesc: {
      uk: "Місткість: 2 авт. Базовий ремонт техніки.",
      sk: "Kapacita: 2 voz. Základná údržba techniky.",
      en: "Capacity: 2 vehicles. Basic maintenance depot.",
      de: "Kapazität: 2 Fzg. Grundlegende Wartungsbasis."
    }
  },
  2: {
    name: {
      uk: "Логістичний хаб",
      sk: "Logistický uzol",
      en: "Logistics Hub",
      de: "Logistikzentrum"
    },
    perkDesc: {
      uk: "Місткість: 5 авт. Бонус замовлень з міста: +12%.",
      sk: "Kapacita: 5 voz. Bonus za zákazky z tohto uzla: +12%.",
      en: "Capacity: 5 vehicles. Contract reward bonus from hub: +12%.",
      de: "Kapazität: 5 Fzg. Auftragsbonus für Ausfahrten: +12%."
    }
  },
  3: {
    name: {
      uk: "Оптимальний ангар",
      sk: "Optimálny hangár",
      en: "Optimal Hangar Complex",
      de: "Optimaler Hangarkomplex"
    },
    perkDesc: {
      uk: "Місткість: 12 авт. Дохід: +25%, Пальне: -15%, Швидка розгрузка.",
      sk: "Kapacita: 12 voz. Zisk: +25%, Palivo: -15%, Rýchla vykládka.",
      en: "Capacity: 12 vehicles. Payouts: +25%, Fuel: -15%, Fast turnaround.",
      de: "Kapazität: 12 Fzg. Ertrag: +25%, Kraftstoff: -15%, Schnellumschlag."
    }
  }
};

const COUNTRIES_I18N = {
  "Україна": { uk: "Україна", sk: "Ukrajina", en: "Ukraine", de: "Ukraine" },
  "Польща": { uk: "Польща", sk: "Poľsko", en: "Poland", de: "Polen" },
  "Німеччина": { uk: "Німеччина", sk: "Nemecko", en: "Germany", de: "Deutschland" },
  "Франція": { uk: "Франція", sk: "Francúzsko", en: "France", de: "Frankreich" },
  "Велика Британія": { uk: "Велика Британія", sk: "Veľká Británia", en: "United Kingdom", de: "Vereinigtes Königreich" },
  "Іспанія": { uk: "Іспанія", sk: "Španielsko", en: "Spain", de: "Spanien" },
  "Італія": { uk: "Італія", sk: "Taliansko", en: "Italy", de: "Italien" },
  "Нідерланди": { uk: "Нідерланди", sk: "Holandsko", en: "Netherlands", de: "Niederlande" },
  "Бельгія": { uk: "Бельгія", sk: "Belgicko", en: "Belgium", de: "Belgien" },
  "Австрія": { uk: "Австрія", sk: "Rakúsko", en: "Austria", de: "Österreich" },
  "Чехія": { uk: "Чехія", sk: "Česko", en: "Czechia", de: "Tschechien" },
  "Словаччина": { uk: "Словаччина", sk: "Slovensko", en: "Slovakia", de: "Slowakei" },
  "Швеція": { uk: "Швеція", sk: "Švédsko", en: "Sweden", de: "Schweden" },
  "Данія": { uk: "Данія", sk: "Dánsko", en: "Denmark", de: "Dänemark" },
  "Фінляндія": { uk: "Фінляндія", sk: "Fínsko", en: "Finland", de: "Finnland" },
  "Угорщина": { uk: "Угорщина", sk: "Maďarsko", en: "Hungary", de: "Ungarn" },
  "Швейцарія": { uk: "Швейцарія", sk: "Švajčiarsko", en: "Switzerland", de: "Schweiz" },
  "Болгарія": { uk: "Болгарія", sk: "Bulharsko", en: "Bulgaria", de: "Bulgarien" },
  "Греція": { uk: "Греція", sk: "Grécko", en: "Greece", de: "Griechenland" }
};

const TRADEOFFS_I18N = {
  turbo_boost: {
    title: { uk: "Турбо-наддув Twin-Turbo", sk: "Twin-Turbo preplňovanie", en: "Twin-Turbo Boost System", de: "Twin-Turbo Ladesystem" },
    pro: { uk: "+25% Швидкість усього флоту", sk: "+25% Rýchlosť celej flotily", en: "+25% Fleet Speed", de: "+25% Flottengeschwindigkeit" },
    con: { uk: "+20% Витрати пального", sk: "+20% Spotreba paliva", en: "+20% Fuel Consumption", de: "+20% Treibstoffverbrauch" },
    desc: {
      uk: "Форсування турбокомпресорів скорочує час рейсів, проте підвищує споживання палива.",
      sk: "Zvýšenie výkonu turbodúchadiel skracuje čas jázd, no zvyšuje spotrebu paliva.",
      en: "Aggressive turbocharging shortens delivery times but noticeably increases fuel usage.",
      de: "Turboaufladung verkürzt Lieferzeiten, erhöht jedoch spürbar den Kraftstoffverbrauch."
    }
  },
  mega_trailers: {
    title: { uk: "Подовжені платформи Mega-Trailer", sk: "Mega-Trailer predĺžené návesy", en: "Mega-Trailer Extended Platforms", de: "Mega-Trailer Großraumauflieger" },
    pro: { uk: "+35% Місткість фургонів і тягачів", sk: "+35% Kapacita dodávok a ťahačov", en: "+35% Van & Truck Capacity", de: "+35% Transporter- & Lkw-Kapazität" },
    con: { uk: "-15% Максимальна швидкість", sk: "-15% Maximálna rýchlosť", en: "-15% Maximum Speed", de: "-15% Höchstgeschwindigkeit" },
    desc: {
      uk: "Подовжені причепи дозволяють брати значно більше вантажу ціною аеродинаміки.",
      sk: "Predĺžené návesy umožňujú odviezť omnoho viac nákladu na úkor aerodynamiky.",
      en: "High-volume trailers carry significantly heavier payloads at the expense of aerodynamics.",
      de: "Verlängerte Auflieger transportieren deutlich mehr Fracht auf Kosten der Aerodynamik."
    }
  },
  eco_euro7: {
    title: { uk: "Еко-стандарт Євро-7 «Green Fleet»", sk: "Eko-štandard Euro-7 «Green Fleet»", en: "Euro-7 Eco Standard «Green Fleet»", de: "Euro-7 Öko-Standard «Green Fleet»" },
    pro: { uk: "-35% Споживання палива та викиди", sk: "-35% Spotreba paliva a emisie", en: "-35% Fuel Consumption & Emissions", de: "-35% Kraftstoffverbrauch & Emissionen" },
    con: { uk: "-10% Потужність та динаміка", sk: "-10% Výkon a akcelerácia", en: "-10% Engine Power & Acceleration", de: "-10% Motorleistung & Beschleunigung" },
    desc: {
      uk: "Суворе програмне обмеження впорскування заощаджує пальне, але дещо сповільнює розгін.",
      sk: "Prísne elektronické riadenie vstrekovania šetrí palivo, no mierne spomaľuje rozbeh.",
      en: "Strict electronic fuel injection limits maximize economy with slightly reduced acceleration.",
      de: "Strenge Einspritzgrenzen senken den Verbrauch drastisch bei geringerer Beschleunigung."
    }
  },
  express_24_7: {
    title: { uk: "Експрес-служба 24/7 «Night Express»", sk: "Expresná služba 24/7 «Night Express»", en: "24/7 Service «Night Express»", de: "24/7 Expressdienst «Night Express»" },
    pro: { uk: "+40% До вартості всіх контрактів", sk: "+40% K hodnote všetkých zákaziek", en: "+40% Value for All Contracts", de: "+40% Ertrag aller Aufträge" },
    con: { uk: "-25% Доступного часу на дедлайн", sk: "-25% Dostupného času na termín", en: "-25% Available Deadline Time", de: "-25% Lieferzeitfenster" },
    desc: {
      uk: "Преміальний надтерміновий сервіс платить значно більше, проте дедлайни стають жорсткішими.",
      sk: "Prémiová nočná expresná služba platí podstatne viac, no termíny sú omnoho prísnejšie.",
      en: "Premium urgent overnight shipping pays huge rewards, but delivery windows are tighter.",
      de: "Premium-Nachtexpress zahlt deutlich höhere Prämien, verlangt jedoch straffe Fristen."
    }
  },
  ai_dispatcher: {
    title: { uk: "Нейромережевий диспетчер NeuraLog", sk: "Neurónový dispečer NeuraLog", en: "Neural AI Dispatcher NeuraLog", de: "KI-Disponentensystem NeuraLog" },
    pro: { uk: "-75% Час навантаження / розвантаження", sk: "-75% Čas nakládky a vykládky", en: "-75% Loading & Unloading Time", de: "-75% Be- und Entladezeit" },
    con: { uk: "€400 Щоденна абонплата за ШІ-сервери", sk: "€400 Denný poplatok za AI servery", en: "€400 Daily AI Cloud Server Fee", de: "400 € Tägliche KI-Servergebühr" },
    desc: {
      uk: "Штучний інтелект миттєво обробляє митні документи, але вимагає щоденної оплати за сервери.",
      sk: "Umelá inteligencia okamžite odbavuje colné dokumenty, no vyžaduje denný poplatok.",
      en: "Artificial intelligence automates logistics clearances instantaneously with a daily server fee.",
      de: "Künstliche Intelligenz wickelt Frachtpapiere blitzschnell ab gegen eine tägliche Servergebühr."
    }
  },
  allianz_insurance: {
    title: { uk: "Міжнародний поліс Allianz Ultra", sk: "Medzinárodná poistka Allianz Ultra", en: "Allianz Ultra Insurance Policy", de: "Allianz Ultra Frachtversicherung" },
    pro: { uk: "0% Штрафів за запізнення та репутацію", sk: "0% Pokút za meškanie a reputáciu", en: "0% Penalties for Late Delivery", de: "0% Verspätungs- & Rufstrafen" },
    con: { uk: "-12% Страховий відрахунок з кожного рейсу", sk: "-12% Poistný odvod z každej jazdy", en: "-12% Insurance Fee Per Trip", de: "-12% Versicherungsabzug pro Fahrt" },
    desc: {
      uk: "Страхова компанія покриває будь-які збитки при запізненні, але утримує 12% комісії.",
      sk: "Poisťovňa kryje všetky straty pri meškaní, no účtuje si 12% z každej odmeny.",
      en: "Insurance fully covers late delivery penalties while charging a 12% surcharge per payout.",
      de: "Die Versicherung übernimmt alle Verspätungsschäden gegen einen 12%igen Auszahlungsabzug."
    }
  }
};

const UPGRADES_I18N = {
  eco_driving: {
    title: { uk: "Еко-система палива", sk: "Ekologický palivový systém", en: "Eco Fuel Telematics", de: "Öko-Kraftstoffsystem" },
    desc: {
      uk: "Зменшує витрати пального на 15% для всього автопарку.",
      sk: "Znižuje spotrebu paliva o 15% pre celý vozový park.",
      en: "Reduces fuel consumption by 15% across the entire fleet.",
      de: "Senkt den Kraftstoffverbrauch um 15 % für die gesamte Flotte."
    }
  },
  gps_telematics: {
    title: { uk: "GPS-телематика", sk: "GPS telematika", en: "GPS Fleet Telematics", de: "GPS-Flottentelematik" },
    desc: {
      uk: "Оптимізує логістичні маршрути, підвищуючи швидкість руху на 10%.",
      sk: "Optimalizuje logistické trasy a zvyšuje rýchlosť o 10%.",
      en: "Optimizes dispatch routes, increasing fleet speed by 10%.",
      de: "Optimiert Fahrrouten und erhöht die Geschwindigkeit um 10 %."
    }
  },
  logistics_hub: {
    title: { uk: "Логістичний брокер", sk: "Logistický maklér", en: "Freight Brokerage", de: "Frachtenbörsen-Broker" },
    desc: {
      uk: "Підвищує виплати за всі виконані контракти на 12%.",
      sk: "Zvyšuje odmenu za všetky dokončené zákazky o 12%.",
      en: "Negotiates premium freight rates, increasing contract rewards by 12%.",
      de: "Erhöht die Vergütung für alle abgeschlossenen Aufträge um 12 %."
    }
  },
  vip_broker: {
    title: { uk: "VIP-ліцензія ЄС", sk: "VIP licencia EÚ", en: "EU VIP Cargo License", de: "EU VIP-Speditionslizenz" },
    desc: {
      uk: "Відкриває доступ до надприбуткових урядових та аерокосмічних перевезень.",
      sk: "Odomyká prístup k vysoko ziskovým vládnym a leteckým prepravám.",
      en: "Unlocks access to ultra-lucrative governmental and aerospace consignments.",
      de: "Ermöglicht den Zugriff auf hochlukrative Regierungs- und Luftfahrtaufträge."
    }
  }
};

const TUTORIAL_I18N = [
  {
    step: 1,
    title: {
      uk: "Ласкаво просимо в EuroTrans Logistics!",
      sk: "Vitajte v EuroTrans Logistics!",
      en: "Welcome to EuroTrans Logistics!",
      de: "Willkommen bei EuroTrans Logistics!"
    },
    desc: {
      uk: "Ви очолюєте сучасну пан'європейську логістичну компанію. Ваша мета — розбудувати мережу доставки між містами Європи, купувати гаражі й ангари, наймати найкращих водіїв та розвивати величезний флот!",
      sk: "Riadite modernú paneurópsku logistickú spoločnosť. Vaším cieľom je vybudovať sieť prepravy po celej Európe, kupovať garáže a hangáre, najímať najlepších vodičov a rozširovať flotilu!",
      en: "You manage a modern pan-European logistics company. Build a delivery network across European cities, acquire garages and hangars, hire top drivers and expand a massive fleet!",
      de: "Sie leiten eine moderne paneuropäische Spedition. Bauen Sie ein Liefernetzwerk über ganz Europa auf, kaufen Sie Garagen und Hangars, stellen Sie Fahrer ein und vergrößern Sie Ihre Flotte!"
    },
    tip: {
      uk: "У верхній панелі постійно відображаються ваш капітал (€), репутація (⭐), місткість гаражів, штат персоналу та ігровий календар.",
      sk: "V hornom paneli stále vidíte svoj kapitál (€), reputáciu (⭐), kapacitu garáží, stav personálu a herný čas.",
      en: "The top bar monitors your capital (€), company reputation (⭐), garage slots, staff count and in-game calendar.",
      de: "Die obere Leiste zeigt stets Ihr Kapital (€), Ihren Ruf (⭐), Garagenstellplätze, Mitarbeiterzahl und den Kalender."
    }
  },
  {
    step: 2,
    title: {
      uk: "Детальна інтерактивна мапа Європи",
      sk: "Detailná interaktívna mapa Európy",
      en: "Detailed Interactive Europe Map",
      de: "Detaillierte interaktive Europakarte"
    },
    desc: {
      uk: "Мапа охоплює 36 європейських хабів з детальними береговими лініями. Блакитні лінії — автобани, жовті пунктири — залізниці, фіолетові — авіалінії. Міста з вашими базами позначені іконкою 🏠.",
      sk: "Mapa zahŕňa 36 európskych uzlov s detailným pobrežím. Modré čiary sú diaľnice, žlté čiarkované železnice a fialové letecké koridory. Mestá s vašimi základňami sú označené ikonou 🏠.",
      en: "The map features 36 European hubs with realistic coastlines. Blue lines represent motorways, yellow dashed lines are railways, and purple lines are air corridors. Cities with your depots display 🏠.",
      de: "Die Karte umfasst 36 europäische Drehkreuze. Blaue Linien sind Autobahnen, gelbe Strichlinien Eisenbahnen und lila Linien Luftkorridore. Eigene Stützpunkte sind mit 🏠 markiert."
    },
    tip: {
      uk: "Клацніть на будь-яке місто на мапі, щоб миттєво відфільтрувати список рейсів, які вирушають саме звідти!",
      sk: "Kliknite na ľubovoľné mesto na mape a okamžite vyfiltrujete zákazky začínajúce v tomto uzle!",
      en: "Click any city on the map to instantly filter out-of-hub contracts originating there!",
      de: "Klicken Sie auf eine Stadt auf der Karte, um Abfahrten ab diesem Hub sofort zu filtern!"
    }
  },
  {
    step: 3,
    title: {
      uk: "Вибір та прийняття контрактів",
      sk: "Výber a prijatie zákaziek",
      en: "Contract Selection & Dispatch",
      de: "Auftragsauswahl & Annahme"
    },
    desc: {
      uk: "У вкладці 'Замовлення' зліва з'являються рейси: від свіжих фруктів та електроніки до промислового обладнання та аерокосмічних компонентів. Кожен контракт має фіксовану винагороду (+€), вагу та таймер дедлайну (⏱️).",
      sk: "V záložke 'Zákazky' vľavo sa objavujú trasy: od čerstvého ovocia po ťažké stroje a letecké diely. Každá zákazka má pevne stanovenú odmenu (+€), hmotnosť a časový termín (⏱️).",
      en: "The 'Contracts' tab lists incoming orders: from produce and electronics to heavy machinery and aerospace parts. Each has a reward (+€), cargo tonnage and a countdown timer (⏱️).",
      de: "Im Reiter 'Aufträge' erscheinen Frachten: von Lebensmitteln bis zu Industriemaschinen. Jeder Auftrag hat eine Vergütung (+€), ein Frachtgewicht und ein Zeitlimit (⏱️)."
    },
    tip: {
      uk: "Звертайте особливу увагу на замовлення з позначкою ⚡ Експрес — вони значно дорожчі, але вимагають швидкого виконання!",
      sk: "Sledujte zákazky s označením ⚡ Expres — platia omnoho viac, no vyžadujú rýchly presun!",
      en: "Watch out for ⚡ Express contracts: they offer massive payouts but demand speedy delivery!",
      de: "Beachten Sie ⚡ Express-Aufträge: Sie zahlen deutlich mehr, verlangen jedoch hohes Tempo!"
    }
  },
  {
    step: 4,
    title: {
      uk: "Флот із 12 моделей транспорту",
      sk: "Flotila 12 modelov vozidiel",
      en: "Fleet of 12 Vehicle Models",
      de: "Fuhrpark aus 12 Fahrzeugmodellen"
    },
    desc: {
      uk: "У магазині доступно 12 видів техніки: спритні електрофургони, далекобійні тягачі TIR (Volvo FH16, Scania 770S, Gigaliner), важкі локомотиви (Siemens Vectron, TGV) та вантажні літаки (Airbus, An-124).",
      sk: "V obchode je 12 druhov techniky: elektrické dodávky, diaľkové TIR ťahače (Volvo, Scania, Gigaliner), elektrické rušne (Siemens, TGV) a obrie nákladné lietadlá (Airbus, An-124).",
      en: "The shop offers 12 vehicles: agile electric vans, long-haul TIR rigs (Volvo FH16, Scania 770S, Gigaliner), heavy locomotives (Siemens Vectron, TGV) and cargo jetliners (Airbus, An-124).",
      de: "Im Fahrzeughandel gibt es 12 Modelle: E-Transporter, TIR-Fernzüge (Volvo, Scania, Gigaliner), Elektroloks (Siemens Vectron, TGV) und Großraumfrachter (Airbus, An-124)."
    },
    tip: {
      uk: "Потяги курсують лише залізницею, а вантажні літаки миттєво перетинають континент між авіахабами!",
      sk: "Vlaky jazdia výhradne po koľajniciach, zatiaľ čo lietadlá preletia kontinent za sekundy!",
      en: "Trains require railway tracks, while cargo aircraft traverse the continent in seconds!",
      de: "Züge fahren nur auf Schienen, während Frachtflugzeuge den Kontinent in Sekundenschnelle überqueren!"
    }
  },
  {
    step: 5,
    title: {
      uk: "Мережа гаражів та ангарів",
      sk: "Sieť garáží a hangárov",
      en: "Depot & Hangar Infrastructure",
      de: "Garagen- & Hangarinfrastruktur"
    },
    desc: {
      uk: "Кількість техніки у флоті обмежена машиномісцями. Відкривайте бази в різних містах Європи та модернізуйте їх до логістичних хабів і ангарів — це відкриває нові слоти та дає постійні бонуси до прибутку!",
      sk: "Počet vozidiel je obmedzený parkovacími miestami. Otvárajte základne po celej Európe a modernizujte ich na hangáre — získate viac slotov a trvalé bonusy k zárobkom!",
      en: "Total fleet size is restricted by your garage slots. Purchase depots across European cities and upgrade them to hangars to unlock more vehicle capacity and permanent revenue perks!",
      de: "Die Fuhrparkgröße ist durch Garagenstellplätze begrenzt. Kaufen Sie Basen in ganz Europa und bauen Sie diese zu Hangars aus, um mehr Stellplätze und dauerhafte Boni freizuschalten!"
    },
    tip: {
      uk: "Ангар 3-го рівня дає +25% до виплат за замовлення з цього міста та зменшує витрату палива на 15%.",
      sk: "Hangár 3. úrovne pridáva +25% k výplatám zo svojho mesta a znižuje spotrebu paliva o 15%.",
      en: "A Level 3 Hangar adds +25% to rewards originating in that city and cuts fuel consumption by 15%.",
      de: "Ein Stufe-3-Hangar bringt +25 % Ertrag für Abfahrten ab dieser Stadt und senkt den Kraftstoffverbrauch um 15 %."
    }
  },
  {
    step: 6,
    title: {
      uk: "Штат водіїв та біржа праці",
      sk: "Vodiči a pracovný trh",
      en: "Drivers & Labor Recruitment",
      de: "Fahrerpersonal & Arbeitsmarkt"
    },
    desc: {
      uk: "Кожен транспорт потребує кваліфікованого водія відповідної категорії (фургони, тягачі, потяги, авіа). Виконуючи рейси, водії накопичують XP, підвищують рівень і збільшують швидкість та паливну економію флоту.",
      sk: "Každé vozidlo potrebuje vodiča s príslušnou kvalifikáciou. Jazdami vodiči získavajú XP, postupujú na vyššie úrovne a zvyšujú rýchlosť i úsporu paliva celej firmy.",
      en: "Every vehicle requires a qualified driver (van, truck, train, plane). Completing deliveries awards XP, leveling them up to boost speed and fuel efficiency.",
      de: "Jedes Transportmittel benötigt einen qualifizierten Fahrer. Mit jeder Fahrt sammeln Fahrer XP, steigen im Level auf und verbessern Geschwindigkeit sowie Verbrauch."
    },
    tip: {
      uk: "Закріплюйте найнятих співробітників за машинами у вкладці 'Мої водії' через випадаючий список.",
      sk: "Priraďujte zamestnancov k vozidlám v záložke 'Moji vodiči' cez rozbaľovací zoznam.",
      en: "Assign newly hired drivers to vehicles in the 'My Drivers' tab using the vehicle dropdown.",
      de: "Weisen Sie eingestellte Fahrer im Reiter 'Meine Fahrer' über das Dropdown-Menü zu."
    }
  },
  {
    step: 7,
    title: {
      uk: "Стратегічні компромісні апгрейди",
      sk: "Strategické kompromisné vylepšenia",
      en: "Strategic Trade-Off Techs",
      de: "Strategische Kompromiss-Technologien"
    },
    desc: {
      uk: "Доступні 6 потужних компромісних технологій: вони дають величезну перевагу в одній сфері ціною певної втрати в іншій (наприклад, Twin-Turbo +25% швидкості, але +20% витрат палива). Ви можете вільно вмикати та вимикати їх.",
      sk: "K dispozícii je 6 kompromisných technológií: poskytujú veľkú výhodu v jednej oblasti na úkor inej (napr. Twin-Turbo +25% rýchlosť, ale +20% palivo). Môžete ich kedykoľvek zapnúť a vypnúť.",
      en: "6 strategic trade-offs provide massive enhancements balanced by specific handicaps (e.g. Twin-Turbo: +25% speed, +20% fuel). You can freely toggle unlocked trade-offs on and off.",
      de: "6 Kompromiss-Upgrades bringen enorme Vorteile bei gezielten Nachteilen (z. B. Twin-Turbo: +25 % Tempo, +20 % Verbrauch). Freigeschaltete Upgrades lassen sich jederzeit an- und abschalten."
    },
    tip: {
      uk: "Підбирайте комбінацію компромісів під вашу поточну стратегію розвитку компанії!",
      sk: "Prispôsobte kombináciu kompromisov svojej aktuálnej stratégii expanzie!",
      en: "Tailor your active trade-offs to suit your immediate operational strategy!",
      de: "Stimmen Sie Ihre aktiven Kompromisse optimal auf Ihre aktuelle Unternehmensstrategie ab!"
    }
  },
  {
    step: 8,
    title: {
      uk: "Керування часом та Меню Паузи (Esc)",
      sk: "Časové riadenie a Menu Pauzy (Esc)",
      en: "Simulation Speed & Pause Menu (Esc)",
      de: "Zeitsteuerung & Pausenmenü (Esc)"
    },
    desc: {
      uk: "Керуйте швидкістю симуляції кнопками 1x, 2x, 4x або заморожуйте мапу кнопкою паузи справа зверху. Натискання клавіші Esc відкриває повноцінне системне меню паузи з налаштуваннями звуку, мови та перезапуском гри.",
      sk: "Rýchlosť simulácie ovládate tlačidlami 1x, 2x, 4x alebo pozastavíte mapu tlačidlom vpravo hore. Stlačením klávesu Esc otvoríte menu pauzy s voľbou zvuku, jazyka a reštartom.",
      en: "Control simulation speed with 1x, 2x, 4x buttons or freeze the map with top-right pause button. Pressing Esc opens the system pause menu with audio, language and game options.",
      de: "Steuern Sie die Spielgeschwindigkeit mit 1x, 2x, 4x oder frieren Sie die Karte oben rechts ein. Die Esc-Taste öffnet das Pausenmenü mit Audio-, Sprach- und Neustartoptionen."
    },
    tip: {
      uk: "Натисніть 'Вперед до гри', беріть перші замовлення та створюйте найпотужнішу логістичну імперію Європи!",
      sk: "Kliknite na 'Vpred do hry!', prijmite prvé zákazky a vybudujte najväčšie impérium v Európe!",
      en: "Click 'Start Playing!', take on your first consignments and conquer European logistics!",
      de: "Klicken Sie auf 'Ins Spiel starten!', nehmen Sie erste Aufträge an und beherrschen Sie Europas Logistik!"
    }
  }
];

const EVENTS_I18N = [
  {
    id: "fuel_spike",
    name: {
      uk: "⛽ Стрибок цін на паливо в Європі",
      sk: "⛽ Ropný šok na európskych trhoch",
      en: "⛽ European Fuel Price Spike",
      de: "⛽ Treibstoffpreisschock in Europa"
    },
    desc: {
      uk: "Ціни на нафту різко підскочили! Витрати пального +30% на 40 секунд.",
      sk: "Ceny ropy prudko vzrástli! Náklady na palivo +30% na 40 sekúnd.",
      en: "Crude oil prices spiked! Fuel expenses +30% for 40 seconds.",
      de: "Rohölpreise explodiert! Kraftstoffkosten +30 % für 40 Sekunden."
    },
    fuelMultiplier: 1.3,
    speedMultiplier: 1.0,
    type: "warning"
  },
  {
    id: "green_corridor",
    name: {
      uk: "🟢 Зелений транзитний коридор ЄС",
      sk: "🟢 Zelený tranzitný koridor EÚ",
      en: "🟢 EU Green Transit Corridor",
      de: "🟢 Grüner EU-Transitkorridor"
    },
    desc: {
      uk: "Спрощено митний контроль. Транспорт курсує на 20% швидше!",
      sk: "Zjednodušené colné kontroly. Flotila sa pohybuje o 20% rýchlejšie!",
      en: "Border formalities streamlined. All transport moves 20% faster!",
      de: "Zollabfertigung beschleunigt. Fahrzeuge bewegen sich 20 % schneller!"
    },
    fuelMultiplier: 1.0,
    speedMultiplier: 1.2,
    type: "success"
  },
  {
    id: "economic_boom",
    name: {
      uk: "📈 Економічний підйом у ЄС",
      sk: "📈 Hospodársky boom v EÚ",
      en: "📈 European Economic Boom",
      de: "📈 Europäischer Wirtschaftsboom"
    },
    desc: {
      uk: "Попит на перевезення рекордно зріс! Винагороди за нові рейси +25%.",
      sk: "Rekordný dopyt po preprave! Odmeny za nové zákazky +25%.",
      en: "Surge in commercial trade! Rewards for new contracts boosted by +25%.",
      de: "Rekordnachfrage nach Logistik! Vergütungen neuer Aufträge +25 %."
    },
    fuelMultiplier: 1.0,
    speedMultiplier: 1.0,
    type: "success"
  },
  {
    id: "weather_warning",
    name: {
      uk: "❄️ Сніговий шторм та ожеледь",
      sk: "❄️ Snehová búrka a poľadovica",
      en: "❄️ Winter Blizzard & Black Ice",
      de: "❄️ Schneesturm & Blitzeis"
    },
    desc: {
      uk: "Складні погодні умови на автобанах. Швидкість руху знижено на 15%.",
      sk: "Náročné podmienky na diaľniciach. Rýchlosť dopravy znížená o 15%.",
      en: "Adverse weather across motorways. Transport speed reduced by 15%.",
      de: "Schwierige Witterung auf Autobahnen. Fahrtempo um 15 % reduziert."
    },
    fuelMultiplier: 1.1,
    speedMultiplier: 0.85,
    type: "warning"
  }
];

// Допоміжна функція отримання перекладу
function t(key, lang = 'uk') {
  const currentLang = I18N[lang] ? lang : 'uk';
  if (I18N[currentLang] && I18N[currentLang][key] !== undefined) {
    return I18N[currentLang][key];
  }
  // Фоллбек на українську або англійську
  if (I18N.uk && I18N.uk[key] !== undefined) return I18N.uk[key];
  if (I18N.en && I18N.en[key] !== undefined) return I18N.en[key];
  return key;
}

// =============================================================================
// Локалізовані назви міст Європи (36 ключових хабів)
// =============================================================================
const CITIES_I18N = {
  kyiv:      { uk: 'Київ',      sk: 'Kyjev',      en: 'Kyiv',       de: 'Kiew' },
  lviv:      { uk: 'Львів',     sk: 'Ľvov',       en: 'Lviv',       de: 'Lemberg' },
  odesa:     { uk: 'Одеса',     sk: 'Odesa',      en: 'Odesa',      de: 'Odessa' },
  kharkiv:   { uk: 'Харків',    sk: 'Charkov',    en: 'Kharkiv',    de: 'Charkiw' },
  dnipro:    { uk: 'Дніпро',    sk: 'Dnipro',     en: 'Dnipro',     de: 'Dnipro' },
  warsaw:    { uk: 'Варшава',   sk: 'Varšava',    en: 'Warsaw',     de: 'Warschau' },
  krakow:    { uk: 'Краків',    sk: 'Krakov',     en: 'Krakow',     de: 'Krakau' },
  gdansk:    { uk: 'Гданськ',   sk: 'Gdaňsk',     en: 'Gdansk',     de: 'Danzig' },
  berlin:    { uk: 'Берлін',    sk: 'Berlín',     en: 'Berlin',     de: 'Berlin' },
  hamburg:   { uk: 'Гамбург',   sk: 'Hamburg',    en: 'Hamburg',    de: 'Hamburg' },
  frankfurt: { uk: 'Франкфурт', sk: 'Frankfurt',  en: 'Frankfurt',  de: 'Frankfurt' },
  munich:    { uk: 'Мюнхен',    sk: 'Mníchov',    en: 'Munich',     de: 'München' },
  paris:     { uk: 'Париж',     sk: 'Paríž',      en: 'Paris',      de: 'Paris' },
  lyon:      { uk: 'Ліон',      sk: 'Lyon',       en: 'Lyon',       de: 'Lyon' },
  marseille: { uk: 'Марсель',   sk: 'Marseille',  en: 'Marseille',  de: 'Marseille' },
  london:    { uk: 'Лондон',    sk: 'Londýn',     en: 'London',     de: 'London' },
  manchester:{ uk: 'Манчестер', sk: 'Manchester', en: 'Manchester', de: 'Manchester' },
  madrid:    { uk: 'Мадрид',    sk: 'Madrid',     en: 'Madrid',     de: 'Madrid' },
  barcelona: { uk: 'Барселона', sk: 'Barcelona',  en: 'Barcelona',  de: 'Barcelona' },
  valencia:  { uk: 'Валенсія',  sk: 'Valencia',   en: 'Valencia',   de: 'Valencia' },
  rome:      { uk: 'Рим',       sk: 'Rím',        en: 'Rome',       de: 'Rom' },
  milan:     { uk: 'Мілан',     sk: 'Miláno',     en: 'Milan',      de: 'Mailand' },
  naples:    { uk: 'Неаполь',   sk: 'Neapol',     en: 'Naples',     de: 'Neapel' },
  amsterdam: { uk: 'Амстердам', sk: 'Amsterdam',  en: 'Amsterdam',  de: 'Amsterdam' },
  rotterdam: { uk: 'Роттердам', sk: 'Rotterdam',  en: 'Rotterdam',  de: 'Rotterdam' },
  brussels:  { uk: 'Брюссель',  sk: 'Brusel',     en: 'Brussels',   de: 'Brüssel' },
  prague:    { uk: 'Прага',     sk: 'Praha',      en: 'Prague',     de: 'Prag' },
  bratislava:{ uk: 'Братислава',sk: 'Bratislava', en: 'Bratislava', de: 'Bratislava' },
  vienna:    { uk: 'Відень',    sk: 'Viedeň',     en: 'Vienna',     de: 'Wien' },
  budapest:  { uk: 'Будапешт',  sk: 'Budapešť',   en: 'Budapest',   de: 'Budapest' },
  zurich:    { uk: 'Цюрих',     sk: 'Zürich',     en: 'Zurich',     de: 'Zürich' },
  bucharest: { uk: 'Бухарест',  sk: 'Bukurešť',   en: 'Bucharest',  de: 'Bukarest' },
  sofia:     { uk: 'Софія',     sk: 'Sofia',      en: 'Sofia',      de: 'Sofia' },
  athens:    { uk: 'Афіни',     sk: 'Atény',      en: 'Athens',     de: 'Athen' },
  copenhagen:{ uk: 'Копенгаген',sk: 'Kodaň',      en: 'Copenhagen', de: 'Kopenhagen' },
  stockholm: { uk: 'Стокгольм', sk: 'Štokholm',   en: 'Stockholm',  de: 'Stockholm' }
};

// =============================================================================
// Локалізовані описи та категорії моделей автосалону (12 ТЗ)
// =============================================================================
const VEHICLES_I18N = {
  van_eco: {
    category: {
      uk: 'Електрофургон',
      sk: 'Elektrická dodávka',
      en: 'Electric Van',
      de: 'Elektro-Kastenwagen'
    },
    desc: {
      uk: 'Екологічний електробус. Ультра-низькі витрати на пальне.',
      sk: 'Ekologická e-dodávka. Mimoriadne nízke prevádzkové náklady.',
      en: 'Eco electric van. Ultra-low fuel and running costs.',
      de: 'Ökologischer E-Transporter mit extrem niedrigen Energiekosten.'
    }
  },
  van: {
    category: {
      uk: 'Бус / Мінівен',
      sk: 'Bus / Minivan',
      en: 'Express Van',
      de: 'Express-Transporter'
    },
    desc: {
      uk: 'Швидкий, надійний та динамічний експрес-бус.',
      sk: 'Rýchla, spoľahlivá a dynamická expresná dodávka.',
      en: 'Fast, dependable, dynamic courier van.',
      de: 'Schneller, zuverlässiger und dynamischer Express-Lieferwagen.'
    }
  },
  truck_daf: {
    category: {
      uk: 'Магістральний TIR',
      sk: 'Diaľkový ťahač TIR',
      en: 'Long-Haul Semi TIR',
      de: 'Fernverkehrs-LKW TIR'
    },
    desc: {
      uk: 'Збалансований далекобійний тягач для автобанів.',
      sk: 'Vyvážený diaľkový ťahač pre európske diaľnice.',
      en: 'Balanced highway workhorse for long-distance hauls.',
      de: 'Ausgewogene Sattelzugmaschine für europäische Autobahnen.'
    }
  },
  truck_volvo: {
    category: {
      uk: 'Потужний тягач',
      sk: 'Silný ťahač',
      en: 'Heavy Semi-Truck',
      de: 'Schwerlast-Sattelzug'
    },
    desc: {
      uk: 'Преміальний тягач високої надійності.',
      sk: 'Prémiový ťahač s vysokou spoľahlivosťou.',
      en: 'Premium long-haul truck with top-tier reliability.',
      de: 'Premium-Zugmaschine mit höchster Zuverlässigkeit.'
    }
  },
  truck_scania: {
    category: {
      uk: 'Важкий тягач TIR',
      sk: 'Ťažký ťahač TIR',
      en: 'Heavy Duty TIR',
      de: 'Schwerlast-TIR'
    },
    desc: {
      uk: 'Флагманський V8 для важких промислових вантажів.',
      sk: 'Vlajkový V8 na prepravu ťažkých priemyselných nákladov.',
      en: 'Flagship V8 for heavy industrial payloads.',
      de: 'Flaggschiff-V8 für schwere Industrietransporte.'
    }
  },
  truck_gigaliner: {
    category: {
      uk: 'Автопоїзд (Double)',
      sk: 'Cestný vlak (Gigaliner)',
      en: 'Road Train (Gigaliner)',
      de: 'EuroCombi (Gigaliner)'
    },
    desc: {
      uk: 'Подвійний зчіпний автопоїзд гігантської місткості.',
      sk: 'Dvojitá súprava s obrovskou prepravnou kapacitou.',
      en: 'Double-trailer combination with massive freight capacity.',
      de: 'Doppelgliederzug mit gigantischem Ladevolumen.'
    }
  },
  train_feeder: {
    category: {
      uk: 'Регіональний електровоз',
      sk: 'Regionálna lokomotíva',
      en: 'Regional Electric Loco',
      de: 'Regional-Elektrolok'
    },
    desc: {
      uk: 'Економічний залізничний вантажний локомотив.',
      sk: 'Úsporná nákladná elektrická lokomotíva.',
      en: 'Cost-efficient electric freight locomotive.',
      de: 'Wirtschaftliche elektrische Güterzuglokomotive.'
    }
  },
  train: {
    category: {
      uk: 'Магістральний потяг',
      sk: 'Magistrálny nákladný vlak',
      en: 'Mainline Cargo Train',
      de: 'Hauptstrecken-Güterzug'
    },
    desc: {
      uk: 'Потужний електровоз для багатотонних партій сировини.',
      sk: 'Silný rušeň na prepravu mnohotonových zásielok surovín.',
      en: 'Powerful locomotive built for heavy bulk freight.',
      de: 'Leistungsstarke Lokomotive für schwerste Güter und Rohstoffe.'
    }
  },
  train_tgv: {
    category: {
      uk: 'Швидкісний вантажний потяг',
      sk: 'Vysokorýchlostný nákladný vlak',
      en: 'High-Speed Freight Train',
      de: 'Hochgeschwindigkeits-Güterzug'
    },
    desc: {
      uk: 'Надшвидкісний потяг для термінової доставки між мегаполісами.',
      sk: 'Superrýchly vlak na expresnú prepravu medzi metropolami.',
      en: 'Ultra-fast freight train for urgent intercity express lines.',
      de: 'Superschneller Güterzug für Eiltransporte zwischen Metropolen.'
    }
  },
  plane_atr: {
    category: {
      uk: 'Регіональний літак',
      sk: 'Regionálne turbovrtuľové lietadlo',
      en: 'Regional Cargo Turboprop',
      de: 'Regionales Turboprop-Flugzeug'
    },
    desc: {
      uk: 'Швидкий турбогвинтовий транспортник для коротких рейсів.',
      sk: 'Rýchly turbovrtuľový stroj na stredné vzdialenosti.',
      en: 'Fast feeder turboprop for regional airfreight routes.',
      de: 'Schneller Turboprop-Frachter für regionale Luftfrachtrouten.'
    }
  },
  plane: {
    category: {
      uk: 'Вантажний лайнер',
      sk: 'Nákladné prúdové lietadlo',
      en: 'Cargo Jetliner',
      de: 'Großraum-Frachtjet'
    },
    desc: {
      uk: 'Міжконтинентальний вантажний літак великої швидкості.',
      sk: 'Veľkokapacitné nákladné lietadlo na dlhé trate.',
      en: 'High-speed widebody jet for trans-continental shipments.',
      de: 'Schnelles Großraumflugzeug für transkontinentale Fracht.'
    }
  },
  plane_an124: {
    category: {
      uk: 'Надважкий авіагігант',
      sk: 'Superťažký letecký gigant',
      en: 'Super-Heavy Cargo Giant',
      de: 'Superschwerer Frachtriese'
    },
    desc: {
      uk: 'Легендарний український літак для гігантських партій (до 120 т).',
      sk: 'Legendárny ukrajinský kolos na obrie náklady (až 120 t).',
      en: 'Legendary Ukrainian freighter for super-heavy cargo (up to 120 t).',
      de: 'Legendärer ukrainischer Frachtgigant für Schwerlasten (bis zu 120 t).'
    }
  }
};

// =============================================================================
// Транслітерація українських імен латиницею (для SK, EN, DE)
// =============================================================================
function transliterateUkrainian(text) {
  if (!text || typeof text !== 'string') return '';
  const map = {
    'А': 'A', 'а': 'a',
    'Б': 'B', 'б': 'b',
    'В': 'V', 'в': 'v',
    'Г': 'H', 'г': 'h',
    'Ґ': 'G', 'ґ': 'g',
    'Д': 'D', 'д': 'd',
    'Е': 'E', 'е': 'e',
    'Ж': 'Zh', 'ж': 'zh',
    'З': 'Z', 'з': 'z',
    'И': 'Y', 'и': 'y',
    'І': 'I', 'і': 'i',
    'Й': 'Y', 'й': 'y',
    'К': 'K', 'к': 'k',
    'Л': 'L', 'л': 'l',
    'М': 'M', 'м': 'm',
    'Н': 'N', 'н': 'n',
    'О': 'O', 'о': 'o',
    'П': 'P', 'п': 'p',
    'Р': 'R', 'р': 'r',
    'С': 'S', 'с': 's',
    'Т': 'T', 'т': 't',
    'У': 'U', 'у': 'u',
    'Ф': 'F', 'ф': 'f',
    'Х': 'Kh', 'х': 'kh',
    'Ц': 'Ts', 'ц': 'ts',
    'Ч': 'Ch', 'ч': 'ch',
    'Ш': 'Sh', 'ш': 'sh',
    'Щ': 'Shch', 'щ': 'shch',
    'Ь': '', 'ь': '',
    "'": '', '’': '', 'ʼ': ''
  };

  return text.split(' ').map(word => {
    let result = '';
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const isInitial = (i === 0);
      if (char === 'є' || char === 'Є') {
        result += isInitial ? (char === 'Є' ? 'Ye' : 'ye') : 'ie';
      } else if (char === 'ї' || char === 'Ї') {
        result += isInitial ? (char === 'Ї' ? 'Yi' : 'yi') : 'i';
      } else if (char === 'ю' || char === 'Ю') {
        result += isInitial ? (char === 'Ю' ? 'Yu' : 'yu') : 'iu';
      } else if (char === 'я' || char === 'Я') {
        result += isInitial ? (char === 'Я' ? 'Ya' : 'ya') : 'ia';
      } else {
        result += (map[char] !== undefined ? map[char] : char);
      }
    }
    return result;
  }).join(' ');
}

// Форматування шаблонів i18n
function tTemplate(key, vars = {}, lang = 'uk') {
  let str = t(key, lang);
  if (!str) return '';
  Object.keys(vars).forEach(v => {
    str = str.replace(new RegExp(`\\{${v}\\}`, 'g'), vars[v]);
  });
  return str;
}
