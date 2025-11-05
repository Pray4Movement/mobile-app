// Screen rendering functions

// Render Campaign Chooser screen
function renderCampaignChooser() {
    const mainContent = document.getElementById('main-content');
    const navigation = document.getElementById('navigation');
    navigation.classList.add('hidden');

    let campaigns = getCampaigns();
    let searchTerm = '';
    let selectedGroup = null;
    let selectedLanguage = null;
    let campaignCode = '';

    const updateDisplay = () => {
        // Preserve which input had focus before rebuilding
        const activeElement = document.activeElement;
        const focusedInputId = activeElement && activeElement.id &&
            (activeElement.id === 'search-input' || activeElement.id === 'code-input')
            ? activeElement.id : null;
        const cursorPosition = focusedInputId && activeElement.selectionStart ? activeElement.selectionStart : null;

        let filtered = [...campaigns];

        // Apply filters
        if (selectedGroup) {
            filtered = filterCampaignsByGroup(filtered, selectedGroup);
        }
        if (selectedLanguage) {
            filtered = filterCampaignsByLanguage(filtered, selectedLanguage);
        }
        if (searchTerm) {
            filtered = searchCampaigns(filtered, searchTerm);
        }
        if (campaignCode) {
            filtered = filterCampaignsByCode(filtered, campaignCode);
        }

        // Group by group name
        const grouped = {};
        filtered.forEach(campaign => {
            if (!grouped[campaign.group]) {
                grouped[campaign.group] = [];
            }
            grouped[campaign.group].push(campaign);
        });

        // Count total filtered campaigns
        const campaignCount = filtered.length;

        // Render
        let html = `
            <div class="screen campaign-chooser">
                <h1>Choose a Campaign</h1>

                <div class="filters">
                    <input type="text" id="search-input" placeholder="Search campaigns..." class="search-input" value="${searchTerm || ''}">
                    <input type="text" id="code-input" placeholder="Enter campaign code..." class="code-input" value="${campaignCode || ''}">
                    <select id="language-filter" class="language-filter">
                        <option value="" ${selectedLanguage === null ? 'selected' : ''}>All Languages</option>
                        <option value="en" ${selectedLanguage === 'en' ? 'selected' : ''}>English</option>
                        <option value="fr" ${selectedLanguage === 'fr' ? 'selected' : ''}>Français</option>
                        <option value="es" ${selectedLanguage === 'es' ? 'selected' : ''}>Español</option>
                        <option value="zh" ${selectedLanguage === 'zh' ? 'selected' : ''}>中文</option>
                    </select>
                </div>

                <div class="group-filters">
                    <button class="group-filter-btn ${selectedGroup === null ? 'active' : ''}" data-group="">All Groups</button>
                    <button class="group-filter-btn ${selectedGroup === 'Doxa Life' ? 'active' : ''}" data-group="Doxa Life">Doxa Life</button>
                    <button class="group-filter-btn ${selectedGroup === '110 Cities' ? 'active' : ''}" data-group="110 Cities">110 Cities</button>
                    <button class="group-filter-btn ${selectedGroup === 'Ramadan 2026' ? 'active' : ''}" data-group="Ramadan 2026">Ramadan 2026</button>
                </div>

                <p class="campaign-count" id="campaign-count">${campaignCount} ${campaignCount === 1 ? 'campaign' : 'campaigns'}</p>

                <div class="campaigns-list">
        `;

        Object.keys(grouped).sort().forEach(groupName => {
            html += `<div class="campaign-group">
                <h2 class="group-header">${groupName}</h2>
            `;

            grouped[groupName].forEach(campaign => {
                const isSubscribed = getSubscribedCampaigns().includes(campaign.id);
                html += `
                    <div class="campaign-card">
                        <h3>${campaign.name}</h3>
                        <p class="campaign-description">${campaign.description}</p>
                        <p class="campaign-code">Code: ${campaign.code}</p>
                        <button class="subscribe-btn" data-campaign-id="${campaign.id}" ${isSubscribed ? 'disabled' : ''}>
                            ${isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    </div>
                `;
            });

            html += `</div>`;
        });

        html += `
                </div>
            </div>
        `;

        mainContent.innerHTML = html;

        // Add event listeners
        document.getElementById('search-input').addEventListener('input', (e) => {
            searchTerm = e.target.value;
            updateDisplay();
        });

        document.getElementById('code-input').addEventListener('input', (e) => {
            campaignCode = e.target.value;
            updateDisplay();
        });

        // Restore focus and cursor position if an input was focused
        if (focusedInputId) {
            const input = document.getElementById(focusedInputId);
            if (input) {
                input.focus();
                if (cursorPosition !== null && input.setSelectionRange) {
                    input.setSelectionRange(cursorPosition, cursorPosition);
                }
            }
        }

        document.getElementById('language-filter').addEventListener('change', (e) => {
            selectedLanguage = e.target.value || null;
            updateDisplay();
        });

        document.querySelectorAll('.group-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.group-filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                selectedGroup = e.target.dataset.group || null;
                updateDisplay();
            });
        });

        document.querySelectorAll('.subscribe-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const campaignId = e.target.dataset.campaignId;
                subscribeToCampaign(campaignId);
                navigateTo('#prayer-feed');
            });
        });
    };

    updateDisplay();
}

