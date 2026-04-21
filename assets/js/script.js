document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. FAQ Accordion Logic (scrollHeight for ultra-fluid animation)
    // =========================================================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('.material-symbols-outlined');

            if (answer) {
                // Close all other FAQ items first
                document.querySelectorAll('.faq-answer').forEach(other => {
                    if (other !== answer) {
                        other.classList.remove('show');
                        other.style.maxHeight = null;
                        const otherIcon = other.previousElementSibling.querySelector('.material-symbols-outlined');
                        if (otherIcon) otherIcon.textContent = 'add';
                    }
                });

                // Toggle clicked item
                answer.classList.toggle('show');
                if (answer.classList.contains('show')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    if (icon) icon.textContent = 'remove';
                } else {
                    answer.style.maxHeight = null;
                    if (icon) icon.textContent = 'add';
                }
            }
        });
    });

    // =========================================================================
    // 2. Editorial Testimonials Slider (fade-in/out + arrows + auto-play)
    // =========================================================================
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const counterEl = document.getElementById('testimonial-current');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.remove('absolute', 'opacity-0', 'pointer-events-none');
                slide.style.opacity = '1';
                slide.style.transform = 'translateY(0)';
            } else {
                slide.classList.add('absolute', 'opacity-0', 'pointer-events-none');
                slide.style.opacity = '0';
                slide.style.transform = 'translateY(12px)';
            }
        });
        if (counterEl) counterEl.textContent = String(index + 1).padStart(2, '0');
        currentSlide = index;
    }

    if (slides.length > 0) {
        showSlide(0);

        // Auto-play every 5 seconds
        let autoPlay = setInterval(() => {
            showSlide((currentSlide + 1) % totalSlides);
        }, 5000);

        function resetAutoPlay() {
            clearInterval(autoPlay);
            autoPlay = setInterval(() => {
                showSlide((currentSlide + 1) % totalSlides);
            }, 5000);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide((currentSlide - 1 + totalSlides) % totalSlides);
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide((currentSlide + 1) % totalSlides);
                resetAutoPlay();
            });
        }
    }

    // =========================================================================
    // 3. Mobile Menu Toggle
    // =========================================================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
            if (icon) {
                icon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
            }
        });
    }

    // =========================================================================
    // 4. Form Validation & Success Feedback
    // =========================================================================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (form.checkValidity()) {
                alert('Merci ! Votre demande a été envoyée avec succès. Un expert vous rappellera dans les plus brefs délais.');
                form.reset();
            } else {
                alert('Veuillez remplir tous les champs obligatoires.');
            }
        });
    });

    // =========================================================================
    // 5. Blog Category Filter (blog.html)
    // =========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (filterBtns.length > 0 && blogCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-category');

                // Update active state on buttons
                filterBtns.forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary');
                    b.classList.add('bg-surface-container-high', 'text-on-surface-variant');
                });
                btn.classList.add('bg-primary', 'text-on-primary');
                btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');

                // Animate & filter cards
                blogCards.forEach(card => {
                    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // =========================================================================
    // 6. Blog Detail Dynamic Injection (blog-detail.html)
    // =========================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const isBlogDetailPage = window.location.pathname.includes('blog-detail');

    if (isBlogDetailPage && typeof blogPosts !== 'undefined') {
        if (!postId) {
            // No ID in URL → redirect to blog listing
            window.location.href = 'blog.html';
            return;
        }

        const post = blogPosts.find(p => p.id === postId);

        if (!post) {
            // Invalid ID → redirect to blog listing
            window.location.href = 'blog.html';
            return;
        }

        // Inject article data into the page
        const titleEl = document.getElementById('article-title');
        const breadcrumbEl = document.getElementById('breadcrumb-article-title');
        const badgeEl = document.getElementById('article-badge');
        const dateEl = document.getElementById('article-date');
        const imageEl = document.getElementById('article-image');
        const contentEl = document.getElementById('article-content');

        if (titleEl) titleEl.textContent = post.title;
        if (breadcrumbEl) breadcrumbEl.textContent = post.title;
        if (badgeEl) badgeEl.textContent = post.category;
        if (dateEl) dateEl.textContent = post.date;
        if (imageEl) {
            imageEl.src = post.image;
            imageEl.alt = post.title;
        }
        if (contentEl) contentEl.innerHTML = post.content;

        // Update the page <title> for SEO
        document.title = post.title + ' | Plomberie Express';

        // ── Related Articles (same category, then random fill) ──
        const relatedContainer = document.getElementById('related-articles-container');
        if (relatedContainer) {
            // Get articles from the same category (excluding current)
            let related = blogPosts
                .filter(p => p.id !== postId && p.category === post.category);

            // If not enough, fill with other articles
            if (related.length < 2) {
                const others = blogPosts
                    .filter(p => p.id !== postId && !related.includes(p));
                related = related.concat(others);
            }

            // Shuffle for variety and take 2
            related = related.sort(() => Math.random() - 0.5).slice(0, 2);

            relatedContainer.innerHTML = related.map(p => `
                <a href="blog-detail.html?id=${p.id}" class="group">
                    <div class="aspect-video overflow-hidden mb-4">
                        <img class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src="${p.image}" alt="${p.title}">
                    </div>
                    <h4 class="font-bold text-lg group-hover:text-primary transition-colors">${p.title}</h4>
                </a>
            `).join('');
        }
    }

});
