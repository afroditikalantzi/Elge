const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdown = document.querySelector('.dropdown');
const footerYear = document.querySelector('.footer-copy p');
const navItems = document.querySelectorAll('.nav-links a');
const aboutSection = document.querySelector('.about-us');
const statCounters = document.querySelectorAll('.about-extra-item h3');
const serviceItems = document.querySelectorAll('.service-item');

// Set active page in navigation
function setActivePage() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Don't set any active classes on placeholder pages
  if (currentPage === 'placeholder.html') {
    return;
  }
  
  navItems.forEach(item => {
    // Remove active class from all items first
    item.classList.remove('active');
    
    // Get the href attribute
    const href = item.getAttribute('href');
    
    // Skip dropdown toggle links (they should never be active)
    if (item.classList.contains('dropdown-toggle')) {
      return;
    }
    
    // If href matches current page or if we're on home page and href is index.html or #
    if (href === currentPage || 
        (currentPage === '' && (href === 'index.html' || href === '#')) ||
        (currentPage === 'index.html' && (href === 'index.html' || href === '#'))) {
      item.classList.add('active');
    }
  });
}

// Toggle hamburger menu with smooth transition
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active'); // Toggle active class for hamburger animation
});

// Toggle submenu on clicking "Services" (only for mobile) with smooth transition
dropdownToggle.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) { // Only trigger on small screens
    e.preventDefault(); // Prevent default link behavior
    dropdown.classList.toggle('open');
  }
});

// Toggle dropdown on hover for desktop
dropdown.addEventListener('mouseenter', () => {
  if (window.innerWidth > 768) { // Only trigger on larger screens
    dropdown.classList.add('open');
  }
});

dropdown.addEventListener('mouseleave', () => {
  if (window.innerWidth > 768) { // Only trigger on larger screens
    dropdown.classList.remove('open');
  }
});

// Update footer year dynamically
if (footerYear) {
  const currentYear = new Date().getFullYear();
  footerYear.innerHTML = footerYear.innerHTML.replace(/\d{4}/, currentYear);
}

// Counter animation for statistics
function animateCounters() {
  // Extract the numbers from the headings
  const counters = [];
  statCounters.forEach(counter => {
    const text = counter.textContent;
    let number = parseInt(text.match(/\d+/)[0]);
    let prefix = text.split(number)[0].trim();
    let suffix = text.split(number)[1].trim();
    
    counters.push({
      element: counter,
      number: number,
      prefix: prefix,
      suffix: suffix,
      current: 0
    });
    
    // Reset the counter to 0
    counter.textContent = `${prefix} 0 ${suffix}`;
    // Add animating class for visual effect
    counter.classList.add('animating');
  });
  
  // Animate the counters
  const duration = 1000; // 1 second (faster animation)
  const interval = 30; // Update more frequently
  const steps = duration / interval;
  
  const timer = setInterval(() => {
    let allDone = true;
    
    counters.forEach(counter => {
      const increment = counter.number / steps;
      counter.current += increment;
      
      if (counter.current < counter.number) {
        counter.element.textContent = `${counter.prefix} ${Math.floor(counter.current)} ${counter.suffix}`;
        allDone = false;
      } else {
        counter.element.textContent = `${counter.prefix} ${counter.number} ${counter.suffix}`;
      }
    });
    
    if (allDone) {
      clearInterval(timer);
      // Remove animating class when animation is complete
      statCounters.forEach(counter => {
        setTimeout(() => {
          counter.classList.remove('animating');
        }, 300); // Match the CSS transition duration
      });
    }
  }, interval);
}

// Intersection Observer to trigger counter animation when section is visible
function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      observer.unobserve(entry.target); // Only trigger once
    }
  });
}

// Function to handle service items animation
function handleServiceItemsIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Add a small delay for each item to create a staggered effect
      const item = entry.target;
      setTimeout(() => {
        item.classList.add('fade-in');
      }, Array.from(serviceItems).indexOf(item) * 150); // 150ms delay between each item
      
      observer.unobserve(item); // Only trigger once
    }
  });
}

// Call the function to set active page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setActivePage();
  
  // Set up the Intersection Observer for counter animation
  if (aboutSection && statCounters.length > 0) {
    const counterObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.5 // Trigger when 50% of the section is visible
    });
    counterObserver.observe(aboutSection);
  }
  
  // Set up the Intersection Observer for service items animation
  if (serviceItems.length > 0) {
    const serviceObserver = new IntersectionObserver(handleServiceItemsIntersection, {
      threshold: 0.2 // Trigger when 20% of the item is visible
    });
    
    serviceItems.forEach(item => {
      serviceObserver.observe(item);
    });
  }
});