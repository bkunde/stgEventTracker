// Event Store Management
const EventStore = {
    // Initialize with sample data if empty
    init() {
        if (!localStorage.getItem('events')) {
            const sampleEvents = [
                {
                    id: '1',
                    title: 'Jazz in the Park',
                    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
                    time: '18:00',
                    location: 'Central Park Amphitheater',
                    category: 'music',
                    description: 'An evening of smooth jazz featuring local artists. Bring your own blanket and refreshments.',
                    image: 'http://static.photos/music/640x360/1',
                    attendees: 42,
                    created: Date.now()
                },
                {
                    id: '2',
                    title: 'Tech Startup Meetup',
                    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
                    time: '19:00',
                    location: 'Innovation Hub Downtown',
                    category: 'tech',
                    description: 'Network with local entrepreneurs and developers. Pizza and drinks provided!',
                    image: 'http://static.photos/technology/640x360/2',
                    attendees: 28,
                    created: Date.now()
                },
                {
                    id: '3',
                    title: 'Weekend Farmers Market',
                    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
                    time: '09:00',
                    location: 'Town Square',
                    category: 'food',
                    description: 'Fresh local produce, artisanal breads, and handmade crafts. Support local farmers!',
                    image: 'http://static.photos/food/640x360/3',
                    attendees: 156,
                    created: Date.now()
                },
                {
                    id: '4',
                    title: 'Abstract Art Exhibition',
                    date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
                    time: '17:00',
                    location: 'City Art Gallery',
                    category: 'art',
                    description: 'Featuring contemporary works from 12 emerging local artists. Free entry.',
                    image: 'http://static.photos/abstract/640x360/4',
                    attendees: 67,
                    created: Date.now()
                },
                {
                    id: '5',
                    title: 'Community Yoga Session',
                    date: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
                    time: '07:00',
                    location: 'Riverside Park',
                    category: 'community',
                    description: 'Start your day with a relaxing yoga session. All skill levels welcome. Bring a mat!',
                    image: 'http://static.photos/outdoor/640x360/5',
                    attendees: 23,
                    created: Date.now()
                },
                {
                    id: '6',
                    title: 'Local Basketball Tournament',
                    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
                    time: '14:00',
                    location: 'Community Recreation Center',
                    category: 'sports',
                    description: '3-on-3 tournament with prizes for winners. Spectators welcome!',
                    image: 'http://static.photos/sport/640x360/6',
                    attendees: 89,
                    created: Date.now()
                }
            ];
            localStorage.setItem('events', JSON.stringify(sampleEvents));
        }
    },

    getAll() {
        return JSON.parse(localStorage.getItem('events') || '[]');
    },

    add(event) {
        const events = this.getAll();
        event.id = Date.now().toString();
        event.created = Date.now();
        event.attendees = Math.floor(Math.random() * 50) + 10;
        events.push(event);
        localStorage.setItem('events', JSON.stringify(events));
        return event;
    },

    update(id, updatedEvent) {
        const events = this.getAll();
        const index = events.findIndex(e => e.id === id);
        if (index !== -1) {
            events[index] = { ...events[index], ...updatedEvent };
            localStorage.setItem('events', JSON.stringify(events));
            return events[index];
        }
        return null;
    },

    delete(id) {
        const events = this.getAll().filter(e => e.id !== id);
        localStorage.setItem('events', JSON.stringify(events));
    },

    getById(id) {
        return this.getAll().find(e => e.id === id);
    }
};

// State Management
const state = {
    filterCategory: 'all',
    filterDate: 'all',
    searchQuery: '',
    editingId: null
};

// Category Config
const categories = {
    music: { icon: 'music', label: 'Music', color: 'from-purple-500 to-pink-500' },
    sports: { icon: 'trophy', label: 'Sports', color: 'from-orange-500 to-red-500' },
    art: { icon: 'palette', label: 'Art', color: 'from-cyan-500 to-blue-500' },
    food: { icon: 'utensils', label: 'Food', color: 'from-yellow-500 to-orange-500' },
    tech: { icon: 'cpu', label: 'Tech', color: 'from-blue-500 to-indigo-500' },
    community: { icon: 'users', label: 'Community', color: 'from-emerald-500 to-green-600' }
};

