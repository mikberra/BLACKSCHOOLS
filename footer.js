function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'bg-dark text-white';
    
    footer.innerHTML = `
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5">
                <div class="col-md-10 col-lg-10 col-xl-10">
                    <div class="t2"><span style="color: var(--bs-warning)">Black Schools</span> Reconstructing an American History</div>
                    <div class="h5">African American Cultural Heritage Action Fund</div>
                    <ul class="list-inline">
                        <li class="list-inline-item">
                            <a href="#!">
                                <span class="fa-stack fa-lg">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fab fa-twitter fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                        <li class="list-inline-item">
                            <a href="#!">
                                <span class="fa-stack fa-lg">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fab fa-facebook-f fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                        <li class="list-inline-item">
                            <a href="#!">
                                <span class="fa-stack fa-lg">
                                    <i class="fas fa-circle fa-stack-2x"></i>
                                    <i class="fab fa-github fa-stack-1x fa-inverse"></i>
                                </span>
                            </a>
                        </li>
                    </ul>
                    <div class="small text-muted fst-italic">Copyright &copy; Your Website 2023</div>
                </div>
            </div>
        </div>
    `;

    // Find the body element and append the footer
    document.body.appendChild(footer);
}

// Call the function when the document is loaded
document.addEventListener('DOMContentLoaded', createFooter); 