// Render Prayer Feed screen
function renderPrayerFeed() {
    const mainContent = document.getElementById('main-content');
    const navigation = document.getElementById('navigation');
    navigation.classList.remove('hidden');

    const subscribed = getSubscribedCampaigns();
    const reminderSchedule = getReminderSchedule();

    if (subscribed.length === 0) {
        navigateTo('#campaign-chooser');
        return;
    }

    const prayerFuelItems = aggregatePrayerFuel(subscribed);

    // Format reminder schedule
    let scheduleText = 'No reminders set';
    if (reminderSchedule.times && reminderSchedule.times.length > 0) {
        const times = reminderSchedule.times.join(', ');
        const days = reminderSchedule.days && reminderSchedule.days.length > 0
            ? reminderSchedule.days.join(', ')
            : 'Every day';
        scheduleText = `${times} - ${days}`;
    }

    let html = `
        <div class="screen prayer-feed">
            <h1>Prayer Feed</h1>

            <div class="reminder-summary">
                <h2>Reminder Schedule</h2>
                <p>${scheduleText}</p>
                <button id="edit-reminders-btn" class="edit-reminders-btn">Edit Reminders</button>
            </div>

            <div class="prayer-fuel-list">
    `;

    if (prayerFuelItems.length === 0) {
        html += `<p class="empty-state">No prayer fuel available.</p>`;
    } else {
        // Group by date
        const groupedByDate = {};
        prayerFuelItems.forEach(item => {
            if (!groupedByDate[item.date]) {
                groupedByDate[item.date] = [];
            }
            groupedByDate[item.date].push(item);
        });

        // Sort dates (newest first)
        const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
            return new Date(b) - new Date(a);
        });

        sortedDates.forEach(date => {
            html += `
                <div class="date-group">
                    <h2 class="date-header">${formatDate(date)}</h2>
            `;

            groupedByDate[date].forEach(item => {
                const hasPrayed = hasPrayedFor(item.campaignId, item.date);
                html += `
                    <div class="prayer-fuel-item ${hasPrayed ? 'prayed' : ''}">
                        <div class="prayer-fuel-header">
                            <h3>${item.campaignName}</h3>
                            ${hasPrayed ? '<span class="prayed-indicator" title="Prayed">✓</span>' : ''}
                        </div>
                        <p class="fuel-description">${item.campaignDescription}</p>
                        <button class="view-fuel-btn" data-campaign-id="${item.campaignId}" data-date="${item.date}">
                            View Prayer Fuel
                        </button>
                    </div>
                `;
            });

            html += `</div>`;
        });
    }

    html += `
            </div>
        </div>
    `;

    mainContent.innerHTML = html;

    // Add event listeners
    document.getElementById('edit-reminders-btn').addEventListener('click', () => {
        navigateTo('#reminder-config');
    });

    document.querySelectorAll('.view-fuel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const campaignId = e.target.dataset.campaignId;
            const date = e.target.dataset.date;
            navigateTo(`#prayer-fuel/${campaignId}/${date}`);
        });
    });
}