// Date Helpers
const isToday = (dateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
};

const isThisWeek = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date >= today && date <= weekFromNow;
};

const isThisMonth = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const formatDate = (dateStr) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
};

const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes} ${period}`;
};

// UI Functions
function renderEvents() {
    const grid = document.getElementById('eventsGrid');
    const emptyState = document.getElementById('emptyState');
    let events = EventStore.getAll();

    // Apply filters
    if (state.filterCategory !== 'all') {
        events = events.filter(e => e.category === state.filterCategory);
    }

    if (state.filterDate === 'today') {
        events = events.filter(e => isToday(e.date));
    } else if (state.filterDate === 'week') {
        events = events.filter(e => isThisWeek(e.date));
    } else if (state.filterDate === 'month') {
        events = events.filter(e => isThisMonth(e.date));
    }

    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        events = events.filter(e => 
            e.title.toLowerCase().includes(query) || 
            e.location.toLowerCase().includes(query) ||
            e.description.toLowerCase().includes(query)
        );
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (events.length === 0) {
        grid.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    grid.innerHTML = events.map(event => {
        const cat = categories[event.category];
        const isEventToday = isToday(event.date);
        
        return `
        <article class="event-card bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer group" onclick="showDetails('${event.id}')">
            <div class="relative h-48 overflow-hidden">
                <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy">
                <div class="absolute top-4 left-4">
                    <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-gray-200 backdrop-blur-sm">
                        <i data-lucide="${cat.icon}" class="w-3 h-3"></i>
                        ${cat.label}
                    </span>
                </div>
                ${isEventToday ? `
                <div class="absolute top-4 right-4">
                    <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg animate-pulse">
                        TODAY
                    </span>
                </div>
                ` : ''}
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p class="text-white text-sm font-medium flex items-center gap-1">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        ${formatDate(event.date)} • ${formatTime(event.time)}
                    </p>
                </div>
            </div>
            
            <div class="p-5">
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">${event.title}</h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">${event.description}</p>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <i data-lucide="map-pin" class="w-4 h-4 text-primary-500"></i>
                        <span class="line-clamp-1">${event.location}</span>
                    </div>
                    <div class="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <i data-lucide="users" class="w-4 h-4"></i>
                        <span>${event.attendees}</span>
                    </div>
                </div>
            </div>
            
            <div class="px-5 pb-5 flex gap-2">
                <button onclick="event.stopPropagation(); rsvpEvent('${event.id}')" class="flex-1 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-600 text-sm font-medium hover:bg-primary-900 dark:hover:bg-primary-900/50 transition-colors">
                    I'm Going
                </button>
                <button onclick="event.stopPropagation(); editEvent('${event.id}')" class="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="event.stopPropagation(); deleteEvent('${event.id}')" class="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </article>
        `;
    }).join('');

    lucide.createIcons();
}

// Modal Functions
function openModal(editId = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');
    const title = document.getElementById('modalTitle');
    
    if (editId) {
        const event = EventStore.getById(editId);
        if (event) {
            title.textContent = 'Edit Event';
            document.getElementById('eventId').value = event.id;
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventTime').value = event.time;
            document.getElementById('eventLocation').value = event.location;
            document.getElementById('eventCategory').value = event.category;
            document.getElementById('eventDescription').value = event.description;
            state.editingId = editId;
        }
    } else {
        title.textContent = 'Add New Event';
        form.reset();
        document.getElementById('eventId').value = '';
        document.getElementById('eventDate').value = new Date().toISOString().split('T')[0];
        state.editingId = null;
    }
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('eventModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    state.editingId = null;
}

function showDetails(id) {
    const event = EventStore.getById(id);
    if (!event) return;
    
    const cat = categories[event.category];
    const modal = document.getElementById('detailsModal');
    const content = document.getElementById('detailsContent');
    
    content.innerHTML = `
        <div class="relative h-64 md:h-80">
            <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <button onclick="closeDetailsModal()" class="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-sm transition-colors">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
            <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm mb-3">
                    <i data-lucide="${cat.icon}" class="w-3 h-3"></i>
                    ${cat.label}
                </span>
                <h2 class="text-3xl font-bold mb-2">${event.title}</h2>
                <div class="flex flex-wrap items-center gap-4 text-sm">
                    <span class="flex items-center gap-1">
                        <i data-lucide="calendar" class="w-4 h-4"></i>
                        ${formatDate(event.date)}
                    </span>
                    <span class="flex items-center gap-1">
                        <i data-lucide="clock" class="w-4 h-4"></i>
                        ${formatTime(event.time)}
                    </span>
                    <span class="flex items-center gap-1">
                        <i data-lucide="users" class="w-4 h-4"></i>
                        ${event.attendees} attending
                    </span>
                </div>
            </div>
        </div>
        
        <div class="p-6 md:p-8">
            <div class="flex items-start gap-3 mb-6">
                <div class="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400 mt-1">
                    <i data-lucide="map-pin" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-1">Location</h3>
                    <p class="text-gray-600 dark:text-gray-400">${event.location}</p>
                    <button class="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium" onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(event.location)}', '_blank')">
                        View on Map →
                    </button>
                </div>
            </div>
            
            <div class="mb-6">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 mb-2">About this event</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed">${event.description}</p>
            </div>
            
            <div class="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button onclick="rsvpEvent('${event.id}'); closeDetailsModal()" class="flex-1 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors shadow-lg shadow-primary-600/25 flex items-center justify-center gap-2">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                    RSVP Now
                </button>
                <button onclick="editEvent('${event.id}'); closeDetailsModal()" class="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <i data-lucide="pencil" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Event Actions
