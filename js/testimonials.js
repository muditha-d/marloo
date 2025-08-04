// ===============================
// TESTIMONIALS FUNCTIONALITY
// ===============================

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    webAppUrl: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec',
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    apiKey: 'YOUR_API_KEY',
    range: 'Sheet1!A:J'
};

// Global variables
let testimonialsData = [];
let isFormSubmitting = false;

// Initialize testimonials functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Testimonials page loaded');
    initializeTestimonials();
    initializeForm();
});

// Initialize testimonials loading
function initializeTestimonials() {
    loadTestimonials();
    setInterval(loadTestimonials, 300000); // Refresh every 5 minutes
}

// Load testimonials from Google Sheets
async function loadTestimonials() {
    const container = document.getElementById('liveTestimonials');

    if (!container) {
        console.error('Testimonials container not found');
        return;
    }

    try {
        showLoadingState();

        if (!isConfigurationValid()) {
            showConfigurationMessage();
            return;
        }

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/values/${GOOGLE_SHEETS_CONFIG.range}?key=${GOOGLE_SHEETS_CONFIG.apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.values && data.values.length > 1) {
            testimonialsData = data.values;
            displayTestimonials(data.values);
            updateStats(data.values);
        } else {
            showEmptyState();
        }

    } catch (error) {
        console.error('Error loading testimonials:', error);
        showErrorState();
    }
}

// Check if Google Sheets configuration is valid
function isConfigurationValid() {
    return GOOGLE_SHEETS_CONFIG.spreadsheetId !== 'YOUR_SPREADSHEET_ID' &&
           GOOGLE_SHEETS_CONFIG.apiKey !== 'YOUR_API_KEY' &&
           GOOGLE_SHEETS_CONFIG.webAppUrl !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
}

// Display testimonials
function displayTestimonials(rows) {
    const container = document.getElementById('liveTestimonials');
    const headers = rows[0];
    const testimonials = rows.slice(1);

    const publishedTestimonials = testimonials.filter(row => 
        row[7] && (row[7].toLowerCase() === 'yes' || row[7].toLowerCase() === 'true')
    );

    if (publishedTestimonials.length === 0) {
        showEmptyState();
        return;
    }

    publishedTestimonials.sort((a, b) => new Date(b[0]) - new Date(a[0]));
    const testimonialsToShow = publishedTestimonials.slice(0, 6);

    container.innerHTML = testimonialsToShow.map((row, index) => {
        const [timestamp, clientName, organization, position, serviceType, rating, testimonialText, publishPermission, contactPermission, projectDate] = row;

        return createTestimonialCard({
            timestamp,
            clientName: clientName || 'Anonymous',
            organization: organization || 'Valued Client',
            position: position || '',
            serviceType: serviceType || 'Professional Services',
            rating: parseInt(rating) || 5,
            testimonialText: testimonialText || '',
            projectDate: projectDate || '',
            isNew: index === 0
        });
    }).join('');
}

// Create testimonial card
function createTestimonialCard(testimonial) {
    const {
        timestamp,
        clientName,
        organization,
        position,
        serviceType,
        rating,
        testimonialText,
        projectDate,
        isNew
    } = testimonial;

    const starsHtml = generateStars(rating);
    const dateDisplay = projectDate ? 
        `Project: ${formatProjectDate(projectDate)}` : 
        `Submitted: ${formatDate(timestamp)}`;

    return `
        <div class="service-card testimonial-card ${isNew ? 'new-testimonial' : ''}" data-rating="${rating}">
            <div class="testimonial-header">
                <div class="testimonial-stars">
                    ${starsHtml}
                </div>
                <div class="testimonial-meta">
                    <h4>${escapeHtml(organization)}</h4>
                    <p>${escapeHtml(serviceType)}</p>
                </div>
            </div>
            <div class="testimonial-body">
                <p>"${escapeHtml(testimonialText)}"</p>
            </div>
            <div class="testimonial-footer">
                <strong>${escapeHtml(clientName)}</strong> - ${escapeHtml(position)}
                <div class="testimonial-date">${dateDisplay}</div>
            </div>
        </div>
    `;
}