// Render Prayer Fuel screen
function renderPrayerFuel(campaignId, date) {
    const mainContent = document.getElementById('main-content');
    const navigation = document.getElementById('navigation');
    navigation.classList.remove('hidden');

    const campaign = getCampaignById(campaignId);
    if (!campaign) {
        navigateTo('#prayer-feed');
        return;
    }

    const selectedLanguage = getCampaignLanguage(campaignId);

    let html = `
        <div class="screen prayer-fuel">
            <h1>${campaign.name}</h1>
            <p class="fuel-date">${formatDate(date)}</p>

            <div class="fuel-actions">
                <button id="share-fuel-btn" class="share-btn">Share</button>
                <select id="fuel-language-select" class="language-select">
                    <option value="en" ${selectedLanguage === 'en' ? 'selected' : ''}>English</option>
                    <option value="fr" ${selectedLanguage === 'fr' ? 'selected' : ''}>Français</option>
                    <option value="es" ${selectedLanguage === 'es' ? 'selected' : ''}>Español</option>
                    <option value="zh" ${selectedLanguage === 'zh' ? 'selected' : ''}>中文</option>
                </select>
            </div>

            <div class="fuel-content">
                <h2>Lorem Ipsum Dolor Sit Amet</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

                <h3>Consectetur Adipiscing</h3>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

                <ul>
                    <li>Sed ut perspiciatis unde omnis iste natus error</li>
                    <li>Sit voluptatem accusantium doloremque laudantium</li>
                    <li>Totam rem aperiam, eaque ipsa quae ab illo</li>
                    <li>Inventore veritatis et quasi architecto beatae</li>
                </ul>

                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

                <h3>Neque Porro Quisquam</h3>
                <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>
            </div>

            <button id="i-prayed-btn" class="i-prayed-btn">I Prayed</button>
        </div>
    `;

    mainContent.innerHTML = html;

    // Add event listeners
    document.getElementById('share-fuel-btn').addEventListener('click', () => {
        alert('Share functionality would be implemented here');
    });

    document.getElementById('fuel-language-select').addEventListener('change', (e) => {
        saveCampaignLanguage(campaignId, e.target.value);
    });

    const hasPrayed = hasPrayedFor(campaignId, date);

    document.getElementById('i-prayed-btn').addEventListener('click', () => {
        // Store timestamp (for future API integration)
        const timestamp = new Date().toISOString();
        localStorage.setItem(`prayerTimestamp_${campaignId}_${date}`, timestamp);
        navigateTo('#prayer-feed');
    });

    // Update button text if already prayed
    if (hasPrayed) {
        const btn = document.getElementById('i-prayed-btn');
        btn.textContent = '✓ Prayed';
        btn.classList.add('prayed');
    }
}