function editEvent(id) {
    openModal(id);
}

function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        EventStore.delete(id);
        renderEvents();
    }
}

function rsvpEvent(id) {
    const event = EventStore.getById(id);
    if (event) {
        event.attendees += 1;
        EventStore.update(id, event);
        
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-0 transition-transform z-50 flex items-center gap-2';
        notification.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i> You are going to this event!';
        document.body.appendChild(notification);
        lucide.createIcons();
        
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        renderEvents();
    }
}

// Form Handler
document.getElementById('eventForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventData = {
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value,
        category: document.getElementById('eventCategory').value,
        description: document.getElementById('eventDescription').value,
        image: `http://static.photos/${document.getElementById('eventCategory').value}/640x360/${Math.floor(Math.random() * 100)}`
    };
    
    if (state.editingId) {
        EventStore.update(state.editingId, eventData);
    } else {
        EventStore.add(eventData);
    }
    
    closeModal();
    renderEvents();
});

// Filter Handlers
document.getElementById('categoryFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    state.filterCategory = btn.dataset.category;
    renderEvents();
});

document.getElementById('dateFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.date-btn');
    if (!btn) return;
    
    document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    state.filterDate = btn.dataset.date;
    renderEvents();
});

// Search Handlers
const handleSearch = (e) => {
    state.searchQuery = e.target.value;
    renderEvents();
};

document.getElementById('searchInput').addEventListener('input', handleSearch);
document.getElementById('mobileSearchInput').addEventListener('input', handleSearch);

// Dark Mode
function toggleDarkMode() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Initialize
function init() {
    // Check theme preference
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }
    
    // Check geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            () => {
                document.getElementById('locationText').textContent = 'Events near you';
            },
            () => {
                document.getElementById('locationText').textContent = 'All locations';
            }
        );
    } else {
        document.getElementById('locationText').textContent = 'All locations';
    }
    
    EventStore.init();
    renderEvents();
    
    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDetailsModal();
        }
    });
}

init();
