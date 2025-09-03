// CritiqueByCriteria Component
class CritiqueByCriteria {
    constructor(container) {
        this.container = container;
        this.currentMode = 'assess';
        this.criteria = [
            {
                id: 1,
                title: "Code Quality & Structure",
                description: "Evaluate the overall organization, readability, and maintainability of the code",
                points: [
                    "Clear and consistent naming conventions",
                    "Proper code organization and modularity",
                    "Appropriate use of design patterns",
                    "Code reusability and DRY principles"
                ],
                rating: 0,
                status: "pending"
            },
            {
                id: 2,
                title: "Performance & Optimization",
                description: "Assess the efficiency and performance characteristics of the implementation",
                points: [
                    "Algorithm efficiency and time complexity",
                    "Memory usage optimization",
                    "Database query optimization",
                    "Caching strategies implementation"
                ],
                rating: 0,
                status: "incomplete"
            },
            {
                id: 3,
                title: "Security & Best Practices",
                description: "Review security measures and adherence to industry best practices",
                points: [
                    "Input validation and sanitization",
                    "Authentication and authorization",
                    "Data encryption and protection",
                    "Secure coding practices"
                ],
                rating: 0,
                status: "pending"
            },
            {
                id: 4,
                title: "Testing & Documentation",
                description: "Evaluate test coverage, quality, and documentation completeness",
                points: [
                    "Unit test coverage and quality",
                    "Integration test implementation",
                    "API documentation completeness",
                    "Code comments and inline documentation"
                ],
                rating: 0,
                status: "incomplete"
            },
            {
                id: 5,
                title: "User Experience & Interface",
                description: "Assess the usability and user interface design quality",
                points: [
                    "Intuitive user interface design",
                    "Responsive design implementation",
                    "Accessibility compliance",
                    "User workflow optimization"
                ],
                rating: 0,
                status: "pending"
            },
            {
                id: 6,
                title: "Error Handling & Resilience",
                description: "Review error handling mechanisms and system resilience",
                points: [
                    "Comprehensive error handling",
                    "Graceful degradation strategies",
                    "Logging and monitoring implementation",
                    "Recovery mechanisms"
                ],
                rating: 0,
                status: "incomplete"
            }
        ];
        
        this.init();
    }
    
    init() {
        this.render();
        this.bindEvents();
    }
    
    setMode(mode) {
        this.currentMode = mode;
        this.container.className = `critique-container ${mode}-mode`;
        this.render();
    }
    
    render() {
        const criteriaCards = this.criteria.map(criterion => this.createCriteriaCard(criterion)).join('');
        this.container.innerHTML = criteriaCards;
        this.bindRatingEvents();
    }
    
    createCriteriaCard(criterion) {
        const pointsList = criterion.points.map(point => `<li>${point}</li>`).join('');
        
        return `
            <div class="criteria-card" data-criterion-id="${criterion.id}">
                <div class="status-indicator ${criterion.status}"></div>
                <div class="criteria-header">
                    <h3 class="criteria-title">${criterion.title}</h3>
                    <p class="criteria-description">${criterion.description}</p>
                    
                    <!-- CURRENT ISSUE: Stars positioned at bottom right of header -->
                    <div class="rating-stars" data-criterion-id="${criterion.id}">
                        ${this.createStars(criterion.rating)}
                        <span class="rating-value">${criterion.rating}/5</span>
                    </div>
                </div>
                
                <div class="criteria-content">
                    <ul class="criteria-points">
                        ${pointsList}
                    </ul>
                </div>
            </div>
        `;
    }
    
    createStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const activeClass = i <= rating ? 'active' : '';
            stars += `<span class="star ${activeClass}" data-rating="${i}">★</span>`;
        }
        return stars;
    }
    
    bindEvents() {
        // Mode toggle events are handled in the main script
    }
    
    bindRatingEvents() {
        const ratingContainers = this.container.querySelectorAll('.rating-stars');
        
        ratingContainers.forEach(container => {
            const criterionId = parseInt(container.dataset.criterionId);
            const stars = container.querySelectorAll('.star');
            
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    const rating = parseInt(e.target.dataset.rating);
                    this.updateRating(criterionId, rating);
                });
                
                star.addEventListener('mouseenter', (e) => {
                    const rating = parseInt(e.target.dataset.rating);
                    this.highlightStars(stars, rating);
                });
            });
            
            container.addEventListener('mouseleave', () => {
                const criterion = this.criteria.find(c => c.id === criterionId);
                this.highlightStars(stars, criterion.rating);
            });
        });
    }
    
    highlightStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    updateRating(criterionId, rating) {
        const criterion = this.criteria.find(c => c.id === criterionId);
        if (criterion) {
            criterion.rating = rating;
            criterion.status = rating > 0 ? 'complete' : 'pending';
            
            // Update the display
            const ratingContainer = this.container.querySelector(`[data-criterion-id="${criterionId}"] .rating-stars`);
            const ratingValue = ratingContainer.querySelector('.rating-value');
            const statusIndicator = this.container.querySelector(`[data-criterion-id="${criterionId}"] .status-indicator`);
            
            // Update stars
            const stars = ratingContainer.querySelectorAll('.star');
            this.highlightStars(stars, rating);
            
            // Update rating value
            ratingValue.textContent = `${rating}/5`;
            
            // Update status indicator
            statusIndicator.className = `status-indicator ${criterion.status}`;
        }
    }
}

// Main Application
class App {
    constructor() {
        this.critiqueComponent = null;
        this.currentMode = 'assess';
        this.init();
    }
    
    init() {
        const container = document.getElementById('critiqueContainer');
        this.critiqueComponent = new CritiqueByCriteria(container);
        this.critiqueComponent.setMode(this.currentMode);
        
        this.bindModeToggle();
    }
    
    bindModeToggle() {
        const assessBtn = document.getElementById('assessBtn');
        const critiqueBtn = document.getElementById('critiqueBtn');
        
        assessBtn.addEventListener('click', () => {
            this.setMode('assess');
            assessBtn.classList.add('active');
            critiqueBtn.classList.remove('active');
        });
        
        critiqueBtn.addEventListener('click', () => {
            this.setMode('critique');
            critiqueBtn.classList.add('active');
            assessBtn.classList.remove('active');
        });
    }
    
    setMode(mode) {
        this.currentMode = mode;
        this.critiqueComponent.setMode(mode);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});