// Render Campaigns screen
function renderCampaigns() {
    const mainContent = document.getElementById('main-content');
    const navigation = document.getElementById('navigation');
    navigation.classList.remove('hidden');

    const subscribed = getSubscribedCampaigns();

    if (subscribed.length === 0) {
        navigateTo('#campaign-chooser');
        return;
    }

    let html = `
        <div class="screen campaigns">
            <h1>My Campaigns</h1>

            <div class="campaigns-list">
    `;

    subscribed.forEach(campaignId => {
        const campaign = getCampaignById(campaignId);
        if (!campaign) return;

        const selectedLanguage = getCampaignLanguage(campaignId);

        html += `
            <div class="campaign-item">
                <div class="campaign-info">
                    <h3>${campaign.name}</h3>
                    <p class="campaign-description">${campaign.description}</p>
                </div>
                <div class="campaign-actions">
                    <button class="kebab-menu-btn" data-campaign-id="${campaignId}">⋮</button>
                    <div class="kebab-menu hidden" id="menu-${campaignId}">
                        <button class="menu-item" data-action="unsubscribe" data-campaign-id="${campaignId}">Unsubscribe</button>
                        <button class="menu-item" data-action="change-language" data-campaign-id="${campaignId}">Change Language</button>
                        <button class="menu-item" data-action="share" data-campaign-id="${campaignId}">Share Campaign</button>
                    </div>
                </div>
            </div>
        `;
    });

    html += `
            </div>

            <button id="find-new-campaign-btn" class="find-new-btn">Find New Campaign</button>
        </div>
    `;

    mainContent.innerHTML = html;

    // Add event listeners
    document.querySelectorAll('.kebab-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const campaignId = e.target.dataset.campaignId;
            const menu = document.getElementById(`menu-${campaignId}`);

            // Close all other menus
            document.querySelectorAll('.kebab-menu').forEach(m => {
                if (m.id !== `menu-${campaignId}`) {
                    m.classList.add('hidden');
                }
            });

            menu.classList.toggle('hidden');
        });
    });

    document.querySelectorAll('[data-action="unsubscribe"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const campaignId = e.target.dataset.campaignId;
            if (confirm('Are you sure you want to unsubscribe from this campaign?')) {
                unsubscribeFromCampaign(campaignId);
                renderCampaigns();
            }
        });
    });

    document.querySelectorAll('[data-action="change-language"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const campaignId = e.target.dataset.campaignId;
            const currentLang = getCampaignLanguage(campaignId);
            const languages = ['en', 'fr', 'es', 'zh'];
            const langNames = ['English', 'Français', 'Español', '中文'];
            const currentIndex = languages.indexOf(currentLang);
            const nextIndex = (currentIndex + 1) % languages.length;
            saveCampaignLanguage(campaignId, languages[nextIndex]);
            renderCampaigns();
        });
    });

    document.querySelectorAll('[data-action="share"]').forEach(btn => {
        btn.addEventListener('click', () => {
            alert('Share functionality would be implemented here');
        });
    });

    document.getElementById('find-new-campaign-btn').addEventListener('click', () => {
        navigateTo('#campaign-chooser');
    });

    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.campaign-actions')) {
            document.querySelectorAll('.kebab-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });
}

// Render Reminder Config screen
function renderReminderConfig() {
    const mainContent = document.getElementById('main-content');
    const navigation = document.getElementById('navigation');
    navigation.classList.remove('hidden');

    const schedule = getReminderSchedule();
    const times = schedule.times || [];
    const days = schedule.days || [];

    const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    let html = `
        <div class="screen reminder-config">
            <h1>Reminder Settings</h1>

            <div class="times-section">
                <h2>Reminder Times</h2>
                <div id="times-container">
    `;

    times.forEach((time, index) => {
        html += `
            <div class="time-input-group">
                <input type="time" value="${time}" class="time-input" data-index="${index}">
                <button class="remove-time-btn" data-index="${index}">Remove</button>
            </div>
        `;
    });

    html += `
                </div>
                <button id="add-time-btn" class="add-time-btn">Add Time</button>
            </div>

            <div class="days-section">
                <h2>Days of Week</h2>
    `;

    dayOptions.forEach(day => {
        const isChecked = days.includes(day);
        html += `
            <label class="day-checkbox">
                <input type="checkbox" value="${day}" ${isChecked ? 'checked' : ''}>
                ${day}
            </label>
        `;
    });

    html += `
            </div>

            <div class="reminder-actions">
                <button id="save-reminders-btn" class="save-btn">Save</button>
                <button id="cancel-reminders-btn" class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;

    mainContent.innerHTML = html;

    // Add event listeners
    document.getElementById('add-time-btn').addEventListener('click', () => {
        const container = document.getElementById('times-container');
        const index = container.children.length;
        const html = `
            <div class="time-input-group">
                <input type="time" class="time-input" data-index="${index}">
                <button class="remove-time-btn" data-index="${index}">Remove</button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);

        // Add remove listener to new button
        document.querySelector(`.remove-time-btn[data-index="${index}"]`).addEventListener('click', (e) => {
            e.target.closest('.time-input-group').remove();
        });
    });

    document.querySelectorAll('.remove-time-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.time-input-group').remove();
        });
    });

    document.getElementById('save-reminders-btn').addEventListener('click', () => {
        const timeInputs = document.querySelectorAll('.time-input');
        const times = Array.from(timeInputs).map(input => input.value).filter(v => v);

        const dayCheckboxes = document.querySelectorAll('.days-section input[type="checkbox"]');
        const days = Array.from(dayCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        saveReminderSchedule({ times, days });
        navigateTo('#prayer-feed');
    });

    document.getElementById('cancel-reminders-btn').addEventListener('click', () => {
        navigateTo('#prayer-feed');
    });
}

