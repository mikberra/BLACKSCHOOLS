document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    
    navbar.innerHTML = `
        <a href="index.html" style="color: white;">
        <div class="t3">
            BLACK SCHOOLS
        </div>
        </a>
        <div class="navbar-right">
            <button class="nav-button" onclick="window.location.href='index.html#explore'">Explore</button>
            <button class="nav-button" onclick="window.location.href='preserve.html'">For Organizations</button>
            <button class="nav-button" onclick="window.location.href='educate.html'">For Educators</button>
        </div>
    `;

    // Insert the navbar at the beginning of the body
    document.body.insertBefore(navbar, document.body.firstChild);
});